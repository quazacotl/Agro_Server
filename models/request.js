import pkg from 'mongoose';
const {Schema, model, Types} = pkg;
import autopopulate from 'mongoose-autopopulate'


const RequestSchema = new Schema({
    OldId: Number,
    ObjName: String,
    BaseName: String,
    VehicleType: String,
    VehicleRegNum: String,
    VehicleId: Number,
    VehicleOraId: Number,
    VehicleVin: String,
    RequestType: {type: Types.ObjectId, ref: 'requesttype', autopopulate: true},
    Creator: {type: Types.ObjectId, ref: 'user', autopopulate: true},
    Executor: [{type: Types.ObjectId, ref: 'executor', autopopulate: true}],
    Auditor: {type: Types.ObjectId, ref: 'user', autopopulate: true},
    PlannedDate: Date,
    CreateDate: Date,
    ExecuteDate: Date,
    isExecuted: Boolean,
    Description: String,
    Acts: [String],
    Tares: [String],
    SentFromName: String,
    SentFromEmail: String,
    SentFromDate: Date,
    mailId: String,
    mailChangeKey: String,
    Region: {type: Types.ObjectId, ref: 'region', autopopulate: true},
});

RequestSchema.plugin(autopopulate);



export default model('request', RequestSchema)