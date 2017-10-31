const express = require('express');
const router = express.Router();
const userModel = require('../models/user_model_v2');
const commonMessage = require('../configs/common_messages.json');
const bodyChecker = require('../utilities/body_checker');


router.post('/login', async(req, res) => {
    let bodyComplete = bodyChecker.check(['Token', 'Strategy', 'id', 'Name', 'Email'], req.body);
    if(bodyComplete) {
        try {
            console.log(req.body);
            let resp = await userModel.loginv2(req.body);
            if(resp === false) res.status(200).send(commonMessage.session_invalid);
            else res.status(200).send(
                {
                    success: true,
                    code: "000",
                    message: "Login berhasil",
                    Profile:resp
                });
        } catch (err) {
            console.log(err);
            res.status(200).send(commonMessage.service_not_responding);
        }
    }else res.status(200).send(commonMessage.body_body_empty);

});

router.post('/status', async(req, res) =>{
   if(bodyChecker.check(['Token'], req.body)){
       try {
           let status = await userModel.checkToken(req.body['Token']);
           if (status === false) res.status(200).send(commonMessage.session_invalid);
           else res.status(200).send({success: true, code: "000", message: "Token status valid"});
       }catch (err) {
           res.status(200).send(commonMessage.service_not_responding);
       }
   }else res.status(200).send(commonMessage.body_body_empty);
});


router.post('/path', async(req, res) =>{
    if(bodyChecker.check(['Token'], req.body)){
        try {
            let status = await userModel.checkToken(req.body['Token']);
            if (status === false) res.status(200).send(commonMessage.session_invalid);
            else {
                let pathModel = require('../models/trayek_model');
                let path = await pathModel.getTryekPath();
                res.status(200).send({
                    success: true,
                    message: "berhasil memuat permintaan",
                    code: "000",
                    data : path
                });
            }
        }catch (err) {
            res.status(200).send(commonMessage.service_not_responding);
        }
    }else res.status(200).send(commonMessage.body_body_empty);
});

router.post('/logout', async(req, res) =>{
    if(bodyChecker.check(['Token'], req.body)){
        try {
            await userModel.logout(req.body['Token']);
            res.status(200).send({success: true, code: "000", message: "Logout berhasil"});
        }catch (err){
            res.status(200).send(commonMessage.service_not_responding);
        }
    }else res.status(200).send(commonMessage.body_body_empty);
});





module.exports = router;