var mongoose = require('mongoose');

var dbURI = 'mongodb://bollocks/ArsMagicaCovenants';
var ENV = process.env.NODE_ENV.trim();
switch (ENV) {
    case 'production':
        dbURI = 'mongodb://heroku_qq3kz0c4:42dpds0idhh48i2tg147r13emj@ds161194.mlab.com:61194/heroku_qq3kz0c4';
        break;
    case 'development':
        dbURI = 'mongodb://localhost/ArsMagicaCovenants';
}
console.log("uri is " + dbURI);
mongoose.connect(dbURI);
