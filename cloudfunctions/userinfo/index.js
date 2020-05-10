

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
    const wxContext = cloud.getWXContext(); 
   
    if (event.type){
        event.updata_time = db.serverDate();
        var res = await db.collection('db_userinfo').where({
            openId: wxContext.OPENID
        }).update({
            data:event
        })

        var data =  res;
        return data;
    }
    var userinfo= await db.collection('db_userinfo').where({
        openId: wxContext.OPENID
    }).get()
    var db_status= await db.collection('db_status').get()
    var result = userinfo.data[0]

    if (result) {
        result.is_status = db_status.data[0];
        return {
            errcode:200,
            result:result,
            success:true
        };
    }else{
        var data_info = {};
        data_info.openId = wxContext.OPENID;
        data_info.appId = wxContext.APPID;
        data_info.env = wxContext.ENV;
        data_info.create_time = db.serverDate();
        data_info.updata_time = db.serverDate();
        await db.collection('db_userinfo').add({
            // data 字段表示需新增的 JSON 数据
            data: data_info
        })
        data_info.is_status = db_status.data[0];
        return {
            errcode:200,
            result:data_info,
            success:true
        };
    }
}