const express = require('express')
const mysql = require('mysql')
const myconn = require('express-myconnection')
const cors = require('cors')

const routes = require('./routes')

const app = express()
app.set('port', process.env.PORT || 9000)
const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'prueba'
}

// middlewares -------------------------------------
app.use(myconn(mysql, dbOptions, 'single'))
app.use(express.json())
app.use(cors())

// routes -------------------------------------------
app.get('/', (req, res)=>{
    res.send({
        message:'Welcome to my API despues vemos',
        DB_HOST: process.env.HOST_ENV,
        DB_USER: process.env.MYSQL_USER,
        DB_PASS: process.env.MYSQL_PASSWORD,
        DB_NAME: process.env.MYSQL_DATABASE,
        DB_URL: process.env.DB_URL
    })
})

app.get('/inicio', (req, res) => {
    res.send({
        message:'Welcome to my API despues vemos',
        DB_HOST: process.env.HOST_ENV,
        DB_USER: process.env.MYSQL_USER,
        DB_PASS: process.env.MYSQL_PASSWORD,
        DB_NAME: process.env.MYSQL_DATABASE,
        DB_URL: process.env.DB_URL
    })
});

app.use('/api', routes)

// server running -----------------------------------
app.listen(app.get('port'), ()=>{
    console.log('server running on port', app.get('port'))
})
