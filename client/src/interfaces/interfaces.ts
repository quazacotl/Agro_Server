export enum regionsEnum {
    all = 'all',
    kur = 'kur',
    vor = 'vor',
    tul = 'tul',
    ore = 'ore',
    lip = "lip",
    bel = "bel",
    orereg = "orereg",
    vorreg = "vorreg"
}

export enum requestTypesEnum {
    gps = 'Отсутствие сигнала GPS',
    grain = 'Ремонт/установка системы учета зерна/удобрений',
    scales = 'Весы',
    fullSet = 'Установка Автограф+ДУТ',
    autograph = 'Установка автографа',
    taho = "Тахограф",
    sprayer = "Ремонт/установка системы учета на опрыскивателе",
    tablets = "Планшеты",
    meteo = "Метеостанция",
    alarm = "Сигнализация",
    fuel = "Работы с топливом",
    engine = "Обороты"
}

export enum executorsEnum {
    alexanov = 'Алексанов А.',
    astreM = 'Астрединов М.Н.',
    astreN = 'Астрединов Н.',
    bugaev = 'Бугаев А.С.',
    budnikov = 'Будников А.',
    vlasov = 'Власов Р.',
    volkov = 'Волков А.',
    glazkov = 'Глазков Р.',
    demenev = 'Деменев В.',
    durunda = 'Дурунда М.',
    ivanov = 'Иванов А.',
    kartashov = 'Карташов М.В.',
    kluev = 'Клюев А.',
    komolov = 'Комолов Д.',
    konovalov = 'Коновалов А.',
    kuprin = 'Куприн А.В.',
    malahov = 'Малахов В.',
    maltsev = 'Мальцев М.',
    matuhin = 'Матюхин Д.',
    misaylov = 'Мисайлов С.Н.',
    prosvetov = 'Просветов Р.',
    sveshnikov = 'Свешников А.',
    serikov = 'Сериков В.',
    tsukanov = 'Цуканов А.',
    chuev = 'Чуев М.',

}

export enum sortTypesEnum {
    date = 'date',
    base = 'ObjName',
    type = 'RequestType'
}

export interface UncutRequestDataInterface {
    _id: string
    Acts: string[]
    Auditor: executors | null
    BaseName: string | null
    CreateDate: Date
    Creator: executors
    Description: string | null
    ExecuteDate: Date | undefined
    Executor: executors[] | null
    ObjName: string | null
    PlannedDate: Date | undefined
    Region: executors | null
    RequestType: requestTypes | null
    SentFromDate: Date | undefined
    SentFromEmail: string | null
    VehicleId: number | null
    VehicleOraId: number
    VehicleRegNum: string | null
    VehicleType: string | null
    VehicleVin: string | null
    isExecuted: boolean
    mailChangeKey: string | null
    mailId: string | null
}

export interface RequestDataInterface {
    _id: string
    Acts: string[]
    Auditor: string | null
    BaseName: string | null
    CreateDate: Date
    Creator: string
    Description: string | null
    ExecuteDate: Date | undefined
    Executor: string[] | null
    ObjName: string | null
    PlannedDate: Date | undefined
    Region: string | null
    RequestType: string | null
    SentFromDate: Date | undefined
    SentFromEmail: string | null
    VehicleId: number | null
    VehicleOraId: number
    VehicleRegNum: string | null
    VehicleType: string | null
    VehicleVin: string | null
    isExecuted: boolean
    mailChangeKey: string | null
    mailId: string | null
    lat?: number
    lon?: number
}


export interface TableDataInterface {
    OBJ_NAME: string
    BASES_NAME: string | null
    REGION: string
    NODE_NAME: string
    TRANSP_ID: number
    REG_NOM: string
    ATTR_VALUE: string | null
    NAV_ID: number | null
    LAST_LAT: number | null
    LAST_LON: number | null
    LAST_DATE: Date | null
}


export interface outlookMessagesInterface {
    senderName: string
    sentDate: Date
    subject: string
    senderEmail: string
    id: string
    changeKey: string
}

type executor =
    {[key in requestTypesEnum]? : number} &
    {Исполнитель: string}


type statisticsCounts = {
    [key in executorsEnum] : number
}

export interface Statistics {
    result: executor[]
    totalCounts: statisticsCounts
}

export interface executors {
    _id: string
    name: string
}

export interface regions extends executors {}

export interface users extends executors {}

export interface requestTypes {
    _id: string
    description: string
}

export interface responseType {
    message: string
}

export interface getBases{
    lat: number
    lon: number
    name: string
    _id: string
}

export interface getExecs extends getBases{
    distance: number
}

export interface execData {
    name: string
    _id: string
    navId: number
    distance?: number
    lat?: number
    lon?: number
}
