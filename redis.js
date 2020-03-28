module.exports = () => {
  const redis = require('redis')
  const jsonify = require('redis-jsonify')
  const redisOptions = {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
  }

  return jsonify(redis.createClient(redisOptions))
}
