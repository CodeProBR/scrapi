const express = require('express');
const router = express.Router();

router.get('/dev/:id', async function(req, res, next){
    try{
        const JsonRecords = require('json-records');
        const api = new JsonRecords('./database/apis.json').get(record => record.endpoint === '/'+req.params.id);
        if(api.length){
            res.status(200).json({status: 'success', results: api});
        }else{
            res.status(200).json({status: 'success', results: {}});
         }
    }catch(err){
        res.status(400).json({status: 'bad request', message: 'Request failed, try again.', errors: []});
    }
});

module.exports = router;