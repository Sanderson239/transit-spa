import * as TYPES from '../constants/constants';

export function updateCurrentLocation(location) {
  return {
    type: TYPES.UPDATE_CURRENT_LOCATION,
    currentLocation: location,
  };
}

export function addDestination(dest) {
  return {
    type: TYPES.ADD_DESTINATION,
    destination: dest,
  };
}

export function addJourneys(destinationId, journeys) {
  return {
    type: TYPES.ADD_JOURNEYS,
    destinationId,
    journeys,
  };
}

export function removeJourney(destinationId, index) {
  return {
    type: TYPES.REMOVE_JOURNEY,
    destinationId,
    index,
  };
}

export function removeDestination(destinationId) {
  return {
    type: TYPES.REMOVE_DESTINATION,
    destinationId,
  };
}

export function fetchAlerts() {
  return async (dispatch, { Api }) => {
    const alertsById = await Api.fetchAlerts();
    await dispatch({
      type: TYPES.ALERTS_RETRIEVED,
      alerts: alertsById
    })
  }
}

export function fetchJourneys(destinationId, origin, destination) {
  return async (dispatch, getState, { Api }) => {
    const json = await Api.fetchJourneys(origin, destination);

    const journeys = json.map((rawJourneyObj) => {
      const journeyObj = {
        destination: rawJourneyObj.legs[0].end_address,
        arrivalTimeText: rawJourneyObj.legs[0].arrival_time.text,
        departureTimeUTC: rawJourneyObj.legs[0].departure_time.value,
        transitSteps: rawJourneyObj.legs[0].steps.map((step) => {
          const stepObj = {
            instruction: step.html_instructions,
            mode: step.travel_mode,
            duration: step.duration.text,
          };
          return stepObj;
        }),
      };
      return journeyObj;
    });

    return dispatch(addJourneys(destinationId, journeys));
  };
}
