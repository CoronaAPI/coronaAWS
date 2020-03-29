exports.handler = function (event, context, callback) {
  const suggestions = [
    'to wash your hands frequently!',
    'to keep a safe distance to others!',
    'to avoid touching eyes, nose and mouth!'
  ]
  const i = Math.floor(Math.random() * suggestions.length)

  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, 0)
  const day = `${today.getDate()}`.padStart(2, 0)
  const dateToday = [year, month, day].join('-')

  const body = {
    lastUpdate: dateToday,
    repo: 'https://github.com/CoronaAPI/CoronaAPI',
    bug: 'https://github.com/CoronaAPI/CoronaAPI/issues/new',
    remember: suggestions[i]
  }
  const resp = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    isBase64Encoded: false
  }
  return context.succeed(resp)
}
