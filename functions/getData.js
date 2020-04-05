// https://github.com/jbesw/reinvent-svs214/blob/master/3-dynamodb/importFunction/app.js
// (e => t => { console = new Proxy(console, { get: (e, o) => (...l) => (e[o](...l), fetch('https://console.watch/' + t, { method: 'POST', body: JSON.stringify({ method: o, args: l }) })) }), addEventListener = (t, o) => e(t, t !== 'fetch' ? o : e => { const { respondWith: t, waitUntil: l } = e; e.respondWith = function (o) { const n = (o = Promise.resolve(o).catch(e => { throw console.error(e.message), e })).finally(() => new Promise(e => setTimeout(e, 500))); return l.call(e, n), t.call(e, o) }, o(e) }) })(addEventListener)('KgbeqflnIAMCFmw=')

exports.handler = (event, context, callback) => {
  const fetch = require('isomorphic-unfetch')
  const AWS = require('aws-sdk')
  AWS.config.update({ region: 'eu-central-1' })
  const docClient = new AWS.DynamoDB.DocumentClient()
  const { uuid } = require('uuidv4')
  const ddbTable = process.env.DDBtable

  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, 0)
  const day = `${today.getDate()}`.padStart(2, 0)
  const minutes = today.getMinutes()
  const hours = today.getHours()
  const seconds = today.getSeconds()
  const stringDate = [year, month, day].join('-')
  const updateDate = `${stringDate} ${hours}:${minutes}:${seconds} UTC`

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
        try {
          batchCount++
          console.log('Trying batch: ', batchCount)
          const dbWrite = await docClient.batchWrite(params).promise()
          console.log(
            'Success: ',
            typeof dbWrite === 'string'
              ? dbWrite.substr(0, 100)
              : JSON.stringify(dbWrite).substr(0, 100)
          )
        } catch (err) {
          console.error('Error: ', err)
        }
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

  console.log('prefetch')
  fetch('https://coronadatascraper.com/data.json')
    .then((r) => r.json())
    .then((data) => {
      console.log('postfetch', JSON.stringify(data).substr(0, 50))
      data.forEach((entry) => {
        entry.date = stringDate
        entry.updated = updateDate
      })
      const result = uploadJSONtoDynamoDB(data)
      if (result) {
        return context.succeed(response({ status: 200, msg: result }))
      } else {
        return context.fail(response({ status: 500, msg: result }))
      }
    })
}
