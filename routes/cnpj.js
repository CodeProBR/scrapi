const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/database');
//const request = require('../config/request');
const response = require('../config/response');

router.get('', async function(req, res, next){
    //const errors = await request.params(req);
    //if(errors.length==0){
        try{
            //const results = await axios.get(`https://minhareceita.org/${req.query.document}`);
            const results = await axios.get(`https://api.cnpjs.dev/v1/${req.query.document}`);
            if(results.data.cnpj){
                db.request(req.headers.token);
                res.status(200).json({status: 'success', results: await response.params(req,results.data)});
            }else{
                db.request(req.headers.token);
                db.error('cnpj',req.headers.token,req.query,results.data);
                res.status(200).json({status: 'success', results: {}});
            }
        }catch(err){
            if(err.results&&err.results.data&&err.results.data.message){
                db.request(req.headers.token);
                db.error('cnpj',req.headers.token,req.query,err.results.data);
                res.status(200).json({status: 'success', results: {}});
            }else{
                db.error('cnpj',req.headers.token,req.query,'null');
                res.status(400).json({status: 'bad request', message: 'Request failed, try again.', errors: []});
            }
        }
    //}else{
        //res.status(422).json({status: 'unprocessable entity', message: 'Invalid or not found parameters.', errors: errors});
    //}
});

module.exports = router;