function convertISODateToString(date) {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var dt = date.getDate();
    var time = addZero(date.getHours())+':'+addZero(date.getMinutes())+':'+addZero(date.getSeconds());

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return year+'-' + month + '-'+dt+' '+time;
}




function addZero(number) {
    number = parseInt(number);
    var s = "";
    if(number < 10){
        s = '0'+number.toString();
    }else s = number.toString();

    return s;
}

module.exports = {
    convertISODateToString:convertISODateToString
};