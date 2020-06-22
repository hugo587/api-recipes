//abaixo importa todos os recursos usados
const express = require('express')
    , User = require('../models/user-doctor')
    , router = express.Router()
    , bcrypt = require('bcryptjs')
    , jwt = require('jsonwebtoken')
    , authConfig = require('../../config/auth.json')
    , crypto = require('crypto')
    , mailer = require('../../modules/mailer');

    //função que gera o token para nossa aplicação
    function generateToken(params = {}){
       return jwt.sign(params, authConfig.secret,{
            expiresIn: 86400,
        
} );
    }
        //rota para registrar usuário
    router.post('/register', async(req,res)=> {
        const { email } = req.body;
            //validação de usuário
            try{
                if(await User.findOne({ email }))
                        return res.status(400).send({ error: 'User already exists'});

                const user = await User.create(req.body);

                user.password = undefined;
            
                return res.send({ user,
                    token: generateToken({ id: user.id}) });
            }catch (err){
                return res.status(400).send({error: 'Registration failed'});
            }
    });
            //rota de autenticação
    router.post('/authenticate', async(req,res)=>{
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        //validação de usuário
        if(!user)
        return res.status(400).send({ error: 'User not found '});
        //validação de senha com encriptação
        if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'Invalid password !'});

            user.password = undefined;

    
            res.send({
                 user,
                  token: generateToken({ id: user.id}) });
    });
    //rota para recuperar password
    router.post('/forgot_password', async (req, res) =>{
        const { email } = req.body;
        //validação de usuário
        try{
            const user = await User.findOne({ email });

            if(!user)
            return res.status(400).send({ error: 'User not found '});

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);
            //configuração para gerar nova senha
            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                }
                }, { new: true, useFindAndModify: false }
                );
                //configurção de direcionamento de email de recuperação de senha
            mailer.sendMail({
                to: email,
                from: 'vieirahugo587@gmail.com',
                subject: 'Test',
                template: 'forgot-password',
                context: { token },
            },(err)=>{
                if(err)
                return res.status(400).send({error: 'Cannot send forgot password email'});
                 
                return res.send();
            })
           
        }catch (err){
            
            res.status(400).send({error: 'Erro on forgot password, try again'})

        }
    });
        //rota para de fato trocar a senha usando token gerado
    router.post('/reset_password', async(req,res)=>{
        const { email, token, password } = req.body;
            //validação de token enviado
        try{

            const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');

            if(!user)
            return res.status(400).send({error: 'User not found'});

            if(token !== user.passwordResetToken)
                return res.status(400).send({error: 'Token invalid'});

            const now = new Date();

            if(now > user.passwordResetExpires)
                return res.status(400).send({error: 'Token expired, generate a new one'})

                user.password = password;

                await user.save();

        res.send();
        
        }catch(err){
            res.status(400).send({error: 'Cannot reset password, try again'});
        }
    });

    module.exports = app => app.use('/auth',router);
