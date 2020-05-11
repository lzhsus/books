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
        case 'hotproduct': {
            return hotproductlist(event)
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
        case 'detail':{
            return detail(event)
        }
        case 'randomProduct':{
            return randomProduct(event)
        }
        case 'borrow':{
            return borrow(event)
        }
        case 'searchhot':{
            return search_hot(event)
        }
        case 'BorrowList':{
            return BorrowList(event)
        }
        case "searchmore":{
            return searchmore(event)
        }
        default: {
            return
        }
    }
}
// 分类tab所属类别
async function db_product_classify(event) {
    const wxContext = cloud.getWXContext(); 
    
    var db_product_classify= await db.collection('db_product_classify').get()

    return {
        errcode:200,
        result:db_product_classify.data,
        success:true
    }
}
// 商品列表
async function db_product_list(event) {
    const wxContext = cloud.getWXContext(); 
  
    var db_product_list= await db.collection('db_product_list').where({
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
// 热门产品
async function hotproductlist(event) {
    const wxContext = cloud.getWXContext(); 
  
    var db_product_list= await db.collection('db_product_list').where({
        hot:1
    }).get()
    db_product_list = db_product_list.data
    for(let i=0;i<db_product_list.length;i++){
        var favorites = await db.collection('is_favorites').where({
            openId:wxContext.OPENID,
            productId:db_product_list[i]._id
        }).get()
        db_product_list[i].is_favorites = favorites.data.length
    }

    return {
        errcode:200,
        result:db_product_list,
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
}
// 收藏列表
async function getfavorites(event) {
    const wxContext = cloud.getWXContext(); 
    var productClassify= await db.collection('is_favorites').where({
        openId:wxContext.OPENID
    }).get()
    productClassify = productClassify.data||[]
        
    for(let i=0;i<productClassify.length;i++){
        var product = await db.collection('db_product_list').where({
            _id:productClassify[i].productId
        }).get()
        productClassify[i].product = product.data[0]
        productClassify[i].is_favorites = 1
    }
    return {
        errcode:200,
        result:{
            list:productClassify
        },
        success:true
    }
}

// 添加更新个人信息
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
// 详细图书信息
async function detail(event) {
    const wxContext = cloud.getWXContext(); 
    var productClassify= await db.collection('db_product_list').where({
        _id:event.id,
    }).get()
    productClassify = productClassify.data[0]||{}
    
    var is_favorites= await db.collection('is_favorites').where({
        openId:wxContext.OPENID,
        productId:event.id
    }).get()
    productClassify.is_favorites = is_favorites.data.length
    return {
        errcode:200,
        result:productClassify,
        success:true
    }
}
// 获取随机推荐（相关图书）

async function randomProduct(event) {

    const wxContext = cloud.getWXContext(); 
    var productClassify= await db.collection('db_product_list')
    .aggregate()
    .sample({
        size: event.size
    })
    .end()
    productClassify = productClassify.list||[]
    // productClassify = productClassify.data||[]
    
    return {
        errcode:200,
        result:productClassify,
        success:true
    }
}
// 立即借阅
async function borrow(event) {
    const wxContext = cloud.getWXContext(); 
    var result = await db.collection('db_borrow_list').where({
        openId:wxContext.OPENID,
        productId:event.productId
    }).get()
    result = result.data||[]
    if(result.length){
        // return {
        //     errcode:100,
        //     msg:"您已借阅改图书，不可重复借阅！",
        //     result:{},
        //     success:false
        // }
    }
    // 检查库存
    var productReRsult = await db.collection('db_product_list').where({
        _id:event.productId
    }).get()
    productReRsult = productReRsult.data[0]||{}
    if(productReRsult.inventory<=0){
        return {
            errcode:100,
            msg:"库存不足！",
            result:{},
            success:false
        }
    }

    var outTradeNo="";  //订单号
    for(var i=0;i<4;i++){
        outTradeNo += Math.floor(Math.random()*10);
    }
    outTradeNo = new Date().getTime() + outTradeNo;  //时间戳，用来生成订单号。
    var data_info = event
    data_info.create_time = db.serverDate();
    data_info.updata_time = db.serverDate();
    data_info.out_trade_no = outTradeNo
    data_info.openId =wxContext.OPENID,
    await db.collection('db_borrow_list').add({
        data:data_info
    })
    
    await db.collection('db_product_list').where({
        _id:event.productId
    }).update({
        data:{
            inventory:productReRsult.inventory-1
        }
    })
    // productClassify = productClassify.data||[]
    return {
        errcode:200,
        result:{},
        success:true
    }
}
// 热搜关键词
async function search_hot(event) {
    const wxContext = cloud.getWXContext(); 
    var search_hot= await db.collection('db_search_hot').get()

    search_hot = search_hot.data||[]
    
    return {
        errcode:200,
        result:search_hot,
        success:true
    }
}
// 我的借阅
async function BorrowList(event) {
    const wxContext = cloud.getWXContext(); 
    if(event.type==0){
        var db_product_list= await db.collection('db_borrow_list')
        .limit(1000)
        .get()
    }else if(event.type==1){
        //  借阅中
        var db_product_list= await db.collection('db_borrow_list').where({
            status:1
        }).limit(1000).get()
    }else if(event.type==2){
        // 已归还
        var db_product_list= await db.collection('db_borrow_list').where({
            status:2
        }).limit(1000).get()
    }else if(event.type==3){
        // 已取消
        var db_product_list= await db.collection('db_borrow_list').where({
            status:3
        }).limit(1000).get()
    }

    return {
        errcode:200,
        result:db_product_list.data,
        success:true
    }
}
// 搜索
async function searchmore(event) {
    const wxContext = cloud.getWXContext(); 
    
    if(event.value){
        var res= await db.collection('db_product_list').where(_.or([
            {
                title: db.RegExp({
                    regexp: event.value,
                    options: 'i',
                  })
                  
            },{
                publishing_house: db.RegExp({
                    regexp: event.value,
                    options: 'i',
                  })
            },{
                type_config: db.RegExp({
                    regexp: event.value,
                    options: 'i',
                  })
            },{
                author:{
                    name: db.RegExp({
                        regexp: event.value,
                        options: 'i',
                    })
                }
            }
        ])).get();
    }else{
        var res= await db.collection('db_product_list').where({
            status:1
        }).get();
    }
    
    res = res.data||[]
        
    
    for(let i=0;i<res.length;i++){
        var favorites = await db.collection('is_favorites').where({
            openId:wxContext.OPENID,
            productId:res[i]._id
        }).get()
        res[i].is_favorites = favorites.data.length
    }

    return {
        errcode:200,
        result:res,
        success:true
    }
}
