import Sequelize from 'sequelize'
import chalk from 'chalk'

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env
const sequelize = new Sequelize(
  `mysql://${DB_USERNAME}:${DB_PASSWORD}@de.mysql.there.pm:3306/${DB_NAME}`,
)

export const connectToDb = async () => {
  try {
    await sequelize.authenticate()
    console.log(
      `${chalk.green(`[DB]`)} Connection has been established successfully.`,
    )
  } catch (error) {
    console.error(
      `${chalk.redBright(`[DB]`)} Unable to connect to the database:`,
      error,
    )
  }
}

// MODELS
const types = {
  UuidAsId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  Email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
    },
  },
}

export const User = sequelize.define('user', {
  id: types.UuidAsId,
  twitterId: { type: Sequelize.STRING, unique: true },

  // Person
  email: types.Email,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  fullName: Sequelize.STRING,
  photoUrl: Sequelize.TEXT,
  twitterHandle: Sequelize.STRING,

  // Timezone
  city: Sequelize.STRING,
  fullLocation: Sequelize.TEXT,
  timezone: Sequelize.STRING,
})

export const ManualPerson = sequelize.define('manualPerson', {
  id: types.UuidAsId,

  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  photoUrl: Sequelize.TEXT,
  twitterHandle: Sequelize.STRING,

  city: Sequelize.TEXT,
  fullLocation: Sequelize.TEXT,
  timezone: Sequelize.STRING,
})

export const ManualPlace = sequelize.define('manualPlace', {
  id: types.UuidAsId,

  name: Sequelize.STRING,
  photoUrl: Sequelize.TEXT,

  city: Sequelize.TEXT,
  fullLocation: Sequelize.TEXT,
  timezone: Sequelize.STRING,
})

// Set associations
User.belongsToMany(User, { as: 'following', through: 'userFollowings' })
User.hasMany(ManualPerson)
User.hasMany(ManualPlace)
