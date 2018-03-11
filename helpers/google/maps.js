export const client = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY,
  Promise: global.Promise,
})
