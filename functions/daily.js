const {
  coronaDataMapper,
  ratingFilter,
  sourceFilter,
  countryFilter,
  stateFilter,
  countyFilter,
  cityFilter
} = require('./utils/functions')

async function getDynamoData() {
  const AWS = require('aws-sdk')
  const dynamo = new AWS.DynamoDB.DocumentClient()

  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, 0)
  const day = `${today.getDate()}`.padStart(2, 0)
<<<<<<< Updated upstream

  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.04.html
  var params = {
    TableName: 'corona1',
    IndexName: 'date-index',
    ExpressionAttributeNames: {
      '#d': 'date'
    },
    ExpressionAttributeValues: {
      ':d': `${year}-${month}-${day}`
    },
    KeyConditionExpression: '#d = :d'
  }

  const returnData = await dynamo.query(params, function (err, data) {
    if (err) {
      console.error('Unable to query. Error:', JSON.stringify(err, null, 2))
    } else {
      console.log('Query succeeded.')
      // data.Items.forEach(function (item) {
      //   console.log(item)
      // })
      return data
    }
    return returnData
  })
=======
  const TableData = await dynamo
    .scan({
      TableName: process.env.DDBtable
    })
    .promise()
  const count1 = TableData.Items.length // count1 = 1821
  const returnObj = []
  TableData.Items.forEach(item => {
    if (item.date && item.date === '2020-05-15') {
      returnObj.push(item)
    } else if (item.updated && item.updated.includes('2020-05-15')) {
      console.log(typeof item.updated)
      returnObj.push(item)
    }
  })
  const count2 = returnObj.length // count2 = 92
  return { returnObj, count1, count2 }
>>>>>>> Stashed changes
}

exports.handler = function (event, context, callback) {
  const redis = require('./utils/redis')()
  const AWS = require('aws-sdk')
  const dynamo = new AWS.DynamoDB.DocumentClient()

  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, 0)
  const day = `${today.getDate()}`.padStart(2, 0)
  const keyDate = [year, month, day].join('')
  let key = `dailyv1-${keyDate}-`

  var params = {
    TableName: 'corona1',
    IndexName: 'date-index',
    ExpressionAttributeNames: {
      '#d': 'date'
    },
    ExpressionAttributeValues: {
      ':d': `${year}-${month}-${day}`
    },
    KeyConditionExpression: '#d = :d'
  }

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
<<<<<<< Updated upstream
          dynamo.query(params, function (err, data) {
=======
          const { returnObj, count1, count2 } = await getDynamoData()
          console.log('count1', count1)
          console.log('count2', count2)

          console.log('Pre Filter: ', returnObj.length)
          let returnBody = returnObj
          if (queryKeys !== '') {
            returnBody = returnObj
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
>>>>>>> Stashed changes
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
