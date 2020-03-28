const {
  coronaDataMapper,
  casesMap,
  recoveredMap,
  deathMap,
  ratingFilter,
  sourceFilter,
  countryFilter,
  stateFilter,
  countyFilter,
  cityFilter,
  countryDatasourceReducer
} = require('./_utils/functions')

async function getDynamoData() {
  const AWS = require('aws-sdk')
  const dynamo = new AWS.DynamoDB.DocumentClient()

  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, 0)
  const day = `${today.getDate()}`.padStart(2, 0)
  const stringDate = [year, month, day].join('-')
  const TableData = await dynamo
    .scan({
      TableName:
        'serverlessrepo-s3-to-dynamodb-importer-json-DDBtable-QF81U10PRNS6'
    })
    .promise()
  const body = TableData.Items.filter(
    (item) => item.date === `${year}-${month}-${day}`
  )
  return body
}

module.exports.respond = function(event, callback) {
  const redis = require('./_utils/redis')()

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

  }
  console.log('Key: ', key)

  let error, response

  redis.on('end', () => {
    const respArray = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response),
      isBase64Encoded: false
    }
    callback(error, respArray)
  })

  redis.on('ready', function() {
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
          const body = getDynamoData()
          body.then((data) => {
            console.log('Pre Filter: ', JSON.stringify(data).substr(0, 100))
						const returnBody = data
								.map(coronaDataMapper)
								.filter(ratingFilter(minRating))
								.filter(countryFilter(countryParam))
								.filter(stateFilter(stateParam))
								.filter(countyFilter(countyParam))
								.filter(cityFilter(cityParam))
								.filter(sourceFilter(source))
            console.log('Post Filter: ', JSON.stringify(returnBody).substr(0, 100))
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
          })
        }
      }
    })
  })
}
