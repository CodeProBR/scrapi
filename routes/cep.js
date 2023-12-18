const express = require('express');
const router = express.Router();
const puppeteer = require('../config/puppeteer.js');
const validate = require('../config/auth.js');
const moment = require('moment');

router.get('', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.cep){
            try {
                const browser = await puppeteer.init(true);
                const page = await browser.newPage();
                await page.goto(`https://buscacepinter.correios.com.br/app/endereco/index.php?t`,{waitUntil: 'networkidle0'});
                await page.setViewport({width: 1280, height: 720});
                await page.waitForSelector('#endereco');
                await page.type('#endereco', req.query.cep);
                await page.keyboard.press('Enter');
                //await page.waitForTimeout(500);
                await page.waitForSelector('#painel_form_consulta>.esconde');
console.log(await page.evaluate( () => document.querySelector('#mensagem-resultado-alerta').hidden))
                /*if(!await page.evaluate( () => document.querySelector('#mensagem-resultado-alerta').hidden)){
                    await browser.close();
                    res.status(200).json({date: moment().format('YYYY-MM-DD HH:mm:ss'), message: 'Sucesso', status: 200, results: []});
                }else{
                    const results = await page.evaluate(() => {
                        return [{
                            address: document.querySelector('#resultado-DNEC tbody tr:first-child td[data-th="Logradouro/Nome"]').textContent.trim(),
                            district: document.querySelector('#resultado-DNEC tbody tr:first-child td[data-th="Bairro/Distrito"]').textContent.trim(),
                            city: document.querySelector('#resultado-DNEC tbody tr:first-child td[data-th="Localidade/UF"]').textContent.split('/')[0].trim(),
                            state: document.querySelector('#resultado-DNEC tbody tr:first-child td[data-th="Localidade/UF"]').textContent.split('/')[1].trim(),
                            zip_code: document.querySelector('#resultado-DNEC tbody tr:first-child td[data-th="CEP"]').textContent.trim(),
                        }];
                    });
                    await browser.close();
                    res.status(200).json({date: moment().format('YYYY-MM-DD HH:mm:ss'), message: 'Sucesso', status: 200, results: results});
                }*/
                res.status(400).json({date: moment().format('YYYY-MM-DD HH:mm:ss'), message: 'achouuu', status: 400});
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

module.exports = router;