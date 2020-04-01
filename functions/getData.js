exports.handler = (event, context, callback) => {
  const fs = require('fs')
  const exec = require('child_process').exec
  const fetch = require('isomorphic-unfetch')
  const AWS = require('aws-sdk')
  const s3 = new AWS.S3()

  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, 0)
  const day = `${today.getDate()}`.padStart(2, 0)
  const stringDate = [year, month, day].join('-')
  const fileDate = [year, month, day].join('')

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
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `data-json-${fileDate}.json`,
        Body: data
      }
      // fs.writeFileSync(`/tmp/${stringDate}/data-aws-${fileDate}.json`, JSON.stringify(data))
      s3.putObject(params, (err, data) => {
        if (err) {
          console.error(err)
          return context.fail(response({ status: 500, msg: err }))
        } else {
          return context.succeed(response({ status: 200, msg: data }))
        }
      })

      // exec(`aws s3 cp /tmp/${stringDate}/data-aws-${fileDate}.json s3://corona-api-json-content`, (err, stdout, stderr) => {
      //   if (err) {
      //     return context.fail(response({ status: 'Error', msg: err || stderr }))
      //   } else {
      //     return context.succeed(response({ status: 'Success', msg: stdout }))
      //   }
      // })
    })

  // fs.readFile(`/tmp/${stringDate}/data.json`, 'utf8', (err, data) => {
  //   if (err) throw err
  //   const fileContent = JSON.parse(data)
  //   fileContent.forEach(entry => {
  //     entry.date = stringDate
  //   })
  //   fs.writeFileSync(`/tmp/${stringDate}/data-aws-${fileDate}.json`, JSON.stringify(fileContent))
  //   exec(`aws s3 cp /tmp/${stringDate}/data-aws-${fileDate}.json s3://corona-api-json-content`, (err, stdout, stderr) => {
  //     if (err) {
  //       return context.fail(response({ status: 'Error', msg: err || stderr }))
  //     } else {
  //       return context.succeed(response({ status: 'Success', msg: stdout }))
  //     }
  //   })
  // })
}
