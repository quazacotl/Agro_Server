import pkg from 'mongoose';
const {Schema, model} = pkg;


const UserSchema = new Schema({
    name: String
});

export default model('user', UserSchema)