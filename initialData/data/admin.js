module.exports = async keystone => {
  // Count existing admins
  const {
    data: {
      _allAdminsMeta: { count = 0 },
    },
  } = await keystone.executeGraphQL({
    context: keystone.createContext().sudo(),
    query: `query {
      _allAdminsMeta {
        count
      }
    }`,
  })

  if (count === 0) {
    const password = process.env.SUPER_ADMIN_PASSWORD
    const email = process.env.SUPER_ADMIN_EMAIL

    const { errors } = await keystone.executeGraphQL({
      context: keystone.createContext().sudo(),
      query: `mutation initialAdmin($password: String, $email: String) {
            createAdmin(data: {
              name: "Admin",
              email: $email,
              isAdmin: true,
              isSuperAdmin: true,
              password: $password
            }) {
              id
            }
          }`,
      variables: { password, email },
    })

    if (errors) {
      console.log('failed to create initial admin:')
      console.log(errors)
    } else {
      console.log(`

      Admin created:
        email: ${email}
        password: ${password}
      Please change these details after initial login.
      `)
    }
  }
}