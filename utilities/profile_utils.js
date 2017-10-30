const axios = require('axios');

facebookProfic = (id) =>{
  return "https://graph.facebook.com/"+id+"/picture?type=large"
};

gplusProfic = async(id) => {
    const requisition = require('requisition');
    let endpointUrl = "https://www.googleapis.com/plus/v1/people/"+id+"?fields=image&key="+require('../configs/constants').gplus_api_client;
    let resp = await requisition(endpointUrl);
    resp = await resp.json();
    return resp['image']['url'].replace('?sz=50','');
};





// test 103102743708049240037
// EAAKhgRIQPZAEBAD9mjucJ1yR9JcT3ZCaNY3PZCfSlUbPiPczZAKFryZAtCzfyXSIty0A3swWnRQg7PA6tHqAmXisiohxpF4lXdvdZAtuZBCsFlWuQGEOaaZBJEw2Mg6KQn6uEvXVQr03FMeTsCZClCBcltZCcA2iYmIS87ZCfufKpNiEsWEfagHvtqlit55x268RzZAuRtdhZBzCseQZDZD





module.exports = {
    facebookProfic:facebookProfic,
    gplusProfic:gplusProfic
};