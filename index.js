const lib = require('./handler')

module.exports.handler = function(event, context) {
  lib.respond(event, (err, res) => {
    if (err) {
      return context.fail(err)
    }
    else {
      return context.succeed(res)
    }
  })
}

