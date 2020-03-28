// const AWS = require('aws-sdk');
// const dynamo = new AWS.DynamoDB.DocumentClient();

// exports.handler = async(event, context) => {
//   //console.log('Received event:', JSON.stringify(event, null, 2));
//   let body;
//   let statusCode = '200';
//   const headers = {
//     'Content-Type': 'application/json',
//   };
//   try {
//     switch (event.httpMethod) {
//       case 'GET':
//         const today = new Date()
//         const year = today.getFullYear()
//         const month = `${today.getMonth() + 1}`.padStart(2, 0)
//         const day = `${today.getDate()}`.padStart(2, 0)
//         const stringDate = [year, month, day].join("-")
//         const TableData = await dynamo.scan({ TableName: 'serverlessrepo-s3-to-dynamodb-importer-json-DDBtable-QF81U10PRNS6' }).promise();
//         body = TableData.Items.filter(item => item.date === `${year}-${month}-${day}`)
//         break;
//       default:
//         throw new Error(`Unsupported method "${event.httpMethod}"`);
//     }
//   }
//   catch (err) {
//     statusCode = '400';
//     body = err.message;
//   }
//   finally {
//     body = JSON.stringify(body);
//   }
//   return {
//     statusCode,
//     body,
//     headers,
//   };
// };

const lib = require('./handler')

module.exports.handler = function(event, context) {
  lib.respond(event, (err, res) => {
    if (err) {
      return context.fail(err)
    }
    else {
      return context.succeed(res)
    }
  })
}

