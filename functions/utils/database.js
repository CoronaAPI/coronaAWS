export async function getDynamoData() {
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
    const body = TableData.Items.filter(
        (item) => item.date === `${year}-${month}-${day}`
    )
    return body
}