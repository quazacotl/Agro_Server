import pkg from 'mongoose';
const {Schema, model} = pkg;


const ExecutorSchema = new Schema({
    name: String,
    regNom: String,
    navId: Number,
    status: String
});

export default model('executor', ExecutorSchema)