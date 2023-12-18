const express = require('express');
const router = express.Router();
const puppeteer = require('../config/puppeteer.js');
const validate = require('../config/auth.js');
const moment = require('moment');

router.get('/next', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.game){
            try {
                const game = typeGame(req.query.game);
                const browser = await puppeteer.init(true);
                const page = await browser.newPage();
                await page.setDefaultNavigationTimeout(0);
                await page.goto(`https://loterias.caixa.gov.br/Paginas/${game.name}.aspx`,{waitUntil: 'networkidle0'});
                await page.setViewport({width: 1280, height: 720});
                const results = await page.evaluate((game) => {
                    return [{
                        name: game.name,
                        date: document.querySelector('.resultado-loteria .next-prize.clearfix .ng-binding:nth-child(1)') ? document.querySelector('.resultado-loteria .next-prize.clearfix .ng-binding:nth-child(1)').textContent.replace('Estimativa de prêmio do próximo concurso','').replace('com vendas até','').replaceAll('\n','').trim().split('/')[2]+'-'+document.querySelector('.resultado-loteria .next-prize.clearfix .ng-binding:nth-child(1)').textContent.replace('Estimativa de prêmio do próximo concurso','').replace('com vendas até','').replaceAll('\n','').trim().split('/')[1]+'-'+document.querySelector('.resultado-loteria .next-prize.clearfix .ng-binding:nth-child(1)').textContent.replace('Estimativa de prêmio do próximo concurso','').replace('com vendas até','').replaceAll('\n','').trim().split('/')[0] : '',
                        estimate: document.querySelectorAll('.value.ng-binding')[0] ? document.querySelectorAll('.value.ng-binding')[0].textContent.replaceAll('\n','').replace('R$ ','').replaceAll('.','').replaceAll(',','.').trim() : '',
                        accumulated: document.querySelectorAll('.value.ng-binding')[1] ? document.querySelectorAll('.value.ng-binding')[1].textContent.replace('R$ ','').replaceAll('.','').replaceAll(',','.').trim() : '',
                        reserve: game.name!='Loteca'&&document.querySelectorAll('.value.ng-binding')[2] ? document.querySelectorAll('.value.ng-binding')[2].textContent.replace('R$ ','').replaceAll('.','').replaceAll(',','.').trim() : ''
                    }];
                },game);
                if(game.name=='Federal'){
                    let date = '';
                    if(moment().day()==3 || moment().day()==6){
                        date = moment().format('YYYY-MM-DD');
                    }else if(moment().day()<3){
                        date = moment().day(3).format('YYYY-MM-DD');
                    }else{
                        date = moment().day(6).format('YYYY-MM-DD');
                    }
                    results[0].date = date;
                }
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

router.get('/last', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.game){
            try {
                const game = typeGame(req.query.game);
                const browser = await puppeteer.init(true);
                const page = await browser.newPage();
                await page.setDefaultNavigationTimeout(0);
                await page.goto(`https://loterias.caixa.gov.br/Paginas/${game.name}.aspx`,{waitUntil: 'networkidle0'});
                await page.setViewport({width: 1280, height: 720});
                const results = await page.evaluate((game) => {
                    var award = [];
                    document.querySelectorAll('.related-box p').forEach(el => {
                        if(el.querySelector('span')){
                            award.push({
                                hits: el.querySelector('strong').textContent ? el.querySelector('strong').textContent.split(' + ')[0].replace(' acertos','').trim() : '',
                                shamrocks: el.querySelector('strong').textContent.includes('trevo') ? el.querySelector('strong').textContent.split(' + ')[1].split(' ')[0]=='2' ? el.querySelector('strong').textContent.split(' + ')[1].split(' ')[0].trim() : '1 ou 0' : '',
                                winners: el.querySelector('span').textContent ? el.querySelector('span').textContent.split(', ')[0].includes('aposta') ? el.querySelector('span').textContent.split(', ')[0].split(' ')[0].trim() : '0' : '',
                                value: el.querySelector('span').textContent ? el.querySelector('span').textContent.split(', ')[1] ? el.querySelector('span').textContent.split(', ')[1].replace('R$ ','').replaceAll('.','').replaceAll(',','.').trim() : '0.00' : ''
                            });
                        }
                    });
                    return [{
                        name: game.name,
                        date: document.querySelector('h2 span.ng-binding').textContent ? document.querySelector('h2 span.ng-binding').textContent.replace('Concurso ','').replace('(','').replace(')','').split(' ')[1].split('/')[2].trim()+'-'+document.querySelector('h2 span.ng-binding').textContent.replace('Concurso ','').replace('(','').replace(')','').split(' ')[1].split('/')[1].trim()+'-'+document.querySelector('h2 span.ng-binding').textContent.replace('Concurso ','').replace('(','').replace(')','').split(' ')[1].split('/')[0].trim() : '',
                        contest: document.querySelector('h2 span.ng-binding').textContent ? document.querySelector('h2 span.ng-binding').textContent.replace('Concurso ','').replace('(','').replace(')','').split(' ')[0].trim() : '',
                        numbers: document.querySelectorAll('.numbers#ulDezenas li') ? [...document.querySelectorAll(`.numbers#ulDezenas li${game.name=='Super-Sete' ? ' div:last-child' : ''}`)].map(el => el.textContent) : '',
                        shamrocks: document.querySelector('.trevosResultado') ? [...document.querySelectorAll('.trevosResultado')].map(el => el.alt.match(/\d+/)[0]) : '',
                        total: document.querySelector('.related-box p:last-child strong').textContent ? document.querySelector('.related-box p:last-child strong').textContent.replace('R$ ','').replaceAll('.','').replaceAll(',','.').trim() : '',
                        award: award
                    }];
                },game);
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

router.get('/previous', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.game && req.query.contest){
            try {
                const game = typeGame(req.query.game);
                const browser = await puppeteer.init(true);
                const page = await browser.newPage();
                await page.setDefaultNavigationTimeout(0);
                await page.goto(`https://loterias.caixa.gov.br/Paginas/${game.name}.aspx`,{waitUntil: 'networkidle0'});
                await page.setViewport({width: 1280, height: 720});
                await page.waitForSelector('#buscaConcurso');
                await page.type('#buscaConcurso', req.query.contest);
                await page.keyboard.press('Enter');
                await page.waitForTimeout(100);
                const results = await page.evaluate(() => {
                    var award = [];
                    document.querySelectorAll('.related-box p').forEach(el => {
                        if(el.querySelector('span')){
                            award.push({
                                hits: el.querySelector('strong').textContent.split(' + ')[0].replace(' acertos','').trim(),
                                shamrocks: el.querySelector('strong').textContent.split(' + ')[1].split(' ')[0]=='2' ? el.querySelector('strong').textContent.split(' + ')[1].split(' ')[0].trim() : '1 ou 0',
                                winners: el.querySelector('span').textContent.split(', ')[0].includes('aposta') ? el.querySelector('span').textContent.split(', ')[0].split(' ')[0].trim() : '0',
                                value: el.querySelector('span').textContent.split(', ')[1] ? el.querySelector('span').textContent.split(', ')[1].replace('R$ ','').replaceAll('.','').replaceAll(',','.').trim() : '0.00'
                            });
                        }
                    });
                    return [{
                        date: document.querySelector('h2 span.ng-binding').textContent.replace('Concurso ','').replace('(','').replace(')','').split(' ')[1].split('/')[2].trim()+'-'+document.querySelector('h2 span.ng-binding').textContent.replace('Concurso ','').replace('(','').replace(')','').split(' ')[1].split('/')[1].trim()+'-'+document.querySelector('h2 span.ng-binding').textContent.replace('Concurso ','').replace('(','').replace(')','').split(' ')[1].split('/')[0].trim(),
                        contest: document.querySelector('h2 span.ng-binding').textContent.replace('Concurso ','').replace('(','').replace(')','').split(' ')[0].trim(),
                        numbers: [...document.querySelectorAll('.numbers li')].map(el => el.textContent),
                        shamrocks: [...document.querySelectorAll('.trevosResultado')].map(el => el.alt.match(/\d+/)[0]),
                        total: document.querySelector('.related-box p:last-child strong').textContent.replace('R$ ','').replaceAll('.','').replaceAll(',','.').trim(),
                        award: award
                    }];
                });
                await browser.close();
                res.status(200).json({message: 'Sucesso', status: 200, results: results});
            }catch{
                res.status(400).json({message: 'Falha na requisição', status: 400});
            }
        }else{
            res.status(400).json({message: 'Atributo inválido ou inexistente', status: 400});
        }
    }else{
        res.status(401).json({message: 'AppID e/ou token da sua aplicação está inválida ou inexistente, ou atingiu o limite de requisições mensais', status: 401});
    }
});

router.get('/winners', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.game && req.query.contest){
            try {
                const game = typeGame(req.query.game);
                const browser = await puppeteer.init(true);
                const page = await browser.newPage();
                await page.setDefaultNavigationTimeout(0);
                await page.goto(`https://loterias.caixa.gov.br/Paginas/Locais-Sorte.aspx?modalidade=${game.modality}&concurso=${req.query.contest}&titulo=${game.title}`,{waitUntil: 'networkidle0'});
                await page.setViewport({width: 1280, height: 720});
                const results = await page.evaluate(() => {
                    var winners = [];
                    document.querySelectorAll('.margin30.ng-binding h4').forEach(el => {
                        winners.push({
                            name: el.textContent.trim(),
                            winners: ''
                        });
                    });
                    document.querySelectorAll('.margin30.ng-binding table tbody').forEach((el,i) => {
                        var winners2 = [];
                        el.querySelectorAll('tr').forEach(el2 => {
                            winners2.push({
                                city: el2.querySelector('td:nth-child(1)').textContent.trim(),
                                lottery: el2.querySelector('td:nth-child(2)').textContent.trim(),
                                bet_numbers: el2.querySelector('td:nth-child(3)').textContent.trim(),
                                stubborn: el2.querySelector('td:nth-child(4)').textContent.trim(),
                                type: el2.querySelector('td:nth-child(5)').textContent.trim(),
                                quotas: el2.querySelector('td:nth-child(6)').textContent.trim(),
                                award: el2.querySelector('td:nth-child(7)').textContent.replace('R$','').replaceAll('.','').replaceAll(',','.').trim()
                            });
                        });
                        winners[i].winners = winners2;
                    });
                    return [{
                        contest: document.querySelector('h3:first-child span:last-child').textContent.trim(),
                        winners: winners
                    }];
                });
                await browser.close();
                res.status(200).json({message: 'Sucesso', status: 200, results: results});
            }catch{
                res.status(400).json({message: 'Falha na requisição', status: 400});
            }
        }else{
            res.status(400).json({message: 'Atributo inválido ou inexistente', status: 400});
        }
    }else{
        res.status(401).json({message: 'AppID e/ou token da sua aplicação está inválida ou inexistente, ou atingiu o limite de requisições mensais', status: 401});
    }
    
});

