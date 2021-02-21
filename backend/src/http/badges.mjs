import axios from 'axios'
import CircuiotBreaker from 'opossum';
import dotenv from 'dotenv';

dotenv.config();

const badgesHost = process.env['BADGES_HOST'];

const options = {
    timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
    resetTimeout: 30000 // After 30 seconds, try again.
  };

export const createPresenterBadge = new CircuiotBreaker(presenterBadgeRequest, options);
export const createAttendeeBadge = new CircuiotBreaker(attendeeBadgeRequest, options);

async function presenterBadgeRequest(eventId, badgeData, authorization) {
    return axios.post(`${badgesHost}/api/${eventId}/presenter`, badgeData, {headers: {Authorization: authorization}});
}

async function attendeeBadgeRequest(eventId, badgeData, authorization) {
    return axios.post(`${badgesHost}/api/${eventId}/attendee`, badgeData, {headers: {Authorization: authorization}});
}