const express = require('express');
const router = express.Router();
const axios = require('axios');
const validate = require('../config/auth.js');

router.get('/sections', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.id){
            try {
                let result = await axios.get(`https://servicodados.ibge.gov.br/api/v2/cnae/secoes/${req.query.id}`);
                let results = [];
                results.push(result.data);
                results = results.map(
                    obj => {
                        return {
                            "id": obj.id,
                            "name": obj.descricao,
                            "description": obj.observacoes
                        }
                    }
                );
                res.status(200).json({message: 'Sucesso', status: 200, results: results});
            }catch{
                res.status(400).json({message: 'Falha na requisição', status: 400});
            }
        }else{
            try {
                let results = await axios.get(`https://servicodados.ibge.gov.br/api/v2/cnae/secoes`);
                results = results.data.map(
                    obj => {
                        return {
                            "id": obj.id,
                            "name": obj.descricao,
                            "description": obj.observacoes
                        }
                    }
                );
                if(req.query.order=='name'){
                    results.sort(function(a,b){ var x = a.name.toLowerCase(); var y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
                }
                if(req.query.q){
                    results = results.filter((obj) => removerSpecials(obj.name).toLowerCase().includes(removerSpecials(req.query.q).toLowerCase()));
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }else{
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }
            }catch{
                res.status(400).json({message: 'Falha na requisição', status: 400});
            }
        }
    }else{
        res.status(401).json({message: 'AppID e/ou token da sua aplicação está inválida ou inexistente, ou atingiu o limite de requisições mensais', status: 401});
    }
});

router.get('/divisions', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.id){
            try {
                let result = await axios.get(`https://servicodados.ibge.gov.br/api/v2/cnae/divisoes/${req.query.id}`);
                let results = [];
                results.push(result.data);
                results = results.map(
                    obj => {
                        return {
                            "id": obj.id,
                            "name": obj.descricao,
                            "description": obj.observacoes
                        }
                    }
                );
                res.status(200).json({message: 'Sucesso', status: 200, results: results});
            }catch{
                res.status(400).json({message: 'Falha na requisição', status: 400});
            }
        }else{
            try {
                let results = await axios.get(`https://servicodados.ibge.gov.br/api/v2/cnae/divisoes`);
                results = results.data.map(
                    obj => {
                        return {
                            "id": obj.id,
                            "name": obj.descricao,
                            "description": obj.observacoes
                        }
                    }
                );
                if(req.query.order=='name'){
                    results.sort(function(a,b){ var x = a.name.toLowerCase(); var y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
                }
                if(req.query.q){
                    results = results.filter((obj) => removerSpecials(obj.name).toLowerCase().includes(removerSpecials(req.query.q).toLowerCase()));
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }else{
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }
            }catch{
                res.status(400).json({message: 'Falha na requisição', status: 400});
            }
        }
    }else{
        res.status(401).json({message: 'AppID e/ou token da sua aplicação está inválida ou inexistente, ou atingiu o limite de requisições mensais', status: 401});
    }
});

