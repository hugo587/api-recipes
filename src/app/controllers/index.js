const fs = require('fs')
, path = require('path');
//configuração para facilitar a chamada dos recursos em outras pastas
module.exports = app => {
    fs
        .readdirSync(__dirname)
        .filter(file => ((file.indexOf('.'))!== 0 && (file !== "index.js")))
        .forEach(file => require(path.resolve(__dirname, file))(app));
}