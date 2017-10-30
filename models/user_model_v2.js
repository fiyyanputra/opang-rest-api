const app = require('../app');
const moment = require('moment');
let database = app.db;
let userCollection = database.collection('tb_user');
let tokenCollection = database.collection('tb_token');
const md5 = require('md5');


const AVAILABLE_STRATEGIES = {
    FACEBOOK : "facebook",
    GOOGLE : "google"
};

const requisition = require('requisition');
let profileUtils = require('../utilities/profile_utils');


/** insert user V2 **/
insertUserV2 = (query) =>{
    return new Promise(async(resolve, reject) =>{
        let strategies = [];
        strategies.push(query['Strategy']);
        let user = {
            "Version" : 2,
            "Email" : query['Email'],
            "Strategies" : strategies,
            "CreatedAt" : new Date(),
            "Profile" : {
                "CheckPoint" : 1,
                "Picture" : query['Image'],
                "DisplayName" : query['Name']
            }
        };
        try{
            let result = await userCollection.insertOne(user);
            resolve(result["ops"][0]);
        }catch (err){
            reject(err);
        }
    });
};

/** generate token **/
createToken = async(_id) => {
    return new Promise(async(resolve, reject) =>{
        try {
            let tokens = await tokenCollection.find({
                "UserID" : _id,
                "EndTime": "0000-00-00 00:00:00"
            }).toArray();
            if(tokens.length > 0){
                for(let i =0; i < tokens.length; i++){
                    await tokenCollection.updateOne({
                        "_id" : tokens[i]['_id']
                    }, {$set : {
                        EndTime : moment().format('YYYY-MM-DD HH:mm:ss')
                    }});
                }
            }
            let token = md5(_id+"-"+moment().format('YYYYMMDDHHmmss'));
            let tokenDetail = await tokenCollection.insertOne(
                {
                    "UserID": _id,
                    "StartTime": moment().format('YYYY-MM-DD HH:mm:ss'),
                    "EndTime": "0000-00-00 00:00:00",
                    "Token": token
                }
            );
            tokenDetail = tokenDetail['ops'][0];
            console.log(tokenDetail);
            resolve(tokenDetail['Token']);
        }catch (err){
            reject(err);
        }
    });
};


/** check token **/
checkToken = async(token) =>{
  return new Promise(async (resolve, reject) =>{
     try {
         let resp = await tokenCollection.find({
             "Token" : token,
             "EndTime": "0000-00-00 00:00:00"
         }).toArray();
         if(resp.length > 0){
             resolve(resp[0]['UserID']);
         }else resolve(false);
     }catch (err){
         reject(err);
     }
  });
};


getProfile = async(userID) =>{
    return new Promise(async (resolve, reject) =>{
        try {
            let resp = await userCollection.find({
                "Version" : 2,
                "_id": userID
            }).toArray();
            if(resp.length > 0){
                resolve(resp[0]);
            }else resolve(false);
        }catch (err){
            reject(err);
        }
    });
};

/** logout **/
logout = async(token) =>{
  return new Promise(async(resolve, reject) =>{
      try {
          await tokenCollection.updateOne({
              "Token" : token
          }, {$set : {
              EndTime : moment().format('YYYY-MM-DD HH:mm:ss')
          }});
          resolve(true);
      }catch (err){
          reject(err);
      }
  });
};

/** Login **/
loginv2 = (query) => {
  return new Promise(async(resolve, reject) => {
      try {
          let strategy = query['Strategy'];
          let invalid;
          let tokenResult = {};
          let userPropic;
          switch (strategy){
              case AVAILABLE_STRATEGIES.FACEBOOK:
                  console.log(strategy);
                  tokenResult = await requisition('https://graph.facebook.com/me?access_token='+query['Token']);
                  tokenResult = await tokenResult.json();
                  invalid = (tokenResult.hasOwnProperty('error'));
                  if(!invalid) userPropic = profileUtils.facebookProfic(tokenResult['id']);
                  break;
              case AVAILABLE_STRATEGIES.GOOGLE:
                  /* gplus api not store access_token */

                  break;
          }
          if(invalid)resolve(false);
          else {
              let users = await userCollection.find({
                  "Version": 2,
                  "Email": query['Email'],
                  "Profile.CheckPoint": 1
              }).toArray();
              if(users.length > 0){
                 // users = await insertUserV2(query);
                  users = users[0];
                  console.log(users);
                  users['Token'] = await createToken(users['_id']);
                  resolve(users);
              }else {
                  switch (strategy){
                      case AVAILABLE_STRATEGIES.FACEBOOK:
                          query['Image'] = profileUtils.facebookProfic(query['id']);
                          break;
                      case AVAILABLE_STRATEGIES.GOOGLE:
                          query['Image'] = await profileUtils.gplusProfic(query['id']);
                          break;
                  }
                  users = await insertUserV2(query);
                  users['Token'] = await createToken(users['_id']);
                  resolve(users);
              }

              resolve(tokenResult);
          }
      }catch (err){
          reject(err);
      }
  });
};


module.exports = {
    insertUserV2:insertUserV2,
    loginv2:loginv2,
    checkToken:checkToken,
    logout:logout,
    getProfile:getProfile
};