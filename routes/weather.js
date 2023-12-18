const express = require('express');
const router = express.Router();
const puppeteer = require('../config/puppeteer.js');
const validate = require('../config/auth.js');

router.get('/search', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.q){
            const browser = await puppeteer.init(true);
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.goto('https://www.climatempo.com.br');
            await page.setViewport({width: 1280, height: 720});
            await page.type('.general-search-input',req.query.q,{delay: 500});
            const results = await page.evaluate(() => {
                const el = document.querySelectorAll('.autocomplete-list a');
                var item = [];
                el.forEach(el => {
                    item.push({id: el.href.replace('https://www.climatempo.com.br/previsao-do-tempo/cidade/','').split('/')[0], name: el.textContent});
                });
                return item;
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

router.get('/today', async function(req, res, next) {
    const browser = await puppeteer.init(true);
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(`https://www.climatempo.com.br/previsao-do-tempo/15-dias/cidade/${req.query.city}`);
    const results = await page.evaluate(() => {
        const el = document.querySelector('.accordion-card.-daily-infos:nth-child(1)');
        let item = {
            description: el.querySelector('div>div>p') ? el.querySelector('div>div>p').textContent : '',
            temperature: {
                min: el.querySelector('.date-inside-circle+div>div>div:nth-child(1) ._margin-r-15 div:nth-child(1) span') ? el.querySelector('.date-inside-circle+div>div>div:nth-child(1) ._margin-r-15 div:nth-child(1) span').textContent : '',
                max: el.querySelector('.date-inside-circle+div>div>div:nth-child(1) ._margin-r-15 div:nth-child(2) span') ? el.querySelector('.date-inside-circle+div>div>div:nth-child(1) ._margin-r-15 div:nth-child(2) span').textContent : '',
                dawn: el.querySelector('.no-gutters .periods-icons div:nth-child(1) img') ? 'https://www.climatempo.com.br'+el.querySelector('.no-gutters .periods-icons div:nth-child(1) img').dataset.src : '',
                morning: el.querySelector('.no-gutters .periods-icons div:nth-child(2) img') ? 'https://www.climatempo.com.br'+el.querySelector('.no-gutters .periods-icons div:nth-child(2) img').dataset.src : '',
                afternoon: el.querySelector('.no-gutters .periods-icons div:nth-child(3) img') ? 'https://www.climatempo.com.br'+el.querySelector('.no-gutters .periods-icons div:nth-child(3) img').dataset.src : '',
                night: el.querySelector('.no-gutters .periods-icons div:nth-child(4) img') ? 'https://www.climatempo.com.br'+el.querySelector('.no-gutters .periods-icons div:nth-child(4) img').dataset.src : ''
            },
            rain: {
                precipitation: el.querySelector('.wrapper-variables-cards>div:nth-child(2) div div') ? el.querySelector('.wrapper-variables-cards>div:nth-child(2) div div').textContent.replaceAll('\n',' ').trim().split(' - ')[0] : '',
                percent: el.querySelector('.date-inside-circle+div>div>div:nth-child(1) ._margin-r-20') ? el.querySelector('.date-inside-circle+div>div>div:nth-child(1) ._margin-r-20').textContent.replaceAll('\n',' ').trim() : '',
                volume: el.querySelector('.wrapper-variables-cards>div:nth-child(2) div div img') ? el.querySelectorAll('.wrapper-variables-cards>div:nth-child(2) div img[data-src="/dist/images/gota-azul.png"]').length : ''
            },
            wind: {
                direction: el.querySelector('.wrapper-variables-cards>div:nth-child(3) div div') ? el.querySelector('.wrapper-variables-cards>div:nth-child(3) div div').textContent.replaceAll('\n',' ').trim().split(' - ')[0] : '',
                velocity: el.querySelector('.wrapper-variables-cards>div:nth-child(3) div div') ? el.querySelector('.wrapper-variables-cards>div:nth-child(3) div div').textContent.replaceAll('\n',' ').trim().split(' - ')[1] : ''
            },
            humidity: {
                min: el.querySelector('.wrapper-variables-cards>div:nth-child(4) div div span:nth-child(2)') ? el.querySelector('.wrapper-variables-cards>div:nth-child(4) div div span:nth-child(2)').textContent.replaceAll('\n',' ').trim() : '',
                max: el.querySelector('.wrapper-variables-cards>div:nth-child(4) div div span:nth-child(4)') ? el.querySelector('.wrapper-variables-cards>div:nth-child(4) div div span:nth-child(4)').textContent.replaceAll('\n',' ').trim() : '',
            },
            rainbow: el.querySelector('.wrapper-variables-cards>div:nth-child(5) div p:nth-child(2)') ? el.querySelector('.wrapper-variables-cards>div:nth-child(5) div p:nth-child(2)').textContent.replaceAll('\n',' ').trim() : '',
            sun: el.querySelector('.wrapper-variables-cards>div:nth-child(6) div p:nth-child(2)') ? el.querySelector('.wrapper-variables-cards>div:nth-child(6) div p:nth-child(2)').textContent.replaceAll('\n',' ').trim() : '',
            moon: el.querySelector('.wrapper-variables-cards>div:nth-child(7) div p:nth-child(2)') ? el.querySelector('.wrapper-variables-cards>div:nth-child(7) div p:nth-child(2)').textContent.replaceAll('\n',' ').trim() : '',
            data: el.querySelector('.wrapper-chart') ? JSON.parse(el.querySelector('.wrapper-chart').dataset.infos) : []
        };
        return item;
    });
    await browser.close();
    res.json({results: results});
});


module.exports = router;