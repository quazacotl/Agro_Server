import {oraConnection} from "../server.js";

const baseString = `SELECT ABS.BUD_AGRO_OBJS_V.OBJ_NAME, ABS.AGRO_BASES_V.BASES_NAME, 
  ABS.AGRO_TREES_V.NODE_NAME, ABS.AGRO_TRANSPORT_V.REG_NOM, TD.ATTR_VALUE, 
  ABS.AGRO_NAV_TRANSP_V.NAV_ID, TO_CHAR(ABS.AGRO_NAV_TRANSP_V.LAST_SIGNAL_DATE, 'YYYY-MM-DD"T"HH24:MI') AS LAST_DATE, ABS.AGRO_NAV_TRANSP_V.LAST_LON, 
  ABS.AGRO_NAV_TRANSP_V.LAST_LAT, ABS.AGRO_TRANSPORT_V.TRANSP_ID, abs.agro_get_region_name( ABS.AGRO_TRANSPORT_V.REGION_ID ) as REGION
FROM
 ((ABS.BUD_AGRO_OBJS_V RIGHT JOIN (ABS.AGRO_TREES_V INNER JOIN 
  (ABS.AGRO_BASES_V RIGHT JOIN ABS.AGRO_TRANSPORT_V ON 
  ABS.AGRO_BASES_V.BASE_ID = ABS.AGRO_TRANSPORT_V.BASE_ID) ON 
  ABS.AGRO_TREES_V.NODE_ID = ABS.AGRO_TRANSPORT_V.NODE_ID) ON 
  ABS.BUD_AGRO_OBJS_V.OBJ_ID = ABS.AGRO_TRANSPORT_V.FARM_ID) LEFT JOIN 
  ABS.AGRO_NAV_TRANSP_V ON ABS.AGRO_TRANSPORT_V.TRANSP_ID = 
  ABS.AGRO_NAV_TRANSP_V.TRANSP_ID) LEFT JOIN (SELECT TECH_ID, ATTR_VALUE FROM 
  ABS.AGRO_TECHNIC_DATA_V WHERE ATTR_ID=374) TD ON 
  ABS.AGRO_TRANSPORT_V.TRANSP_ID = TD.TECH_ID`


export const getVehiclesByRegNum = async function (req, res) {
    try {
        const requests = await oraConnection.execute(`${baseString} WHERE 
  ABS.AGRO_TRANSPORT_V.REG_NOM LIKE '%${req.body.regNum.trim()}%' ORDER BY 
   ABS.AGRO_NAV_TRANSP_V.NAV_ID asc nulls last, ABS.BUD_AGRO_OBJS_V.OBJ_NAME ASC`)
        res.status(200).json(requests.rows)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка сервера: ${e}`})
    }
}

export const getVehiclesById = async function (req, res) {
    try {
        const requests = await oraConnection.execute(`${baseString} WHERE 
  ABS.AGRO_NAV_TRANSP_V.NAV_ID LIKE '%${req.body.id.trim()}%' ORDER BY ABS.BUD_AGRO_OBJS_V.OBJ_NAME ASC`)
        res.status(200).json(requests.rows)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка сервера: ${e}`})
    }
}

export const getVehiclesByVin = async function (req, res) {
    try {
        const requests = await oraConnection.execute(`${baseString} WHERE 
  TD.ATTR_VALUE LIKE '%${req.body.vin.trim()}%' ORDER BY 
   ABS.AGRO_NAV_TRANSP_V.NAV_ID asc nulls last, ABS.BUD_AGRO_OBJS_V.OBJ_NAME ASC`)
        res.status(200).json(requests.rows)
    }
    catch (e) {
        res.status(500).json({message: `Ошибка сервера: ${e}`})
    }
}



