require('dotenv').config();
var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var { v4: uuidv4 } = require('uuid');

/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.query.code) {
        console.log(req.query);
        res.send(req.query);
    } else {
        var params = {
            response_type: 'code',
            client_id: process.env.NOTIFY_CLIENT_ID,
            client_secret: process.env.NOTIFY_CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI || `https://${req.headers.host}/auth`,
            scope: 'notify',
            state: uuidv4(),
        };
        var url = `https://notify-bot.line.me/oauth/authorize?${querystring.stringify(params)}`;
        res.redirect(url);
    }
});

module.exports = router;
