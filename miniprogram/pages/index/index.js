//index.js
const app = getApp()

Page({
    data: {
        pageShow:true,
        userInfo: {},
    },

   async onLoad () {
        await app.getUserInfo().then(res => {
            this.setData({
                userInfo: app.globalData.userInfo,
                pageShow: true
            })
        })
    }
})