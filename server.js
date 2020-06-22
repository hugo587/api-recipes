//configuração do servidor
const express = require('express')
    ,bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./src/app/controllers/index')(app);


app.listen(3000, function(){
    console.log('Servidor funcionando na porta:'+ this.address().port);
});
