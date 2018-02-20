import admin from 'firebase-admin'

// Decode admin API key
export const adminSdkCert = JSON.parse(
  Buffer.from(process.env.FIREBASE_ADMIN_SDK, 'base64').toString() || '{}',
)

export class FirebaseConnector {
  constructor() {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(adminSdkCert),
      databaseURL: 'https://there-192619.firebaseio.com',
    })
    this.appDatabase = admin.database(this.app)
  }

  get db() {
    return this.appDatabase
  }

  async close() {
    try {
      await this.app.delete()
    } catch (error) {
      console.log('Error deleting app:', error)
    }
  }
}
