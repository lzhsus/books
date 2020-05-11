// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {

    switch (event.action) {
        case 'classify': {
            return db_product_classify(event)
        }
        case 'product': {
            return db_product_list(event)
        }
        case 'administrator': {
            return administrator(event)
        }
        
        case 'favorites':{
            return is_favorites(event)
        }
        case 'getfavorites':{
            return getfavorites(event)
        }
        
        case 'personal':{
            return db_personal_info(event)
        }
        default: {
            return
        }
    }
}
// 分类tab
async function db_product_classify(event) {
    const wxContext = cloud.getWXContext(); 
    
    var db_product_classify= await db.collection('db_product_classify').get()

    return {
        errcode:200,
        result:db_product_classify.data,
        success:true
    }
}
// 商品
async function db_product_list(event) {
    const wxContext = cloud.getWXContext(); 
  
    var db_product_list= await db.collection('db_product_list').where({
        inventory:_.gte(1),
        type:Number(event.type)
    }).get()

    for(let i=0;i<db_product_list.data.length;i++){
        var favorites = await db.collection('is_favorites').where({
            openId:wxContext.OPENID,
            productId:db_product_list.data[i]._id
        }).get()
        db_product_list.data[i].is_favorites = favorites.data.length
    }

    return {
        errcode:200,
        result:db_product_list.data,
        success:true
    }
}
// 点赞 取消点赞
async function is_favorites(event) {
    const wxContext = cloud.getWXContext(); 
    var data_info = event
    data_info.openId = wxContext.OPENID;
    data_info.appId = wxContext.APPID;
    data_info.env = wxContext.ENV;
    data_info.create_time = db.serverDate();
    data_info.updata_time = db.serverDate();
    data_info.productId = event.productId
    if(event.type){
        var db_product_classify= await db.collection('is_favorites').add({
            data:data_info
        })
    }else{
        var db_product_classify= await db.collection('is_favorites').where({
            openId:wxContext.OPENID,
            productId:event.productId
        }).remove()
    }

    return {
        errcode:200,
        result:db_product_classify.data,
        success:true
    }
}async function getfavorites(event) {
    const wxContext = cloud.getWXContext(); 
        var db_product_classify= await db.collection('is_favorites').where({
            openId:wxContext.OPENID
        }).get()
    return {
        errcode:200,
        result:db_product_classify.data||[],
        success:true
    }
}

// 添加更新个人嘻嘻你下
async function db_personal_info(event) {
    const wxContext = cloud.getWXContext(); 
    
    // 获取个人信息
    var productInfo= await db.collection('db_personal_info').where({
        openId:wxContext.OPENID
    }).get()
    productInfo = productInfo.data[0]
    if(event.look){
        return {
            errcode:200,
            result:productInfo,
            success:true
        }
    }
    var data_info = event;
    data_info.openId = wxContext.OPENID;
    data_info.appId = wxContext.APPID;
    data_info.env = wxContext.ENV;
    data_info.create_time = db.serverDate();
    data_info.updata_time = db.serverDate();
    if(productInfo){
        await db.collection('db_personal_info').where({
            openId:wxContext.OPENID,
            _id:productInfo._id
        }).update({
            data:data_info
        })
    }else{
        await db.collection('db_personal_info').add({
            data:data_info
        })
    }
    return {
        errcode:200,
        result:{},
        success:true
    }
}
// 超级管理员

async function administrator(event) {
    const wxContext = cloud.getWXContext(); 
    // 超级管理员
    if(!event.type){
        var db_product_list= await db.collection('db_product_list')
        .limit(1000)
        .get()
    }else{
        // status 1 上架
        var db_product_list= await db.collection('db_product_list').where({
            type:Number(event.type)
        }).limit(1000).get()
    }
    db_product_list = db_product_list.data

    for(let i=0;i<db_product_list.length;i++){
        var favorites = await db.collection('is_favorites').where({
            productId:db_product_list[i]._id
        }).count()
        db_product_list[i].favorites_count = favorites.total
    }

    return {
        errcode:200,
        result:db_product_list,
        success:true
    }
}
