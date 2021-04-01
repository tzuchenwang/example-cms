require('dotenv').config()

const { Keystone } = require('@keystonejs/keystone')
const { PasswordAuthStrategy } = require('@keystonejs/auth-password')
const { GraphQLApp } = require('@keystonejs/app-graphql')
const { AdminUIApp } = require('@keystonejs/app-admin-ui')
const initialiseData = require('./initialData')

const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose')
const PROJECT_NAME = process.env.PROJECT_NAME
const adapterConfig = { mongoUri: process.env.MONGO_URI }

const MongoStore = require('connect-mongo')

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  onConnect: process.env.CREATE_TABLES !== 'true' && initialiseData,
  cookieSecret: process.env.COOKIE_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Default to true in production
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
  },
  sessionStore: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  queryLimits: {
    maxTotalResults: 1000
  }
})

const fs = require('fs')
fs.readdirSync('model').forEach(file => {
  if (fs.lstatSync(`model/${file}`).isFile())
    require(`./model/${file}`)(keystone)
})

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'Admin',
  config: { protectIdentities: process.env.NODE_ENV === 'production' }
})

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: true,
      authStrategy
    })
  ]
}