const AWS = require('aws-sdk')
AWS.config.region = (process.env.AWS_REGION || 'eu-central-1')
const s3 = new AWS.S3()

// Returns object from S3

// let params = {
//   Bucket: record.s3.bucket.name,
//   Key: record.s3.object.key
// }

async function getS3object (params) {
  return new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
      if (err) {
        console.error('getS3object error: ', err, err.stack) // an error occurred
        reject(err)
      }
      resolve(data)
    })
  })
}

// Puts object to S3 //

// e.g. params = {
//   Bucket: record.s3.bucket.name,
//   Key: record.s3.object.key
//   Body: data,
//   ContentType: res.headers['content-type'],
//   CacheControl: 'max-age=31536000',
//   ACL: 'public-read',
//   StorageClass: 'STANDARD'
// }

async function putS3object (params) {
  console.log('putS3object params: ', params)
  return new Promise((resolve, reject) => {
    s3.putObject(params, function (err, data) {
      if (err) {
        console.log('putS3object error: ', err, err.stack) // an error occurred
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = {
  getS3object,
  putS3object
}
