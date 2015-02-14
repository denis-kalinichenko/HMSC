var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var request = require("request");

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

global.url = "http://resources.finance.ua/ua/public/currency-cash.json";

server.listen(80, function(){
    console.log('listening on *:80');

    io.on('connection', function (socket) {
        function refresh() {
            request({
                url: global.url,
                json: true
            }, function (error, response, body) {
                if (!error) if (response.statusCode === 200) {
                    var index;
                    var a = body.organizations;
                    var cost = 0, bank_name = '', bank_link = '';
                    a.forEach(function (entry) {
                        var pln = entry.currencies.PLN;
                        bank_name = (pln && Number(pln.ask).toFixed(2) > cost) ? entry.title : bank_name;
                        bank_link = (pln && Number(pln.ask).toFixed(2) > cost) ? entry.link : bank_link;
                        cost = (pln && Number(pln.ask).toFixed(2) > cost) ? Number(pln.ask).toFixed(2) : cost;
                    });
                    var cost_month = cost * 500;
                    socket.emit("data", { cost: cost, name: bank_name, url: bank_link,  cost_month: cost_month});
                }
            });

        }

        var update = setInterval(refresh, 100000);

        socket.on('getData', function () {
            refresh();
        });
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}




// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
