const express = require('express');
const router = express.Router();
const puppeteer = require('../config/puppeteer.js');
const validate = require('../config/auth.js');
const moment = require('moment');
const axios = require('axios');

router.get('/info', async function(req, res, next){
    if(req.query.token && await validate.token(req.query.token)){
        if(req.query.ip){
            try {
                const browser = await puppeteer.init(true);
                const page = await browser.newPage();
                await page.goto(`https://ipstack.com/`,{waitUntil: 'networkidle0'});
                await page.setViewport({width: 1280, height: 720});
                await page.waitForSelector('input[name="iptocheck"]');
                await page.evaluate( () => document.querySelector('input[name="iptocheck"]').value = "");
                await page.type('input[name="iptocheck"]', req.query.ip);
                await page.keyboard.press('Enter');
                //await page.waitForFunction(() => !document.querySelector('.i_body .rows'));
                //await page.waitForFunction(() => document.querySelector('.i_body .rows'));
                const results = await page.evaluate(() => {
                    return [{
                        ip: document.querySelector('.i_body .row[data-object="ip"] span').textContent.replaceAll('"',''),
                        type: document.querySelector('.i_body .row[data-object="type"] span').textContent.replaceAll('"',''),
                        continent_code: document.querySelector('.i_body .row[data-object="continent_code"] span').textContent.replaceAll('"',''),
                        continent_name: document.querySelector('.i_body .row[data-object="continent_name"] span').textContent.replaceAll('"',''),
                        country_code: document.querySelector('.i_body .row[data-object="country_code"] span').textContent.replaceAll('"',''),
                        country_name: document.querySelector('.i_body .row[data-object="country_name"] span').textContent.replaceAll('"',''),
                        region_code: document.querySelector('.i_body .row[data-object="region_code"] span').textContent.replaceAll('"',''),
                        region_name: document.querySelector('.i_body .row[data-object="region_name"] span').textContent.replaceAll('"',''),
                        city: document.querySelector('.i_body .row[data-object="city"] span').textContent.replaceAll('"',''),
                        zip: document.querySelector('.i_body .row[data-object="zip"] span').textContent.replaceAll('"',''),
                        latitude: document.querySelector('.i_body .row[data-object="latitude"] span').textContent.replaceAll('"',''),
                        longitude: document.querySelector('.i_body .row[data-object="longitude"] span').textContent.replaceAll('"',''),
                        security: {
                            is_proxy: document.querySelector('.i_body .row[data-object="security"] .subrows .row[data-object="is_proxy"] span').textContent.replaceAll('"',''),
                            proxy_type: document.querySelector('.i_body .row[data-object="security"] .subrows .row[data-object="proxy_type"] span').textContent.replaceAll('"',''),
                            is_crawler: document.querySelector('.i_body .row[data-object="security"] .subrows .row[data-object="is_crawler"] span').textContent.replaceAll('"',''),
                            crawler_name: document.querySelector('.i_body .row[data-object="security"] .subrows .row[data-object="crawler_name"] span').textContent.replaceAll('"',''),
                            crawler_type: document.querySelector('.i_body .row[data-object="security"] .subrows .row[data-object="crawler_type"] span').textContent.replaceAll('"',''),
                            is_tor: document.querySelector('.i_body .row[data-object="security"] .subrows .row[data-object="is_tor"] span').textContent.replaceAll('"',''),
                            threat_level: document.querySelector('.i_body .row[data-object="security"] .subrows .row[data-object="threat_level"] span').textContent.replaceAll('"',''),
                            threat_types: document.querySelector('.i_body .row[data-object="security"] .subrows .row[data-object="threat_types"] span').textContent.replaceAll('"',''),
                        },
                        connection: {
                            threat_types: document.querySelector('.i_body .row[data-object="connection"] .subrows .row[data-object="asn"] span').textContent.replaceAll('"',''),
                            isp: document.querySelector('.i_body .row[data-object="connection"] .subrows .row[data-object="isp"] span').textContent.replaceAll('"',''),
                        },
                        currency: {
                            code: document.querySelector('.i_body .row[data-object="currency"] .subrows .row[data-object="code"] span').textContent.replaceAll('"',''),
                            name: document.querySelector('.i_body .row[data-object="currency"] .subrows .row[data-object="name"] span').textContent.replaceAll('"',''),
                            plural: document.querySelector('.i_body .row[data-object="currency"] .subrows .row[data-object="plural"] span').textContent.replaceAll('"',''),
                            symbol: document.querySelector('.i_body .row[data-object="currency"] .subrows .row[data-object="symbol"] span').textContent.replaceAll('"',''),
                            symbol_native: document.querySelector('.i_body .row[data-object="currency"] .subrows .row[data-object="symbol_native"] span').textContent.replaceAll('"',''),
                        },
                        time_zone: {
                            id: document.querySelector('.i_body .row[data-object="time_zone"] .subrows .row[data-object="id"] span').textContent.replaceAll('"',''),
                            current_time: document.querySelector('.i_body .row[data-object="time_zone"] .subrows .row[data-object="current_time"] span').textContent.replaceAll('"',''),
                            gmt_offset: document.querySelector('.i_body .row[data-object="time_zone"] .subrows .row[data-object="gmt_offset"] span').textContent.replaceAll('"',''),
                            code: document.querySelector('.i_body .row[data-object="time_zone"] .subrows .row[data-object="code"] span').textContent.replaceAll('"',''),
                            is_daylight_saving: document.querySelector('.i_body .row[data-object="time_zone"] .subrows .row[data-object="is_daylight_saving"] span').textContent.replaceAll('"',''),
                        },
                        location: {
                            geoname_id: document.querySelector('.i_body .row[data-object="location"] .subrows .row[data-object="geoname_id"] span').textContent.replaceAll('"',''),
                            capital: document.querySelector('.i_body .row[data-object="location"] .subrows .row[data-object="capital"] span').textContent.replaceAll('"',''),
                            languages: {
                                code: document.querySelector('.i_body .row[data-object="location"] .subrows .row[data-object="languages"] .subrows .row[data-object="code"] span').textContent.replaceAll('"',''),
                                name: document.querySelector('.i_body .row[data-object="location"] .subrows .row[data-object="languages"] .subrows .row[data-object="name"] span').textContent.replaceAll('"',''),
                                native: document.querySelector('.i_body .row[data-object="location"] .subrows .row[data-object="languages"] .subrows .row[data-object="native"] span').textContent.replaceAll('"',''),
                            },
                            calling_code: document.querySelector('.i_body .row[data-object="location"] .subrows .row[data-object="calling_code"] span').textContent.replaceAll('"',''),
                            is_eu: document.querySelector('.i_body .row[data-object="location"] .subrows .row[data-object="is_eu"] span').textContent.replaceAll('"',''),
                        }
                    }];
                });
                await browser.close();
                res.status(200).json({date: moment().format('YYYY-MM-DD HH:mm:ss'), message: 'Sucesso', status: 200, results: results});
            }catch{
                res.status(400).json({date: moment().format('YYYY-MM-DD HH:mm:ss'), message: 'Falha na requisição', status: 400});
            }
        }else{
            res.status(400).json({date: moment().format('YYYY-MM-DD HH:mm:ss'), message: 'Atributo inválido ou inexistente', status: 400});
        }
    }else{
        res.status(401).json({date: moment().format('YYYY-MM-DD HH:mm:ss'), message: 'AppID e/ou token da sua aplicação está inválida ou inexistente, ou atingiu o limite de requisições mensais', status: 401});
    }
});

router.get('/my', async function(req, res, next){
    if(req.query.token && await validate.token(req.query.token)){
        try {
            const result = await axios.get(`https://api.my-ip.io/ip.json`);
            delete result.data.success; 
            res.status(200).json({date: moment().format('YYYY-MM-DD HH:mm:ss'), message: 'Sucesso', status: 200, results: [JSON.parse(JSON.stringify(result.data))]});
        }catch{
            res.status(400).json({date: moment().format('YYYY-MM-DD HH:mm:ss'), message: 'Falha na requisição', status: 400});
        }
    }else{
        res.status(401).json({date: moment().format('YYYY-MM-DD HH:mm:ss'), message: 'AppID e/ou token da sua aplicação está inválida ou inexistente, ou atingiu o limite de requisições mensais', status: 401});
    }
});

module.exports = router;