import * as amplitude from '@amplitude/analytics-browser';

const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

amplitude.init(AMPLITUDE_API_KEY || '');

export const trackEvent = (eventName, eventProperties = {}) => {
  amplitude.track(eventName, eventProperties);
};

export const setUser = (userId, userProps = {}) => {
  amplitude.setUserId(userId);
  amplitude.setUserProperties(userProps);
};
