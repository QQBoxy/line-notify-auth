require('dotenv').config();
const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

/* GET users listing. */
router.get('/', async (req, res, next) => {
    if (req.query.code) {
        const response = await axios({
            method: 'post',
            url: 'https://notify-bot.line.me/oauth/token',
            params: {
                client_id: process.env.NOTIFY_CLIENT_ID,
                client_secret: process.env.NOTIFY_CLIENT_SECRET,
                redirect_uri: process.env.REDIRECT_URI || `https://${req.headers.host}/auth`,
                code: req.query.code,
                grant_type: 'authorization_code',
            },
        }).catch((error) => {
            console.log(error);
            res.send(error);
        });
        const access_token = response.data.access_token;
        await axios({
            method: 'post',
            url: 'https://notify-api.line.me/api/notify',
            params: {
                message: `Congratulations! Your access token is: \n${access_token}`
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorization': `Bearer ${access_token}`,
            },
        }).catch((error) => {
            console.log(error);
            res.send(error);
        });
        res.send({
            access_token: response.data.access_token
        });
    } else {
        const params = {
            response_type: 'code',
            client_id: process.env.NOTIFY_CLIENT_ID,
            client_secret: process.env.NOTIFY_CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI || `https://${req.headers.host}/auth`,
            scope: 'notify',
            state: uuidv4(),
        };
        const url = `https://notify-bot.line.me/oauth/authorize?${querystring.stringify(params)}`;
        res.redirect(url);
    }
});

module.exports = router;
