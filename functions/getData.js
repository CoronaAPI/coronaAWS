const fetch = require('isomorphic-unfetch')
const AWS = require('aws-sdk')
AWS.config.update({ region: 'eu-central-1' })
const docClient = new AWS.DynamoDB.DocumentClient()
const { uuid } = require('uuidv4')
const dayjs = require('dayjs')

exports.handler = (event, context, callback) => {
  const uploadJSONtoDynamoDB = async (data) => {
    const ddbTable = process.env.DDBtable
    // Separate into batches for upload
    const batches = []
    const BATCH_SIZE = 25

    while (data.length > 0) {
      batches.push(data.splice(0, BATCH_SIZE))
    }

    console.log('Batches: ', batches.length)

    let batchCount = 0

    // Save each batch
    await Promise.all(
      batches.map(async (itemData) => {
        // Set up the params object for the DDB call
        const params = {
          RequestItems: {}
        }
        params.RequestItems[ddbTable] = []

        itemData.forEach((item) => {
          for (const key of Object.keys(item)) {
            // An AttributeValue may not contain an empty string
            if (item[key] === '') {
              delete item[key]
            }
          }

          // Build params
          // console.log(item)
          params.RequestItems[ddbTable].push({
            PutRequest: {
              Item: {
                ID: uuid(),
                ...item
              }
            }
          })
        })

        // Push to DynamoDB in batches
        batchCount++
        console.log('Trying batch: ', batchCount)
        const result = await docClient.batchWrite(params).promise()
        console.log('Success: ', result)
      })
    )
  }

  const response = (body) => {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      isBase64Encoded: false
    }
  }

  async function checkScraperReport() {
    try {
      const r = await fetch('https://coronadatascraper.com/report.json')
      const data = await r.json()
      console.log('date:', data.date)
      return data.date === dayjs().format('YYYY-M-D')
    } catch (err) {
      console.error(err)
    }
  }

  async function getDailyData() {
    try {
      const r = await fetch('https://coronadatascraper.com/data.json')
      const data = await r.json()
      const stringDate = dayjs().format('YYYY-MM-DD')
      const updateDate = dayjs().format('YYYY-MM-DD HH:mm:ss')

      data.forEach(entry => {
        entry.date = stringDate
        entry.updated = updateDate
      })

      return data
    } catch (err) {
      console.error(err)
    }
  }

  async function pushToDb(data) {
    const ddbResult = await uploadJSONtoDynamoDB(data)
    console.log('DDBresult: ', ddbResult)
  }

  const updated = checkScraperReport()
  if (updated) {
    getDailyData()
      .then(data => {
        pushToDb(data)
        callback(null, response({ msg: `Successfully Grabbed New Data - ${dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]')}` }))
      })
  }
}
