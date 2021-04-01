// Access control functions
module.exports.isAdmin = ({ authentication: { item: admin } }) => {
  return Boolean(admin && (admin.isAdmin || admin.isSuperAdmin))
}

module.exports.isSuperAdmin = ({ authentication: { item: admin } }) => {
  return Boolean(admin && admin.isSuperAdmin)
}

module.exports.adminOwnsItem = ({ authentication: { item: admin } }) => {
  if (!admin) {
    return false
  }
  if (admin.isSuperAdmin) {
    return true
  }

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: admin.id }
}

module.exports.userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false
  }
  if (user.isAdmin || user.isSuperAdmin) {
    return true
  }

  return { id: user.id }
}

module.exports.userOwnsItemRef = ({ authentication: { item: user } }) => {
  if (!user) {
    return false
  }
  if (user.isAdmin || user.isSuperAdmin) {
    return true
  }

  return { user: user }
}