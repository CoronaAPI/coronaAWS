exports.handler = (event, context, callback) => {
  const redis = require('./utils/redis')()
  const response = body => {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      isBase64Encoded: false
    }
  }
  redis.flushdb((err, succeeded) => {
    if (err) {
      console.error(err)
      return context.fail(response(err))
    }
    if (succeeded) {
      console.log(succeeded) // will be true if successfull
      return context.succeed(response(succeeded))
    }
  })
}
