// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
    switch (event.action) {
        case 'administrator': {
            return administrator(event)
        }
        case 'updata': {
            return updata(event)
        }
        default: {
            return
        }
    }
}
// 超级管理员
async function administrator(event) {
    const wxContext = cloud.getWXContext(); 
    // 超级管理员
    if(event.type==0){
        var db_product_list= await db.collection('db_product_list')
        .limit(1000)
        .get()
    }else if(event.type==1){
        //  上架
        var db_product_list= await db.collection('db_product_list').where({
            status:1
        }).limit(1000).get()
    }else if(event.type==2){
        // 未上架
        var db_product_list= await db.collection('db_product_list').where({
            status:0
        }).limit(1000).get()
    }else if(event.type==3){
        // s 热搜
        var db_product_list= await db.collection('db_product_list').where({
            hot:1
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
// 更新
async function updata(event) {
    const wxContext = cloud.getWXContext(); 
    // 超级管理员  状态
    if(event.type==1){
        var res = await db.collection('db_product_list').where({
            _id:event.id
        }).update({
            data:{
                status:event.status
            }
        })
    }else if(event.type==2){  //加入热搜
        var res = await db.collection('db_product_list').where({
            _id:event.id
        }).update({
            data:{
                hot:event.hot
            }
        })
    }

    return {
        errcode:200,
        result:{},
        success:true
    }
}