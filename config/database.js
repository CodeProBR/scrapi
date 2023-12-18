async function account(token){  
    const JsonRecords = require('json-records');
    return new JsonRecords('./database/applications.json').get(record => record.token === token)[0]['account'];
}

async function rpm(token){  
    const JsonRecords = require('json-records');
    const account = new JsonRecords('./database/applications.json').get(record => record.token === token)[0]['account'];
    const plan = new JsonRecords('./database/accounts.json').get(record => record.id === account)[0]['plan'];
    return new JsonRecords('./database/plans.json').get(record => record.id === plan)[0]['RPM'];
}

function error(api,token,request,response){
    const JsonRecords = require('json-records');
    new JsonRecords('./database/errors.json').add({
        "date": new Date().toISOString().replace(/T/,' ').replace(/\..+/,''),
        "api": api,
        "token": token,
        "request": request,
        "response": response
    });
}

function request(token){
    const moment = require('moment-timezone');
    const ShortUniqueId = require('short-unique-id');
    const uid = new ShortUniqueId({ length: 10, dictionary: 'alphanum_upper'});
    const JsonRecords = require('json-records');
    const application = new JsonRecords('./database/applications.json').get(record => record.token === token)[0]['id'];
    const analytic = new JsonRecords('./database/analytics.json').get(record => record.application === application && record.date === moment().tz("America/Sao_Paulo").format("YYYY-MM-DD"));
    if(analytic.length){
        new JsonRecords('./database/analytics.json').update(record => record.id === analytic[0].id, {
            "id": analytic[0].id,
            "date": analytic[0].date,
            "application": analytic[0].application,
            "requests": analytic[0].requests+1
        });
    }else{
        new JsonRecords('./database/analytics.json').add({
            "id": uid(),
            "date": moment().tz("America/Sao_Paulo").format("YYYY-MM-DD"),
            "application": application[0].id,
            "requests": 1
        });
    }
}

module.exports = { account, rpm , error, request};