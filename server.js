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
// import RequestModel from './models/request.js'
// import {copyActs, migrateBase} from "./baseMigration/baseMigration.js";


oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
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
    console.log('MongoDB connected...')
});

if (process.env.NODE_ENV === 'development') {
    oracledb.initOracleClient({libDir: process.env.ORACLE_CLIENT_PATH});
}

export let oraConnection;

try {
    oraConnection = await oracledb.getConnection( {
        user          : process.env.ORACLE_LOGIN,
        password      : process.env.ORACLE_PASS,
        connectString : process.env.ORACLE_CONNECT_STRING
    });
    console.log('OracleDB connected...')


} catch (err) {
    console.error(err);
}


let interval = setInterval(() => {
    try {
        oraConnection.execute(`select 1 from dual`)
        console.log('knocked to base')
    } catch (e) {
        console.log(e)
    }
}, 300000)

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

// const writeVin = async () => {
//     const requests = RequestModel.find()
//     try {
//         for await (const request of requests) {
//             console.log(request._id)
//             const vin = await oraConnection.execute(`SELECT TD.ATTR_VALUE FROM ((ABS.BUD_AGRO_OBJS_V RIGHT JOIN (ABS.AGRO_TREES_V INNER JOIN
//   (ABS.AGRO_BASES_V RIGHT JOIN ABS.AGRO_TRANSPORT_V ON
//   ABS.AGRO_BASES_V.BASE_ID = ABS.AGRO_TRANSPORT_V.BASE_ID) ON
//   ABS.AGRO_TREES_V.NODE_ID = ABS.AGRO_TRANSPORT_V.NODE_ID) ON
//   ABS.BUD_AGRO_OBJS_V.OBJ_ID = ABS.AGRO_TRANSPORT_V.FARM_ID) LEFT JOIN
//   ABS.AGRO_NAV_TRANSP_V ON ABS.AGRO_TRANSPORT_V.TRANSP_ID =
//   ABS.AGRO_NAV_TRANSP_V.TRANSP_ID) LEFT JOIN (SELECT TECH_ID, ATTR_VALUE FROM
//   ABS.AGRO_TECHNIC_DATA_V WHERE ATTR_ID=374) TD ON
//   ABS.AGRO_TRANSPORT_V.TRANSP_ID = TD.TECH_ID WHERE
//   ABS.AGRO_TRANSPORT_V.REG_NOM LIKE '%${request.VehicleRegNum}%'`)
//             console.log(vin)
//             if (vin.rows.length > 0) {
//                 await RequestModel.findOneAndUpdate({_id: request._id}, {VehicleVin: vin.rows[0].ATTR_VALUE})
//             }
//         }
//     } catch (e) {
//         console.log(e)
//     }
// }
// writeVin()

// migrateBase()
// copyActs()


