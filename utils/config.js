const { NOW } = process.env
const host = NOW ? 'https://api.there.pm' : 'http://localhost:9900'
const mixpanelProjectToken = NOW
  ? 'e7859c5640d175b8f34d425735fba85e' // PROD
  : '31a53a5d9fb1a091846b5abffac684e7' // DEV

export default {
  apiUrl: host,
  mixpanelProjectToken,

  // users
  maxPinned: 4,

  // flags
  countryFlagsHash: 'EkD3d',
}
