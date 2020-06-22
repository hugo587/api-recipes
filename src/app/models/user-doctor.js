//Importação de recursos para o model
const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
//criação do model e seus atributos
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },

    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },

    password: {
        type: String,
        require: true,
        select: false,
    },

    cpf: {
        type: String,
        require: true,
        select: false,
    },

    crm: {
        type: String,
        require: true,
    },

    gender: {
        type: String,
        require: true,
    },
    birthday: {
        type: String,
        require: true,
    },

    recordStateCrm: {
        type: String,
        require: true,
    },

    passwordResetToken:{
        type: String,
        select: false,
    },
    passwordResetExpires:{
        type: Date,
        select: false,
    },
});
//padronização de encriptação de senha
UserSchema.pre('save',async function(next){
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

    next();
});

const User = mongoose.model('User',UserSchema);

module.exports = User;