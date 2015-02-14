var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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
            res.render('index', { title: 'How much the studies cost?', cost: cost, name: bank_name, url: bank_link, cost_month: cost_month });
        }
    });
});

module.exports = router;
