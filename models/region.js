import pkg from 'mongoose';
const {Schema, model, Types} = pkg;


const RegionSchema = new Schema({
    name: String
});

export default model('region', RegionSchema)