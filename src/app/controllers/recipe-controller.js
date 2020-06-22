//importação de recursos a serem usados
const express = require('express') 
const authMiddleware = require('../../middlewares/auth');
const router = express.Router();
const Recipe = require('../models/recipe');

//requisitando o middleware para obter recurso
router.use(authMiddleware);
//rota de listagem de receitas
router.get('/',async(req,res)=>{
    try {
        const recipes = await Recipe.find().populate('user');

        return res.send({ recipes });
    } catch (err) {
        return res.status(400).send({error: 'Error loading recipes'});  
    }
});
//rota de listagem de apenas uma receita
router.get('/:recipeId', async(req,res)=>{
    try {
        const recipe = await Recipe.findById(req.params.recipeId).populate('user');

        return res.send({ recipe });
    } catch (err) {
        return res.status(400).send({error: 'Error loading recipe'});  
    }
});
//rota de cadastro de receita
router.post('/', async(req,res)=>{
    try {
       const recipe = await Recipe.create({...req.body, user: req.userId}); 
        
        return res.send({ recipe });
    } catch (err) {
        return res.status(400).send({error: 'Error Creating new recipe'})
    }
});
//rota de atualização de receita
router.put('/:recipeId', async(req,res)=>{
    
    try {
        const recipe = await Recipe
        .findByIdAndUpdate(req.params.recipeId,
            {...req.body}, {new: true}); 
         
         return res.send({ recipe });
     } catch (err) {
         return res.status(400).send({error: 'Error Updating recipe'})
     }
});
//rota de exclusão de receita
router.delete('/:recipeId', async(req,res)=>{
    try {
         await Recipe.findByIdAndRemove(req.params.recipeId);

        return res.send();
    } catch (err) {
        return res.status(400).send({error: 'Error Deleting recipe'});  
    }
});



module.exports = app => app.use('/recipe', router);