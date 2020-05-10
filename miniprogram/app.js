//app.js
const common = require('./common/common')
App({
    onLaunch: function () {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                // env: 'my-env-id',
                traceUser: true,
            })
        }

        this.globalData = {}
        this.common = common;
    },
    // 获取用户信息
    getUserInfo(){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        wx.cloud.callFunction({
            name: 'userinfo'
        }).then(res=>{
            res = res.result
            wx.hideLoading()
            if (res.success) {
                this.globalData.userInfo = res.result
            }else{
                wx.showModal({
                    content: res.msg,
                    showCancel: false
                })
            }
        })
    },

    // 查询 更新用户信息
    async getUserInfo() {
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        return new Promise(async (resolve, reject) => {
            wx.cloud.callFunction({
                name: 'userinfo'
            }).then(res=>{
                res = res.result
                wx.hideLoading()
                if (res.success) {
                    _this.globalData.userInfo = res.result
                }else{
                    wx.showModal({
                        content: res.msg,
                        showCancel: false
                    })
                }
                resolve(res.result)
            })
        })
    },
    // 获取用户信息
    onGetUserInfo: function (e, cd) {
        var _this = this;
        let detail = e.detail;
        // 拒绝授权
        if (!detail.encryptedData) {
            wx.hideLoading()
            wx.showModal({
                showCancel: false,
                content: '请允许获取用户信息！'
            })
            return
        }
        var data_info = {
            avatarUrl: e.detail.userInfo.avatarUrl,
            city: e.detail.userInfo.city,
            country: e.detail.userInfo.country,
            gender: e.detail.userInfo.gender,
            language: e.detail.userInfo.language,
            nickName: e.detail.userInfo.nickName,
            province: e.detail.userInfo.province,
            type: 1,
        }
        wx.cloud.callFunction({
            name: 'userinfo',
            data: data_info
        }).then(res => {
            cd && cd(res)
        })
    },
})