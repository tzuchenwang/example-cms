const { Text, Checkbox, Password } = require('@keystonejs/fields')

const access = require('./access')

module.exports = keystone => {
  keystone.createList('Admin', {
    fields: {
      name: {
        type: Text,
        isRequired: true
      },
      email: {
        type: Text,
        isUnique: true,
        isRequired: true
      },
      isAdmin: {
        type: Checkbox,
        defaultValue: true,
        access: {
          update: access.isSuperAdmin,
        },
      },
      isSuperAdmin: {
        type: Checkbox,
        // Field-level access controls
        // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
        access: {
          update: access.isSuperAdmin
        }
      },
      password: {
        type: Password,
        isRequired: true
      }
    },
    // List-level access controls
    access: {
      read: access.isAdmin,
      update: access.adminOwnsItem,
      create: access.isSuperAdmin,
      delete: access.isSuperAdmin,
      auth: true,
    },
    queryLimits: {
      maxResults: 100
    }
  })
}