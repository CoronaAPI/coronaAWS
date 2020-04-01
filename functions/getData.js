// https://github.com/jbesw/reinvent-svs214/blob/master/3-dynamodb/importFunction/app.js

exports.handler = async (event, context, callback) => {
  const fetch = require('isomorphic-unfetch')
  const AWS = require('aws-sdk')
  const docClient = new AWS.DynamoDB.DocumentClient()
  const uuidv4 = require('uuid/v4')
  const ddbTable = process.env.DDBtable

  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, 0)
  const day = `${today.getDate()}`.padStart(2, 0)
  const stringDate = [year, month, day].join('-')

  const uploadJSONtoDynamoDB = async (data) => {
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

        itemData.forEach(item => {
          for (const key of Object.keys(item)) {
            // An AttributeValue may not contain an empty string
            if (item[key] === '') { delete item[key] }
          }

          // Build params
          console.log(item)
          params.RequestItems[ddbTable].push({
            PutRequest: {
              Item: {
                ID: uuidv4(),
                ...item
              }
            }
          })
        })

        // Push to DynamoDB in batches
        try {
          batchCount++
          console.log('Trying batch: ', batchCount)
          const result = await docClient.batchWrite(params).promise()
          console.log('Success: ', result)
        } catch (err) {
          console.error('Error: ', err)
        }
      })
    )
  }

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

  fetch('https://coronadatascraper.com/data.json')
    .then(r => r.json())
    .then(data => {
      data.forEach(entry => {
        entry.date = stringDate
      })
      const result = uploadJSONtoDynamoDB(data)
      if (result) {
        return context.succeed(response({ status: 200, msg: result }))
      } else {
        return context.fail(response({ status: 500, msg: result }))
      }
    })
}
