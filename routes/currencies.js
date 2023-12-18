const express = require('express');
const router = express.Router();
const puppeteer = require('../config/puppeteer.js');
const validate = require('../config/auth.js');

router.get('/list', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        const browser = await puppeteer.init(true);
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(`https://pt.iban.com/currency-codes`);
        await page.setViewport({width: 1280, height: 720});
            const results = await page.evaluate(() => {
                const el = document.querySelectorAll('tbody tr');
                var item = [];
                el.forEach(el => {
                    item.push({
                        country: el.querySelector('td:nth-child(1)').textContent,
                        currency: el.querySelector('td:nth-child(2)').textContent,
                        code: el.querySelector('td:nth-child(3)').textContent
                    });
                });
                return item;
            });
            await browser.close();
            res.status(200).json({message: 'Sucesso', status: 200, results: results});
    }else{
        res.status(401).json({message: 'AppID e/ou token da sua aplicação está inválida ou inexistente, ou atingiu o limite de requisições mensais', status: 401});
    }
});

router.get('/price', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.from && req.query.to){
            const browser = await puppeteer.init(true);
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.goto(`https://www.google.com/search?q=${req.query.from}%2F${req.query.to}`);
            await page.setViewport({width: 1280, height: 720});
            const results = await page.evaluate(() => {
                return {
                    from: {
                        currency: document.querySelector('.vLqKYe.egcvbb.q0WxUd .xNzW0d span').textContent,
                        code: document.querySelector('textarea.gLFyf').textContent.split('/')[0].toUpperCase(),
                        price: document.querySelector('.lWzCpb.ZEB7Fb').value
                    },
                    to: {
                        currency: document.querySelector('.MWvIVe.egcvbb .xNzW0d span').textContent,
                        code: document.querySelector('textarea.gLFyf').textContent.split('/')[1].toUpperCase(),
                        price: document.querySelector('.lWzCpb.a61j6').value
                    }
                };
            });
            await browser.close();
            res.status(200).json({message: 'Sucesso', status: 200, results: results});
        }else{
            res.status(400).json({message: 'Atributo inválido ou inexistente', status: 400});
        }
    }else{
        res.status(401).json({message: 'AppID e/ou token da sua aplicação está inválida ou inexistente, ou atingiu o limite de requisições mensais', status: 401});
    }
});

module.exports = router;