function typeGame(game){
    if(game == 'maismilionaria'){
        return {
            name: 'Mais-Milionaria',
            modality: 'MAIS_MILIONARIA',
            title: '+Milionária'
        }
    }else if(game == 'megasena'){
        return {
            name: 'mega-sena',
            modality: 'MEGA_SENA',
            title: 'Mega-Sena'
        }
    }else if(game == 'lotofacil'){
        return {
            name: 'Lotofacil',
            modality: 'LOTOFACIL',
            title: 'Lotofácil'
        }
    }else if(game == 'quina'){
        return {
            name: 'Quina',
            modality: 'QUINA',
            title: 'Quina'
        }
    }else if(game == 'lotomania'){
        return {
            name: 'Lotomania',
            modality: 'LOTOMANIA',
            title: 'Lotomania'
        }
    }else if(game == 'timemania'){
        return {
            name: 'Timemania',
            modality: 'TIMEMANIA',
            title: 'Timemania'
        }
    }else if(game == 'duplasena'){
        return {
            name: 'Dupla-Sena',
            modality: 'DUPLA_SENA',
            title: 'Dupla Sena'
        }
    }else if(game == 'federal'){
        return {
            name: 'Federal'
        }
    }else if(game == 'loteca'){
        return {
            name: 'Loteca',
            modality: 'LOTECA',
            title: 'Loteca'
        }
    }else if(game == 'diadesorte'){
        return {
            name: 'Dia-de-Sorte',
            modality: 'DIA_DE_SORTE',
            title: 'Dia de Sorte'
        }
    }else if(game == 'supersete'){
        return {
            name: 'Super-Sete',
            modality: 'SUPER_SETE',
            title: 'Super Sete'
        }
    }
}

module.exports = router;