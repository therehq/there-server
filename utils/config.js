const { NOW } = process.env
const host = NOW ? 'https://api.there.pm' : 'http://localhost:9900'

export default {
  apiUrl: host,
  mixpanelProjectToken: `e7859c5640d175b8f34d425735fba85e`,
}
