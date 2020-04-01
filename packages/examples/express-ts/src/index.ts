import express from 'express'
import router from './router'

const app = express()

app.get('/order', (req, res) => {
  req.statusCode = 200
})

app.use(router)

console.log('Listening in port 3000....')
app.listen(3000)
