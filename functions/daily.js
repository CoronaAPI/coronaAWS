const {
  coronaDataMapper,
  ratingFilter,
  sourceFilter,
  countryFilter,
  stateFilter,
  countyFilter,
  cityFilter
} = require('./utils/functions')

async function getDynamoData () {
  const AWS = require('aws-sdk')
  const dynamo = new AWS.DynamoDB.DocumentClient()

  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, 0)
  const day = `${today.getDate()}`.padStart(2, 0)
  const TableData = await dynamo
    .scan({
      TableName: process.env.DDBtable
    })
    .promise()
  const count1 = TableData.Items.length // count1 = 1821
  const body = TableData.Items.filter(
    // item => item.date === `${year}-${month}-${day}` // = 2020-05-15
    item => item.date === '2020-05-15'
  )
  const count2 = body.length // count2 = 92
  return { body, count1, count2 }
}

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
          const { body, count1, count2 } = await getDynamoData()
          console.log('count1', count1)
          console.log('count2', count2)

          console.log('Pre Filter: ', body.length)
          let returnBody = body
          if (queryKeys !== '') {
            returnBody = body
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
