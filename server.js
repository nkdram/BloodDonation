



var app = require('./config/app')();

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(app.get('port'));

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Blood Donation APP started on port 8079');