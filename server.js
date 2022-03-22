import {} from 'dotenv/config'
import oracledb from 'oracledb'
import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import morgan from 'morgan'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import oraRouter from './routes/oraRoutes.js'
import mongoRouter from './routes/mongoRouter.js'
import outlookRouter from './routes/outlookRouter.js'
import uploadFileRouter from './routes/uploadFileRouter.js'
import * as path from "path";
// import {copyActs, migrateBase} from "./baseMigration/baseMigration.js";


oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(oraRouter)
app.use(mongoRouter)
app.use(outlookRouter)
app.use(uploadFileRouter)



app.listen(process.env.EXPRESS_PORT,  () => {
    console.log(`Server has been started on port ${process.env.EXPRESS_PORT}...`);
});

mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`, () => {
    console.log('Mongoose connected...')
});


if (process.env.NODE_ENV === 'development') {
    oracledb.initOracleClient({libDir: process.env.ORACLE_CLIENT_PATH});
}

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

// migrateBase()
// copyActs()


