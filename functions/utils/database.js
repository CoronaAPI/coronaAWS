export async function getDynamoData() {
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
}
