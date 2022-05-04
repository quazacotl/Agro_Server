import pkg from 'mongoose';
const {Schema, model} = pkg;


const BaseSchema = new Schema({
    name: String,
    oraId: Number,
    lat: Number,
    lon: Number,
});

export default model('base', BaseSchema)