const express = require('express');
const router = express.Router();
const axios = require('axios');
const validate = require('../config/auth.js');

router.get('', async function(req, res, next){
    if(req.query.appid && req.query.token && await validate.token(req.query.appid,req.query.token)){
        if(req.query.domain){
            try {
                const response = await axios.get(`https://registro.br/v2/ajax/avail/raw/${req.query.domain}`);
                res.status(200).json({message: 'Sucesso', status: 200, results: JSON.parse(JSON.stringify(response.data))});
            }catch{
                res.status(400).json({message: 'Domínio inválido ou falha na requisição', status: 400});
            }
        }else{
            res.status(400).json({message: 'Atributo inválido ou inexistente', status: 400});
        }
    }else{
        res.status(401).json({message: 'AppID e/ou token da sua aplicação está inválida ou inexistente, ou atingiu o limite de requisições mensais', status: 401});
    }
});

module.exports = router;