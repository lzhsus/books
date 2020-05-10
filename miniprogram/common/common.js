const formatMoney=function (value){
    value = Number(value)
    if (isNaN(value)) {
        return '--'
    }
    value = (value / 100).toFixed(2)
    if (Math.abs(value) < 1000) {
        return value
    }
    return value.replace(/./g, (c, i, a) => i && c !== '.' && !((a.length - i) % 3) ? ',' + c : c);
}

// 获取当前时间 YYYY-MMMM-DDDD
const getTime=function(dates) {
    dates = dates || new Date();
    const year = dates.getFullYear()
    const month = dates.getMonth() + 1
    const day = dates.getDate()
    const hour = dates.getHours()
    const minute = dates.getMinutes()
    const second = dates.getSeconds()

    var formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
    }
    return [year, month, day].map(formatNumber).join('-')

}
// 获取当前时间 YYYY-MMMM-DDDD hh:mm:ss
const getNewTime = function(type='',data){
    var date=data||new Date();
    if(type == 2){
        date.setTime(date.getTime()+24*60*60*1000);
    }

    var year=date.getFullYear();
    var month=date.getMonth()+1;
    var day=date.getDate();
    if (month<10){
        month = '0' + month
    }
    if (day<10){
        day = '0' + day
    }
    var hour=date.getHours();
    var minute=date.getMinutes();
    var second=date.getSeconds();

    //这样写显示时间在1~9会挤占空间；所以要在1~9的数字前补零;
    if (hour<10) {
        hour='0'+hour;
    }
    if (minute<10) {
        minute='0'+minute;
    }
    if (second<10) {
        second='0'+second;
    }

    var x=date.getDay();//获取星期
    if (type == 1||type==2) {
        return year + '-' + month + '-' + day;
    }
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}
// 计算两个时间的间隔天数
const getTimeToTimeDay=function($time1, $time2){
    var time1 = arguments[0], time2 = arguments[1];
    time1 = Date.parse(time1)/1000;
    time2 = Date.parse(time2)/1000;
    var time_ = time1 - time2;
    return (time_/(3600*24));
}
// 计算结束 如期 
/**
 * day 天数
 * oldTime 开始时间 YYYY-MMMM-DDDD
 * time2  结束时间  YYYY-MMMM-DDDD
 */
const getDayEndTime = function(day,oldTime){
    var date1 = new Date(oldTime);
    var date2 = new Date(oldTime);
    date2.setDate(date1.getDate()+day-1);
    var time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
    return time2;
}
const getCustomString = function(day,oldTime){
    var date1 = new Date(oldTime);
    var date2 = new Date(oldTime);
    date2.setDate(date1.getDate()+day);
    var time2 = date2.getFullYear()+""+(date2.getMonth()+1)+""+date2.getDate();
    return time2;
}
/**
 * 生成图片名称
 * dir 文件前缀
 * suffix 图片类型
 */
