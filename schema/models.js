export const people = []

export class Models {
  constructor({ firebase }) {
    this.db = firebase.db
  }

  setTitle(newTitle) {
    return this.db.ref('title').set(newTitle)
  }

  /**
   * Set additional data such as email, location, and timezone
   * for user by its `uid`
   *
   * @param {ID} uid
   * @param {Object} user
   */
  updateUser(uid, user) {
    return this.db.ref(`users/${uid}`).update(user)
  }
}
