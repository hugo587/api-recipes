//Importação de recursos para criar o model
const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
//model criado com os atributos do objeto
const RecipeSchema = new mongoose.Schema({
    crm: {
        type: String,
        require: true,
    },

    recordStateCrm: {
        type: String,
        require: true,
    },

    cpfDoctor: {
        type: String,
        require: true,
        select: false,
    },

    nameDoctor: {
        type: String,
        require: true,
    },

    cpfPatient: {
        type: String,
        require: true,
        select: false,
    },

    namePatient: {
        type: String,
        require: true,
    },
    birthdayPatient: {
        type: String,
        require: true,
    },

    drug: {
        type: String,
        require: true,
    },

    descriptionDrug:{
        type: String,
        require: true,
    },
    amount:{
        type: String,
        require: true,
    },
//refenrenciando o user responsável pelo cadastro
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },

    dosage:{
        type: String,
        require: true,
    },

    frequencyUse:{
        type: String,
        require: true,
    },

    createdAt:{
        type: Date,
        default: Date.now,
    },
});


const Recipe = mongoose.model('Recipe',RecipeSchema);

module.exports = Recipe;