var mongoose = require('mongoose');

var dbURI = 'mongodb://bollocks/ArsMagicaCovenants';
var ENV = process.env.NODE_ENV.trim();
switch (ENV) {
    case 'production':
    case 'development':
        dbURI = 'mongodb://localhost/ArsMagicaCovenants';
        console.log("uri is " + dbURI);
}
mongoose.connect(dbURI);
