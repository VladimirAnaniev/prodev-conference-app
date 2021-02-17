import axios from 'axios'
import CircuiotBreaker from 'opossum';


const options = {
    timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
    resetTimeout: 30000 // After 30 seconds, try again.
  };
export const createBadge = new CircuiotBreaker(makeBadgeRequest, options);

async function makeBadgeRequest(eventId, accountId, email, presenterName, companyName) {
    // TODO: get url from configurations
    return axios.post(`http://badges/api/event/${eventId}`, {accountId, email, presenterName, companyName});
}