const createImgName = function (dir, suffix){
    var name='';
    name = dir + '_' + new Date().getTime() + '.' + (suffix||'png')

    return name;
}
// 判断手机号是否正常
const isMobilePhone = function (s) {
    let re = /^(((13[0-9]{1})|(15[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    return re.test(s);
};
// 时间转为秒 2020-02-27 16:01
export const transdate = function (endTime) {
    var date = new Date();
    console.log(endTime.substring(0, 4), endTime.substring(5, 7) - 1, endTime.substring(8, 10))
    console.log(endTime.substring(11, 13), endTime.substring(14, 16), endTime.substring(17, 19))
    date.setFullYear(endTime.substring(0, 4));
    date.setMonth(endTime.substring(5, 7) - 1);
    date.setDate(endTime.substring(8, 10));
    date.setHours(endTime.substring(11, 13));
    date.setMinutes(endTime.substring(14, 16));
    date.setSeconds(endTime.substring(17, 19));
    return Date.parse(date) / 1000;
}
// 计算小时数  1小时20分钟
const getHoreLong = function(start, end){
    var second_all = (transdate(end + ' 00:00:00') - transdate(start + ' 00:00:00'));
    console.log(start + ' 00:00:00', end + ' 00:00:00')
    if (second_all < 0) {
        return false
    } else {
        return formateSeconds(second_all)
    }
} 
const formateSeconds = function (endTime) {
    let secondTime = Number(endTime)//将传入的秒的值转化为Number
    let min = 0// 初始化分
    let h = 0// 初始化小时
    let d=0 //初始化天
    let result = ''
    if (secondTime >= 60) {//如果秒数大于60，将秒数转换成整数
        min = Number(secondTime / 60)//获取分钟，除以60取整数，得到整数分钟
        secondTime = Number(secondTime % 60)//获取秒数，秒数取佘，得到整数秒数
        if (min >= 60) {//如果分钟大于60，将分钟转换成小时
            h = Number(min / 60)//获取小时，获取分钟除以60，得到整数小时
            min = Number(min % 60) //获取小时后取佘的分，获取分钟除以60取佘的分
            if(h>=24){
                d=Number(h/24)
                h = Number(h % 24)
            }
        }
    }
    if (d) {
        result =d+'天'+ h + '小时' + min + '分'
    }else if (h) {
        result = h + '小时' + min + '分'
    } else {
        result = min + '分'
    }
    return {
        time: result,
        day: Number(d)||0
    }
}  
// 根据当前时间和随机数生成流水号
const randomNumber = function (j=2) {
    var random_no = "";
    for (var i = 0; i < j; i++) //j位随机数，用以加在时间戳后面。
    {
        random_no += Math.floor(Math.random() * 10);
    }
    const dates = new Date();
    var year = dates.getFullYear()
    var month = dates.getMonth() + 1

    var day = dates.getDate()
    var hour = dates.getHours()
    var minute = dates.getMinutes()
    var second = dates.getSeconds()
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }
    random_no = year + '' + month + '' + day + '' + hour + '' + minute + '' + second + '' + random_no ;
    return random_no;
}
// 处理手机号吗
const mobileStr = function(mobile){
    return mobile.substr(0,3)+"****"+mobile.substr(7); //131****5555
}
// huoq
// 获取当前后四天
const tabDay = function(dayNum,data){
    if(data){
        var oDate = new Date(data);   //获取当前时间袭
    }else{
        var oDate = new Date();   //获取当前时间袭
    }
    var dayArr = [];     //定义一百个数组存储所以时度间
    for(var i=0;i<dayNum;i++){
        var day = new Date(oDate.getFullYear(),oDate.getMonth(),oDate.getDate() + i)
        var m = new Date(day).getMonth()+1;
        var d = new Date(day).getDate();
        if(m<10){
            m= '0'+m
        }
        if(d<10){
            d= '0'+d
        }
        day = new Date(day).getFullYear()+'-'+m+'-'+d;
        dayArr.push({
            time:day,
            week:getMyDay(day)
        });   //把未来几问天的时间放到数组里
    }
    return dayArr;   //返回一个数组。答
} 
const getMyDay = function(date) {
    var week;
    date = new Date(date)
    if (date.getDay() == 0) week = "周日"
    if (date.getDay() == 1) week = "周一"
    if (date.getDay() == 2) week = "周二"
    if (date.getDay() == 3) week = "周三"
    if (date.getDay() == 4) week = "周四"
    if (date.getDay() == 5) week = "周五"
    if (date.getDay() == 6) week = "周六"
    return week
}
module.exports = {
    getTime: getTime,
    getNewTime:getNewTime,
    getTimeToTimeDay:getTimeToTimeDay,
    getDayEndTime:getDayEndTime,
    getCustomString:getCustomString,
    createImgName: createImgName,
    isMobilePhone: isMobilePhone,
    getHoreLong: getHoreLong,
    randomNumber: randomNumber,
    mobileStr:mobileStr,
    tabDay:tabDay
}