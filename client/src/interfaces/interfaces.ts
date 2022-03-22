export enum regions {
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

export interface emailInterface {
    id: String
    changeKey: String
    subject: String
    sentDate: Date
    senderName: String
    senderEmail: String

}