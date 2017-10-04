var mongoose = require('mongoose');

var dbURI = app.get('dbUri');
mongoose.connect(dbURI);
