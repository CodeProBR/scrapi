const express = require('express');
const router = express.Router();

router.get('/dev/:id', async function(req, res, next){
    try{
        const JsonRecords = require('json-records');
        let brasil = new JsonRecords('./database/apis.json').get(record => record.category === 'Brasil' && record.status === 'on');
        brasil = brasil.map(el => ({
            "name": el.name,
            "endpoint": el.endpoint,
            "routes": el.routes
        }));
        let mundo = new JsonRecords('./database/apis.json').get(record => record.category === 'Mundo' && record.status === 'on');
        mundo = mundo.map(el => ({
            "name": el.name,
            "endpoint": el.endpoint,
            "routes": el.routes
        }));
        let google = new JsonRecords('./database/apis.json').get(record => record.category === 'Google' && record.status === 'on');
        google = google.map(el => ({
            "name": el.name,
            "endpoint": el.endpoint,
            "routes": el.routes
        }));
        let api = new JsonRecords('./database/apis.json').get(record => record.endpoint === '/'+req.params.id && record.status === 'on')[0];
        api = {
            "name": api.name,
            "category": api.category,
            "base": api.base,
            "version": api.version,
            "endpoint": api.endpoint,
            "request": api.request,
            "response": api.response
        };
        if(api.length){
            res.status(200).json({status: 'success', results: {brasil: brasil, mundo: mundo, google: google, api: api}});
        }else{
            res.status(200).json({status: 'success', results: {brasil: brasil, mundo: mundo, google: google, api: {}}});
         }
    }catch(err){
        res.status(400).json({status: 'bad request', message: 'Request failed, try again.', errors: []});
    }
});

module.exports = router;
