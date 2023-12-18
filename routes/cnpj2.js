const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('', async function(req, res, next){
            axios.get(`https://minhareceita.org/${req.query.document}`)
                .then(function (response) {
                    console.log(response);
                    res.status(200).json({status: 'success', results: response.data});
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function (error) {
                    console.log(error);
                    // always executed
                });
});

module.exports = router;