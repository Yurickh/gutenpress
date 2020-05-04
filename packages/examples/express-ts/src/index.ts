import express from 'express'
import router from './router'

const app = express()

app.use(router)

app.get('/express', (_req, res) => {
  res.send('Express reached')
})

console.log('Listening in port 3000....')
app.listen(3000)
