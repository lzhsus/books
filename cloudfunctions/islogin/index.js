

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
    var res = await db.collection('db_id_login').get()
   
    return res.data[0];
}