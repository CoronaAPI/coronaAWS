import { getDynamoData } from './utils/database'
const {
  coronaDataMapper,
  ratingFilter,
  sourceFilter,
  countryFilter,
  stateFilter,
  countyFilter,
  cityFilter
} = require('./utils/functions')

exports.handler = function (event, context, callback) {
  const redis = require('./utils/redis')()

  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, 0)
  const day = `${today.getDate()}`.padStart(2, 0)
  const keyDate = [year, month, day].join('')
  let key = `dailyv1-${keyDate}-`

  let countryParam = ''
  let minRating = ''
  let countryLevel = ''
  let stateParam = ''
  let countyParam = ''
  let cityParam = ''
  let source = ''
  if (event.queryStringParameters) {
    countryParam = event.queryStringParameters.country
    minRating = event.queryStringParameters.rating
    countryLevel = event.queryStringParameters.countryLevelOnly
    stateParam = event.queryStringParameters.state
    countyParam = event.queryStringParameters.county
    cityParam = event.queryStringParameters.city
    source = event.queryStringParameters.source
  }

  const queryKeys = [
    countryParam,
    minRating,
    countryLevel,
    stateParam,
    countyParam,
    cityParam,
    source
  ].join('')
  key = key + queryKeys
  console.log('Key: ', key)

  let error, response

  redis.on('ready', function () {
    redis.get(key, async (err, res) => {
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
            if (err) {
              console.error('Unable to query. Error:', JSON.stringify(err, null, 2))
            } else {
              console.log('Query succeeded.')
              console.log('Pre Filter: ', data.Items.length)
              let returnBody = data.Items
              if (queryKeys !== '') {
                returnBody = data.Items
                  .map(coronaDataMapper)
                  .filter(ratingFilter(minRating))
                  .filter(countryFilter(countryParam))
                  .filter(stateFilter(stateParam))
                  .filter(countyFilter(countyParam))
                  .filter(cityFilter(cityParam))
                  .filter(sourceFilter(source))
              }
              console.log(
                'Post Filter: ', returnBody.length
              )
              redis.setex(key, 3600, JSON.stringify(returnBody), (err) => {
                if (err) {
                  redis.quit(() => {
                    error = err
                  })
                } else {
                  redis.quit(() => {
                    response = returnBody
                  })
                }
              })
              return data.Items
            }
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
