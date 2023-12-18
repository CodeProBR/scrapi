async function params(req,res){
    let response = {};
    req.response.map((el) => {
        if(el.type=='array'){
            response[el.id] = [];
            res[el.reference].map((el2,i) => {
                response[el.id][i] = {};
                el.params.map((el3) => {
                    response[el.id][i][el3.id] = res[el.reference][i][el3.reference];
                });
            });
        }else if(el.type=='object'){
            response[el.id] = {};
            el.params.map((el2) => {
                if(el2.type=='object'){
                    response[el.id][el2.id] = {};
                    el2.params.map((el3) => {
                        if(el2.reference){
                            response[el.id][el2.id][el3.id] = res[el.reference][el2.reference][el3.reference];
                        }else if(el.reference){
                            response[el.id][el2.id][el3.id] = res[el2.reference][el3.reference];
                        }else{
                            response[el.id][el2.id][el3.id] = res[el3.reference];
                        }
                    });
                }else{
                    if(el.reference){
                        response[el.id][el2.id] = res[el.reference][el2.reference];
                    }else{
                        response[el.id][el2.id] = res[el2.reference];
                    }
                }
            });
        }else{
            response[el.id] = res[el.reference];
        }
    });
    return response;
}

module.exports = { params };