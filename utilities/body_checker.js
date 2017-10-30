check = (params, body) => {
    let valid = true;
    for(let i = 0; i < params.length; i++){
        if(!(params[i] in body)) valid = false
    }
    return valid;
};

module.exports = {
    check:check
};