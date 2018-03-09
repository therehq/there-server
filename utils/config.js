const { NOW } = process.env
const host = NOW ? 'https://api.there.pm' : 'http://localhost:9900'

export default {
  apiUrl: host,
}