router.get('/groups', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.state){
            try{
                let results = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${req.query.state}/microrregioes`);
                results = results.data.map(
                    obj => {
                        return {
                            "id": obj.id,
                            "name": obj.nome,
                            "state": {
                                "id": obj.mesorregiao.UF.id,
                                "code": obj.mesorregiao.UF.sigla,
                                "name": obj.mesorregiao.UF.nome
                            },
                            "mesoregion": {
                                "id": obj.mesorregiao.id,
                                "name": obj.mesorregiao.nome
                            },
                            "region": {
                                "id": obj.mesorregiao.UF.regiao.id,
                                "code": obj.mesorregiao.UF.regiao.sigla,
                                "name": obj.mesorregiao.UF.regiao.nome
                            }
                        }
                    }
                );
                if(req.query.order=='name'){
                    results.sort(function(a,b){ var x = a.name.toLowerCase(); var y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
                }
                if(req.query.q){
                    results = results.filter((obj) => removerSpecials(obj.name).toLowerCase().includes(removerSpecials(req.query.q).toLowerCase()));
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }else{
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }
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

router.get('/mesoregion', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.state){
            try{
                let results = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${req.query.state}/mesorregioes`);
                results = results.data.map(
                    obj => {
                        return {
                            "id": obj.id,
                            "name": obj.nome,
                            "state": {
                                "id": obj.UF.id,
                                "code": obj.UF.sigla,
                                "name": obj.UF.nome
                            },
                            "region": {
                                "id": obj.UF.regiao.id,
                                "code": obj.UF.regiao.sigla,
                                "name": obj.UF.regiao.nome
                            }
                        }
                    }
                );
                if(req.query.order=='name'){
                    results.sort(function(a,b){ var x = a.name.toLowerCase(); var y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
                }
                if(req.query.q){
                    results = results.filter((obj) => removerSpecials(obj.name).toLowerCase().includes(removerSpecials(req.query.q).toLowerCase()));
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }else{
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }
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

router.get('/state', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        try{
            let results = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`);
            results = results.data.map(
                obj => {
                    return {
                        "id": obj.id,
                        "code": obj.sigla,
                        "name": obj.nome,
                        "region": {
                            "id": obj.regiao.id,
                            "code": obj.regiao.sigla,
                            "name": obj.regiao.nome
                        }
                    }
                }
            );
            if(req.query.order=='name'){
                results.sort(function(a,b){ var x = a.name.toLowerCase(); var y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
            }
            if(req.query.region){
                results = results.filter((obj) => removerSpecials(obj.region.name).toLowerCase() === removerSpecials(req.query.region).toLowerCase() || parseInt(obj.region.id) === parseInt(req.query.region));
            }
            if(req.query.q){
                results = results.filter((obj) => removerSpecials(obj.name).toLowerCase().includes(removerSpecials(req.query.q).toLowerCase()));
                res.status(200).json({message: 'Sucesso', status: 200, results: results});
            }else{
                res.status(200).json({message: 'Sucesso', status: 200, results: results});
            }
        }catch{
            res.status(400).json({message: 'Falha na requisição', status: 400});
        }
    }else{
        res.status(401).json({message: 'AppID e/ou token da sua aplicação está inválida ou inexistente, ou atingiu o limite de requisições mensais', status: 401});
    }
});

router.get('/classes', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.state){
            try{
                let results = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${req.query.state}/municipios`);
                results = results.data.map(
                    obj => {
                        return {
                            "id": obj.id,
                            "name": obj.nome,
                            "state": {
                                "id": obj.microrregiao.mesorregiao.UF.id,
                                "code": obj.microrregiao.mesorregiao.UF.sigla,
                                "name": obj.microrregiao.mesorregiao.UF.nome
                            },
                            "microregion": {
                                "id": obj.microrregiao.id,
                                "name": obj.microrregiao.nome
                            },
                            "mesoregion": {
                                "id": obj.microrregiao.mesorregiao.id,
                                "name": obj.microrregiao.mesorregiao.nome
                            },
                            "region": {
                                "id": obj.microrregiao.mesorregiao.UF.regiao.id,
                                "code": obj.microrregiao.mesorregiao.UF.regiao.sigla,
                                "name": obj.microrregiao.mesorregiao.UF.regiao.nome
                            }
                        }
                    }
                );
                if(req.query.order=='name'){
                    results.sort(function(a,b){ var x = a.name.toLowerCase(); var y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
                }
                if(req.query.q){
                    results = results.filter((obj) => removerSpecials(obj.name).toLowerCase().includes(removerSpecials(req.query.q).toLowerCase()));
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }else{
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }
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

router.get('/subclasses', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.city){
            try{
                let results = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${req.query.city}/distritos`);
                results = results.data.map(
                    obj => {
                        return {
                            "id": obj.id,
                            "name": obj.nome,
                            "city": {
                                "id": obj.municipio.id,
                                "name": obj.municipio.nome,
                            },
                            "state": {
                                "id": obj.municipio.microrregiao.mesorregiao.UF.id,
                                "code": obj.municipio.microrregiao.mesorregiao.UF.sigla,
                                "name": obj.municipio.microrregiao.mesorregiao.UF.nome
                            },
                            "region": {
                                "id": obj.municipio.microrregiao.mesorregiao.UF.regiao.id,
                                "code": obj.municipio.microrregiao.mesorregiao.UF.regiao.sigla,
                                "name": obj.municipio.microrregiao.mesorregiao.UF.regiao.nome
                            }
                        }
                    }
                );
                if(req.query.order=='name'){
                    results.sort(function(a,b){ var x = a.name.toLowerCase(); var y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
                }
                if(req.query.q){
                    results = results.filter((obj) => removerSpecials(obj.name).toLowerCase().includes(removerSpecials(req.query.q).toLowerCase()));
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }else{
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }
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

router.get('/subdistrict', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.district){
            try{
                let results = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/distritos/${req.query.district}/subdistritos`);
                results = results.data.map(
                    obj => {
                        return {
                            "id": obj.id,
                            "name": obj.nome,
                            "district": {
                                "id": obj.distrito.id,
                                "name": obj.distrito.nome,
                            },
                            "city": {
                                "id": obj.distrito.municipio.id,
                                "name": obj.distrito.municipio.nome,
                            },
                            "state": {
                                "id": obj.distrito.municipio.microrregiao.mesorregiao.UF.id,
                                "code": obj.distrito.municipio.microrregiao.mesorregiao.UF.sigla,
                                "name": obj.distrito.municipio.microrregiao.mesorregiao.UF.nome
                            },
                            "region": {
                                "id": obj.distrito.municipio.microrregiao.mesorregiao.UF.regiao.id,
                                "code": obj.distrito.municipio.microrregiao.mesorregiao.UF.regiao.sigla,
                                "name": obj.distrito.municipio.microrregiao.mesorregiao.UF.regiao.nome
                            }
                        }
                    }
                );
                if(req.query.order=='name'){
                    results.sort(function(a,b){ var x = a.name.toLowerCase(); var y = b.name.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
                }
                if(req.query.q){
                    results = results.filter((obj) => removerSpecials(obj.name).toLowerCase().includes(removerSpecials(req.query.q).toLowerCase()));
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }else{
                    res.status(200).json({message: 'Sucesso', status: 200, results: results});
                }
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

module.exports = router;