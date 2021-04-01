const { PasswordAuthStrategy } = require('@keystonejs/auth-password')
const { Text, Password } = require('@keystonejs/fields')

const access = require('./access')

module.exports = keystone => {
  keystone.createList('User', {
    fields: {
      firstName: {
        type: Text,
        isRequired: true
      },
      lastName: {
        type: Text,
        isRequired: true
      },
      email: {
        type: Text,
        isUnique: true,
        isRequired: true
      },
      phone: {
        type: Text
      },
      password: {
        type: Password,
        isRequired: true
      },
      // avatar: { type: Image}
    },
    labelResolver: item => {
      return `${item.firstName} ${item.lastName}`
    },
    access: {
      read: access.userOwnsItem,
      update: access.userOwnsItem,
      delete: access.isAdmin,
      auth: true,
    },
    queryLimits: {
      maxResults: 100
    }
  })

  keystone.createAuthStrategy({
    type: PasswordAuthStrategy,
    list: 'User',
    config: { protectIdentities: process.env.NODE_ENV === 'production' },
  })
}