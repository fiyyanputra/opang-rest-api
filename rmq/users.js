let userModel = require('../models/user_model');
let commonMessage = require('../configs/common_messages.json');

updateUserLocation = (query) => {
    return new Promise(async(resolve, reject) => {
        let sessionID = query['session_id'];
        let latitude = query['latitude'];
        let longitude = query['longitude'];
		let speed = query['speed'];
        let time = query['time'];
        let jumlahpenumpang = query['jumlah_penumpang'];
        if(sessionID === undefined || latitude === undefined
            || longitude === undefined || time === undefined || jumlahpenumpang === undefined){
            resolve(commonMessage.body_body_empty);
        }else {
            try{
                let userID = await userModel.checkSession(sessionID);
                if(userID === null)resolve(commonMessage.session_invalid);
                else {
                    query['ID'] = userID;
                    userModel.updateUserLocation(query).then(result => {
                        resolve(result);
                    }).catch(err => {
                       reject(err);
                    });
                }
            }catch (err){
                reject(err);
            }
        }
    });
};




module.exports = {
    updateUserLocation:updateUserLocation
};