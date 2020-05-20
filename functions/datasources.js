import { getDynamoData } from './utils/database'

exports.handler = function (event, context, callback) {
  const redis = require('./utils/redis')()

  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, 0)
  const day = `${today.getDate()}`.padStart(2, 0)
  const keyDate = [year, month, day].join('')
  const key = `datasources-v1-${keyDate}`

  let error, response
  redis.on('ready', function () {
    redis.get(key, (err, res) => {
      if (err) {
        redis.quit(() => {
          error = err
        })
      } else {
        if (res) {
          console.log('Redis key found')
          redis.quit(() => {
            response = JSON.parse(res)
          })
        } else {
          console.log('Redis key not found')
          getDynamoData((err, data) => {
            if (err) console.error(err)
            const sources = []
            data.Items.map(data => sources.push({ source: data.url }))
            const sourcesArray = [...new Set(sources.map(x => x.source))]

            redis.setex(key, 3600, JSON.stringify(sourcesArray), (err) => {
              if (err) {
                redis.quit(() => {
                  error = err
                })
              } else {
                redis.quit(() => {
                  response = sourcesArray
                })
              }
            })
          })
        }
      }
    })
  })
  redis.on('end', () => {
    if (error) {
      return context.fail(error)
    }
    const respArray = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response),
      isBase64Encoded: false
    }
    return context.succeed(respArray)
  })
}
