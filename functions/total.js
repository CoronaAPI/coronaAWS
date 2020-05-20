import { getDynamoData } from './utils/database'
const { reduceData } = require('./utils/functions')

exports.handler = function (event, context, callback) {
  const redis = require('./utils/redis')()

  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, 0)
  const day = `${today.getDate()}`.padStart(2, 0)
  const keyDate = [year, month, day].join('')
  const key = `totalv1-${keyDate}-`

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
            console.log('Pre Filter: ', JSON.stringify(data).substr(0, 90))
            const onlyCounties = data.Items.filter(l => (l.county || l.aggregate === 'county') && !l.city)
            const onlyStates = data.Items.filter(l => l.state && !l.county)
            const onlyCountries = data.Items.filter(l => l.country && !l.state && !l.county)
            const total = {
              cases: 0,
              active: 0,
              deaths: 0,
              recovered: 0,
              countries: []
            }

            reduceData(onlyCounties, total)
            reduceData(onlyStates, total)
            reduceData(onlyCountries, total)

            redis.setex(key, 3600, JSON.stringify(total), (err) => {
              if (err) {
                redis.quit(() => {
                  error = err
                })
              } else {
                redis.quit(() => {
                  response = total
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
