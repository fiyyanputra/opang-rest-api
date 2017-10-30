function createIndex(collection, callback) {
    collection.createIndex({point:"2dsphere"}, function (err, res) {
        if(err)callback(err, null);
        else callback(null, res);
    });
}

module.exports = {
    createIndex:createIndex
};