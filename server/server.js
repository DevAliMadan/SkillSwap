const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const logger = require('morgan')
const cors = require('cors')

const skillRoutes = require('./routes/skillRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const swapRoutes = require('./routes/swapRoutes')
const massageRoutes = require('./routes/massageRoutes')

dotenv.config()
const app = express()




mongoose.connect(process.env.DB_URI)
mongoose.connection.on('connected', ()=>{
    console.log('connected to mongoDB')
})

app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json())
app.use(logger('dev'))
app.use('/auth', authRoutes)
app.use('/massage', massageRoutes)
app.use('/user', userRoutes)
app.use('/swap', swapRoutes)
app.use('/skill', skillRoutes)

require('./src/socket/socketHandlers')(io);

app.use(require('./src/middleware/errorHandler'));

app.listen(3000, () => {
    console.log('App is listening!')
})