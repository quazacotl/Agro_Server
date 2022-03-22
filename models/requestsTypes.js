import pkg from 'mongoose';
const {Schema, model, Types} = pkg;


const RequestsTypeSchema = new Schema({
    description: String
});

export default model('requesttype', RequestsTypeSchema)