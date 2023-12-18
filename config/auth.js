async function token(req, res, next){
    /*if(req.headers.token){
        const moment = require('moment-timezone');
        const ShortUniqueId = require('short-unique-id');
        const uid = new ShortUniqueId({ length: 10, dictionary: 'alphanum_upper'});
        const mysql = require('mysql2/promise');
        const connection = await mysql.createConnection({host: '86.48.26.30', user: 'webapis', database: 'webapis', password: 'zJfeXcPzZbHyxXpw'});
        const [rows] = await connection.execute('SELECT a.`id`,a.`account`,a.`status`,(SELECT c.`limit` FROM `plans` c WHERE c.`id`=(SELECT b.`plan` FROM `accounts` b WHERE b.`id`=a.`account`)) AS `limit`,(SELECT d.`request` FROM `apis` d WHERE d.`version`=? AND d.`endpoint`=?) AS request,JSON_SEARCH(a.`api`,"one",(SELECT d.`id` FROM `apis` d WHERE d.`version`=? AND d.`endpoint`=?),"","$[*]") AS `access`,(SELECT d.`status` FROM `apis` d WHERE d.`version`=? AND d.`endpoint`=?) AS `status_api` FROM `applications` a WHERE a.`token`=?',[req.originalUrl.split('/')[1],'/'+req.originalUrl.split('/')[2].split('?')[0],req.originalUrl.split('/')[1],'/'+req.originalUrl.split('/')[2].split('?')[0],req.originalUrl.split('/')[1],'/'+req.originalUrl.split('/')[2].split('?')[0],req.headers.token]);
        if(rows.length==1){
            if(rows[0].status_api=='on'){
                if(rows[0].status=='on'){
                    if(rows[0].access){
                        const [total] = await connection.execute('SELECT SUM(a.`requests`) AS `total` FROM `applications__statistics` a WHERE a.`application` IN (SELECT b.`id` FROM `applications` b WHERE b.`account`=?) AND MONTH(a.`date`) = ? AND YEAR(a.`date`) = ?',[rows[0].account,new Date().getMonth()+1,new Date().getFullYear()]);
                        if(parseInt(total[0].total)>=parseInt(rows[0].limit)){
                            res.status(403).json({status: 'forbidden', message: 'You have reached the monthly request limit', errors: []});
                        }else{
                            const [statistics] = await connection.execute('SELECT a.* FROM `applications__statistics` a WHERE a.`application`=? AND a.`date`=?',[rows[0].id,moment().tz("America/Sao_Paulo").format("YYYY-MM-DD")]);
                            if(statistics.length==1){
                                await connection.execute('UPDATE `applications__statistics` SET `requests`=requests+1 WHERE `application`=? AND date=?',[rows[0].id,moment().tz("America/Sao_Paulo").format("YYYY-MM-DD")]);
                            }else{
                                await connection.execute('INSERT INTO `applications__statistics` (`id`,`application`,`date`,`requests`) VALUES (?,?,?,?)',[uid(),rows[0].id,moment().tz("America/Sao_Paulo").format("YYYY-MM-DD"),1]);
                            }
                            req.request = rows[0].request;
                            next();
                        }
                    }else{
                        res.status(401).json({status: 'unauthorized', message: 'Access denied, API not authorized in this application.', errors: []});
                    }
                }else{
                    res.status(401).json({status: 'unauthorized', message: 'Access denied, your application is suspended or disabled.', errors: []});
                }
            }else{
                res.status(401).json({status: 'unauthorized', message: 'Access denied, this API is down for maintenance or has been discontinued.', errors: []});
            }
        }else{
            res.status(401).json({status: 'unauthorized', message: 'Access denied, invalid token.', errors: []});
        }
    }else{
        res.status(401).json({status: 'unauthorized', message: 'Access denied, token not provided.', errors: []});
    }*/

    if(req.headers.token){
        const moment = require('moment-timezone');
        const ShortUniqueId = require('short-unique-id');
        const JsonRecords = require('json-records');
        let application = new JsonRecords('./database/applications.json');
        application = application.get(record => record.token === req.headers.token);
        let apis = new JsonRecords('./database/apis.json');
        let api = apis.get(record => record.version === req.originalUrl.split('/')[1] && record.endpoint === '/'+req.originalUrl.split('/')[2].split('?')[0]);
        if(application.length){
            if(application[0].status=='on'){
                if(api.length&&api[0].status=='on'){
                    if(application[0].api.includes(api[0].id)){
                        let account = new JsonRecords('./database/accounts.json');
                        account = account.get(record => record.id === application[0].account);
                        let plan = new JsonRecords('./database/plans.json');
                        plan = plan.get(record => record.id === account[0].plan);
                        let applications = new JsonRecords('./database/applications.json');
                        applications = applications.get(record => record.account === account[0].id);
                        applications = applications.map(el => el.id);
                        let analytics = new JsonRecords('./database/analytics.json');
                        let analytic = analytics.get();
                        analytic = analytic.map(el => {
                            if(applications.includes(el.application)&&el.date>=moment().tz("America/Sao_Paulo").startOf('month').format("YYYY-MM-DD")&&el.date<=moment().tz("America/Sao_Paulo").endOf('month').format("YYYY-MM-DD")){
                                return el.requests;
                            }
                        });
                        analytic = analytic.filter(Number);
                        const total = analytic.reduce((partialSum, a) => partialSum + a, 0);
                        if(parseInt(total)>=parseInt(plan[0].request)){
                            res.status(403).json({status: 'forbidden', message: 'You have reached the monthly request limit', errors: []});
                        }else{
                            let params = api[0].request.map(el => {
                                if(el.route === `${req.originalUrl.split('/')[3]==undefined?'':'/'+req.originalUrl.split('/')[3].split('?')[0]}` && el.method === req.method){
                                    return el.params;
                                }
                            });
                            params = params.filter(item => item);
                            req.request = params[0];
                            params = api[0].response.map(el => {
                                if(el.route === `${req.originalUrl.split('/')[3]==undefined?'':'/'+req.originalUrl.split('/')[3].split('?')[0]}` && el.method === req.method){
                                    return el.params;
                                }
                            });
                            params = params.filter(item => item);
                            req.response = params[0];
                            next();
                        }
                    }else{
                        res.status(401).json({status: 'unauthorized', message: 'Access denied, API not authorized in this application.', errors: []});
                    }
                }else{
                    res.status(401).json({status: 'unauthorized', message: 'Access denied, this API is down for maintenance or has been discontinued.', errors: []});
                }
            }else{
                res.status(401).json({status: 'unauthorized', message: 'Access denied, your application is suspended or disabled.', errors: []});
            }
        }else{
            res.status(401).json({status: 'unauthorized', message: 'Access denied, invalid token.', errors: []});
        }
    }else{
        res.status(401).json({status: 'unauthorized', message: 'Access denied, token not provided.', errors: []});
    }
}

module.exports = { token };