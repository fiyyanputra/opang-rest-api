const express = require('express');
const router = express.Router();
const usrModel = require('../models/user_model');
const trayekModel = require('../models/trayek_model');
const commonMsg = require('../configs/common_messages.json');
const penumpangModel = require('../models/penumpang_model');

router.post('/tambah-penumpang', async(req, res) => {
    let session_id = req.body['session_id'];
    let jumlahPenunggu = req.body['jumlah_penunggu'];
    let trayekID = req.body['trayek_id'];
    let flag = req.body['flag'];
    if(session_id === undefined || jumlahPenunggu === undefined || trayekID === undefined || flag === undefined){
        res.status(200).send(commonMsg.body_body_empty);
    }else {
        try {
            let profile = await usrModel.checkSession(session_id);
            if(profile === null) res.status(200).send(commonMsg.session_invalid);
            else {
                let result = await penumpangModel.insertPenumpang(req.body);
                res.status(200).send({success: true, code : '000', message: 'Berhasil menambahkan penunggu', object_id: result});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(commonMsg.service_not_responding);
        }
    }
});



router.post('/update-penumpang', async(req, res) => {
    let session_id = req.body['session_id'];
    let object_id = req.body['object_id'];
    if(session_id === undefined || object_id === undefined){
        res.status(200).send(commonMsg.body_body_empty);
    }else {
        try {
            let profile = await usrModel.checkSession(session_id);
            if(profile === null) res.status(200).send(commonMsg.session_invalid);
            else {
                await penumpangModel.updateStatusPenumpang(req.body);
                res.status(200).send({success: true, code : '000', message: 'Berhasil update penumpang'});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(commonMsg.service_not_responding);
        }
    }
});



router.post('/check-penumpang', async(req, res) => {
    let session_id = req.body['session_id'];
    let object_id = req.body['object_id'];
    if(session_id === undefined || object_id === undefined){
        res.status(200).send(commonMsg.body_body_empty);
    }else {
        try {
            let profile = await usrModel.checkSession(session_id);
            if(profile === null) res.status(200).send(commonMsg.session_invalid);
            else {
                let result = await penumpangModel.checkStatusPenumpang(req.body);
                res.status(200).send({success: true, code : '000', message: 'Berhasil memuat permintaan', data: result});
            }
        }catch (err){
            console.log(err);
            res.status(200).send(commonMsg.service_not_responding);
        }
    }
});


router.post('/get-penumpang', async(req, res) => {
    let session_id = req.body['session_id'];
    let trayekID = req.body['trayek_id'];
    if(session_id === undefined || trayekID === undefined){
        res.status(200).send(commonMsg.body_body_empty);
    }else {
        try {
            let profile = await usrModel.checkSession(session_id);
            if(profile === null) res.status(200).send(commonMsg.session_invalid);
            else {
                let result = await trayekModel.getPenumpang(req.body);
                res.status(200).send(
                    {
                        success: true,
                        code : '000',
                        message: 'Berhasil menambahkan penunggu',
                        data : result
                    }
                );
            }
        }catch (err){
            console.log(err);
            res.status(200).send(commonMsg.service_not_responding);
        }
    }
});



router.post('/get-trayek', async(req, res) => {
    try {
        let trayek = await trayekModel.getTrayek();
        res.status(200).send(
            {
                success: true,
                code : '000',
                message: 'Berhasil memuat permintaan',
                data : trayek
            }
        );
    }catch (err){
        console.log(err);
        res.status(200).send(commonMsg.service_not_responding);
    }
});


/**
 * menyimpan data lokasi penumpang
 * saat naik dan turun
 */
router.post('/log-penumpang-state', async (req, res) => {
    let session_id = req.body['session_id'];
    let trayek_id = req.body['trayek_id'];
    let state = req.body['state']; // 1: Naik 0:Turun
    let longitude = req.body['longitude'];
    let latitude = req.body['latitude'];

    if (session_id === undefined
        || trayek_id === undefined
        || state === undefined
        || longitude === undefined
        || latitude === undefined) {
        res.status(200).send(commonMsg.body_body_empty);
    } else {
        try {
            let profile = await usrModel.checkSession(session_id);
            if (profile === null) res.status(200).send(commonMsg.session_invalid);
            else {
				let angkot = await usrModel.getDataAngkotBySession(session_id);
				if(angkot !== null){
					req.body['plat_nomor'] = angkot.PlatNomor;
				}
                let result = await penumpangModel.insertLogPenumpang(req.body);
                res.status(200).send({ success: true, code: '000', message: 'Berhasil', data: result });
            }
        } catch (err) {
            console.log(err);
            res.status(200).send(commonMsg.service_not_responding);
        }
    }
});

module.exports = router;