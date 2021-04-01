const fs = require('fs')

module.exports = async keystone => {
  fs.readdirSync('initialData/data').forEach(file => {
    require(`./data/${file}`)(keystone)
  })
}