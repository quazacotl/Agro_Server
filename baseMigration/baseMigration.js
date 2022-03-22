import ADODB from "node-adodb";
import ExecutorModel from "../models/executor.js";
import UserModel from "../models/user.js";
import RegionModel from "../models/region.js";
import RequestModel from "../models/request.js";
import RequestsTypes from "../models/requestsTypes.js";


export function migrateBase() {
    const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=CAAgro.mdb;');

    const query = 'select (select REGION_NAME from REGIONS where REGION_ID = Заявки.REGION_ID) as Region, OBJ_NAME, NODE_ID, BASES_NAME, NODE_NAME, REG_NOM, NAV_ID, Requests.Description, RequestTypes.Description, CreateDate, Executed, Creaters.FIO, Auditors.FIO, Executors.FIO, ExecuteDate, RequestNo from Заявки'


    connection.query(query)
        .then(data => {
            data.forEach(async item => {
                // console.log(item)

                const execId = await ExecutorModel.findOne({name: item['Executors.FIO']}).select('_id')
                const creaId = await UserModel.findOne({name: item['Creaters.FIO']}).select('_id')
                const audId = await UserModel.findOne({name: item['Auditors.FIO']}).select('_id')

                const regionId = await RegionModel.findOne({name: item.Region}).select('_id')

                const setRequestType = () => {
                    switch (item['RequestTypes.Description']) {
                        case 'Отсутствие сигнала GPS':
                            return 'Отсутствие сигнала GPS'
                        case 'Работы с топливом':
                            return 'Работы с топливом'
                        case 'Установка трекера':
                            return 'Установка трекера'
                        case 'Установка Автограф+ДУТ':
                            return 'Установка Автограф+ДУТ'
                        case 'Установка системы учета зерна/удобрений':
                            return 'Ремонт/установка системы учета зерна/удобрений'
                        case 'Ремонт системы учета зерна/удобрений':
                            return 'Ремонт/установка системы учета зерна/удобрений'
                        case 'Тахограф':
                            return 'Тахограф'
                        case 'Прочее':
                            return 'Прочее'
                        case 'Планшеты':
                            return 'Планшеты'
                        case 'Метеостанция':
                            return 'Метеостанция'
                        case 'Сигнализация':
                            return 'Сигнализация'
                        case 'Весы':
                            return 'Весы'
                        case 'Обороты':
                            return 'Обороты'
                        case 'Установка системы учета на опрыскиватель':
                            return 'Ремонт/установка системы учета на опрыскивателе'
                        case 'Ремонт системы учета на опрыскивателе':
                            return 'Ремонт/установка системы учета на опрыскивателе'
                        case 'ППО':
                            return 'ППО'
                        default: return 'Прочее'
                    }
                }

                const requestTypeId = await RequestsTypes.findOne({description: setRequestType()}).select('_id')

                // console.log(setRequestType())
                // console.log(requestTypeId)

                const request = new RequestModel({
                    ObjName: item.OBJ_NAME,
                    BaseName: item.BASES_NAME,
                    VehicleType: item.NODE_NAME,
                    VehicleRegNum: item.REG_NOM,
                    VehicleId: item.NAV_ID,
                    OldId: item.RequestNo,
                    Creator: creaId,
                    Executor: execId,
                    Auditor: audId,
                    RequestType: requestTypeId,
                    CreateDate: item.CreateDate,
                    ExecuteDate: Date.parse(item.ExecuteDate) !== 0 ? item.ExecuteDate : null,
                    isExecuted: item.Executed,
                    Description: item['Requests.Description'],
                    Region: regionId
                })

                console.log(request)
                await request.save()
            })

        })
        .then(() => console.log('Migration end'))
        .catch(error => {
            console.error(error);
        });
}

export function copyActs() {
    const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=CAAgro.mdb;');

    const query = 'SELECT Path, DocTypeId, FileID, RequestNo FROM Files INNER JOIN RequestsLog ON Files.FileID=RequestsLog.DocFileId WHERE DocTypeId = 3 or DocTypeId = 5'


    connection.query(query)
        .then(data => {
            data.forEach(async item => {

                const fileName = `/${item.Path.split('\\').slice(-3).join('/')}`

                if (item.DocTypeId === 3) {
                    try {
                        await RequestModel.findOneAndUpdate({OldId: item.RequestNo}, {$push: {Acts: fileName}})
                    } catch (e) {
                        console.log(e)
                    }

                }
                if (item.DocTypeId === 5) {
                    try {
                        await RequestModel.findOneAndUpdate({OldId: item.RequestNo}, { $push: { Tares: fileName} })
                    } catch (e) {
                        console.log(e)
                    }

                }
            })
        })
        .then(() => console.log('Acts copied'))
        .catch(e => console.log(e))
}
