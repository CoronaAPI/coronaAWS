export async function getDynamoData (callback) {
  const AWS = require('aws-sdk')
  const dynamo = new AWS.DynamoDB.DocumentClient()

  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, 0)
  const day = `${today.getDate()}`.padStart(2, 0)

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

  await dynamo.query(params, (err, data) => callback(err, data))
}
