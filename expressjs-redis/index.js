const app = require('express')()
const redis = require('redis')
const redisClient = redis.createClient({ url: 'redis://redis-server:6379' });
redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => await redisClient.connect())()

app.get('/', async (req, res) => {
  try {
    let visits = await redisClient.get('visits')
    if (!visits) {
      visits = 0
    }
    visits++
    await redisClient.set('visits', visits)
    return res.status(200).send(`visit is ${visits}`)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

app.listen(5000, () => console.log('Listening on port 5000'))
