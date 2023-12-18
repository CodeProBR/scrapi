async function params(req, res, next){
    let errors = [];
    req.request.map(el => {
        if(el.required && !req.query[el.id]){
            errors.push(`The ${el.id} parameter was not sent or is null.`);
        }else{
            if(el.type !== typeof req.query[el.id]){
                errors.push(`The ${el.id} parameter is not of type ${el.type}.`);
            }
            if(el.length && req.query[el.id].length!=el.length){
                errors.push(`The ${el.id} parameter must have ${el.length} characters.`);
            }
        }
        
    });
    if(errors.length){
        res.status(422).json({status: 'unprocessable entity', message: 'Invalid or not found parameters.', errors: errors});
    }else{
        next();
    }
}

/*async function params(req){
    let errors = [];
    req.request.map(el => {
        if(el.required && !req.query[el.id]){
            errors.push(`The ${el.id} parameter was not sent or is null.`);
        }else{
            if(el.type !== typeof req.query[el.id]){
                errors.push(`The ${el.id} parameter is not of type ${el.type}.`);
            }
            if(el.length && req.query[el.id].length!=el.length){
                errors.push(`The ${el.id} parameter must have ${el.length} characters.`);
            }
        }
        
    });
    return errors;
}*/

module.exports = { params };