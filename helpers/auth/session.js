import { User } from '../../models'

export const serializeUser = (user, done) => {
  done(null, user.id)
}

export const deserializeUser = (id, done) => {
  if (!id) {
    done(null, {})
    return
  }

  User.findById(id)
    .then(user => {
      if (user) {
        done(null, user.get())
      } else {
        done(null, {})
      }
    })
    .catch(error => done(error, {}))
}
