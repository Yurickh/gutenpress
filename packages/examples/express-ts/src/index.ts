import express from 'express'
import router from './router'

const app = express()

app.use(router)

console.log('Listening in port 3000....')
app.listen(3000)
