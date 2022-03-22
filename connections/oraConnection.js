import oracledb from "oracledb"

export const baseSelect = `ABS.BUD_AGRO_OBJS_V.OBJ_NAME, ABS.AGRO_BASES_V.BASES_NAME, 
  ABS.AGRO_TREES_V.NODE_NAME, ABS.AGRO_TRANSPORT_V.REG_NOM, TD.ATTR_VALUE, 
  ABS.AGRO_NAV_TRANSP_V.NAV_ID, ABS.AGRO_NAV_TRANSP_V.LAST_SIGNAL_DATE, ABS.AGRO_NAV_TRANSP_V.LAST_LON, 
  ABS.AGRO_NAV_TRANSP_V.LAST_LAT, ABS.AGRO_TRANSPORT_V.REGION_ID, 
  ABS.AGRO_TRANSPORT_V.FARM_ID, ABS.AGRO_TRANSPORT_V.BASE_ID, 
  ABS.AGRO_TRANSPORT_V.NODE_ID, ABS.AGRO_TRANSPORT_V.TRANSP_ID`

const runOracleConnection = async oraRequest => {
    let oraConnection;

    try {
        oraConnection = await oracledb.getConnection( {
            user          : process.env.ORACLE_LOGIN,
            password      : process.env.ORACLE_PASS,
            connectString : process.env.ORACLE_CONNECT_STRING
        });
        console.log('OracleBD connected...')

        return await oraConnection.execute(oraRequest);

    } catch (err) {
        console.error(err);
    } finally {
        if (oraConnection) {
            try {
                await oraConnection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

export default  runOracleConnection