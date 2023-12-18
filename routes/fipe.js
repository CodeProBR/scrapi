const express = require('express');
const router = express.Router();
const axios = require('axios');
const validate = require('../config/auth.js');

router.get('/tables', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        try {
            let results = await axios.post(`https://veiculos.fipe.org.br/api/veiculos/ConsultarTabelaDeReferencia`,{});
            results = results.data.map(
                obj => {
                    return {
                        "id": obj.Codigo,
                        "name": obj.Mes
                    }
                }
            );
            if(req.query.order=='name'){
                results.sort(function(a,b){ var x = a.name.toLowerCase(); var y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
            }
            if(req.query.q){
                results = results.filter((obj) => removerSpecials(obj.name).toLowerCase().includes(removerSpecials(req.query.q).toLowerCase()));
            }
            res.status(200).json({message: 'Sucesso', status: 200, results: results});
        }catch{
            res.status(400).json({message: 'Falha na requisição', status: 400});
        }
    }else{
        res.status(401).json({message: 'AppID e/ou token da sua aplicação está inválida ou inexistente, ou atingiu o limite de requisições mensais', status: 401});
    }
});

router.get('/brands', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        try {
            let table = '';
            if(req.query.table){
                table = req.query.table;
            }else{
                table = await axios.post(`https://veiculos.fipe.org.br/api/veiculos/ConsultarTabelaDeReferencia`,{});
                table = table.data[0].Codigo;
            }
            const type = typeVehicles(req.query.type);
            let results = await axios.post(`https://veiculos.fipe.org.br/api/veiculos/ConsultarMarcas`,{codigoTabelaReferencia: table, codigoTipoVeiculo: type});
            results = results.data.map(
                obj => {
                    return {
                        "id": obj.Value,
                        "name": obj.Label
                    }
                }
            );
            if(req.query.order=='name'){
                results.sort(function(a,b){ var x = a.name.toLowerCase(); var y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
            }
            if(req.query.q){
                results = results.filter((obj) => removerSpecials(obj.name).toLowerCase().includes(removerSpecials(req.query.q).toLowerCase()));
            }
            res.status(200).json({message: 'Sucesso', status: 200, results: results});
        }catch{
            res.status(400).json({message: 'Falha na requisição', status: 400});
        }
    }else{
        res.status(401).json({message: 'AppID e/ou token da sua aplicação está inválida ou inexistente, ou atingiu o limite de requisições mensais', status: 401});
    }
});

router.get('/models', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.brand){
            try {
                let table = '';
                if(req.query.table){
                    table = req.query.table;
                }else{
                    table = await axios.post(`https://veiculos.fipe.org.br/api/veiculos/ConsultarTabelaDeReferencia`,{});
                    table = table.data[0].Codigo;
                }
                const type = typeVehicles(req.query.type);
                let results = await axios.post(`https://veiculos.fipe.org.br/api/veiculos/ConsultarModelos`,{codigoTabelaReferencia: table, codigoTipoVeiculo: type, codigoMarca: req.query.brand});
                results = results.data.Modelos.map(
                    obj => {
                        return {
                            "id": obj.Value,
                            "name": obj.Label
                        }
                    }
                );
                if(req.query.order=='name'){
                    results.sort(function(a,b){ var x = a.name.toLowerCase(); var y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
                }
                if(req.query.q){
                    results = results.filter((obj) => removerSpecials(obj.name).toLowerCase().includes(removerSpecials(req.query.q).toLowerCase()));
                }
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

router.get('/models', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.brand){
            try {
                let table = '';
                if(req.query.table){
                    table = req.query.table;
                }else{
                    table = await axios.post(`https://veiculos.fipe.org.br/api/veiculos/ConsultarTabelaDeReferencia`,{});
                    table = table.data[0].Codigo;
                }
                const type = typeVehicles(req.query.type);
                let results = await axios.post(`https://veiculos.fipe.org.br/api/veiculos/ConsultarModelos`,{codigoTabelaReferencia: table, codigoTipoVeiculo: type, codigoMarca: req.query.brand});
                results = results.data.Modelos.map(
                    obj => {
                        return {
                            "id": obj.Value,
                            "name": obj.Label
                        }
                    }
                );
                if(req.query.order=='name'){
                    results.sort(function(a,b){ var x = a.name.toLowerCase(); var y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
                }
                if(req.query.q){
                    results = results.filter((obj) => removerSpecials(obj.name).toLowerCase().includes(removerSpecials(req.query.q).toLowerCase()));
                }
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

router.get('/years', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.brand && req.query.model){
            try {
                let table = '';
                if(req.query.table){
                    table = req.query.table;
                }else{
                    table = await axios.post(`https://veiculos.fipe.org.br/api/veiculos/ConsultarTabelaDeReferencia`,{});
                    table = table.data[0].Codigo;
                }
                const type = typeVehicles(req.query.type);
                let results = await axios.post(`https://veiculos.fipe.org.br/api/veiculos/ConsultarAnoModelo`,{codigoTabelaReferencia: table, codigoTipoVeiculo: type, codigoMarca: req.query.brand, codigoModelo: req.query.model});
                results = results.data.map(
                    obj => {
                        return {
                            "name": obj.Label,
                            "year": obj.Value.split('-')[0],
                            "fuel": obj.Value.split('-')[1]
                        }
                    }
                );
                if(req.query.order=='name'){
                    results.sort(function(a,b){ var x = a.name.toLowerCase(); var y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
                }
                if(req.query.q){
                    results = results.filter((obj) => removerSpecials(obj.name).toLowerCase().includes(removerSpecials(req.query.q).toLowerCase()));
                }
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

router.get('/prices', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.brand && req.query.model && req.query.year && req.query.fuel){
            try {
                let table = '';
                if(req.query.table){
                    table = req.query.table;
                }else{
                    table = await axios.post(`https://veiculos.fipe.org.br/api/veiculos/ConsultarTabelaDeReferencia`,{});
                    table = table.data[0].Codigo;
                }
                const type = typeVehicles(req.query.type);
                let result = await axios.post(`https://veiculos.fipe.org.br/api/veiculos/ConsultarValorComTodosParametros`,{codigoTabelaReferencia: table, codigoTipoVeiculo: type, codigoMarca: req.query.brand, codigoModelo: req.query.model, anoModelo: req.query.year, codigoTipoCombustivel: req.query.fuel, tipoConsulta: 'tradicional'});
                let results = [];
                results.push(result.data);
                results = results.map(
                    obj => {
                        return {
                            "date": obj.DataConsulta,
                            "type": typeVehicles(obj.TipoVeiculo,'reverse'),
                            "brand": obj.Marca,
                            "model": obj.Modelo,
                            "year": obj.AnoModelo,
                            "fuel": obj.Combustivel,
                            "price": obj.Valor,
                            "fipe_code": obj.CodigoFipe,
                            "fipe_reference": obj.MesReferencia,
                            "fipe_auth": obj.Autenticacao
                        }
                    }
                );
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

function removerSpecials(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function typeVehicles(type,mode=null){
    if(mode=='reverse'){
        if(type=='1'){
            return 'car';
        }else if(type=='2'){
            return 'motorcycle';
        }else if(type=='3'){
            return 'truck';
        }else{
            return 'car';
        }
    }else{
        if(type=='car'){
            return 1;
        }else if(type=='motorcycle'){
            return 2;
        }else if(type=='truck'){
            return 3;
        }else{
            return 1;
        }
    }
}

module.exports = router;