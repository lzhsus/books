// pages/login/login.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
var timePromise = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageShow:false,
        userInfo:{},
        second:0,
        mobile:'',
        v_code:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
  async  onLoad (options) {
        const _this = this;
        await app.getUserInfo().then(res => {
            console.log(app.globalData.userInfo)
            _this.setData({
                userInfo: app.globalData.userInfo,
                pageShow:true
            })
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    bindgetuserinfo(e){
        var mobile = this.data.mobile;
        var v_code = this.data.v_code;
        // if (!mobile){
        //     wx.showToast({
        //         title: '请输入手机号码！',
        //         icon: 'none'
        //     })
        //     return
        // }
        // if (!app.common.isMobilePhone(mobile)){
        //     wx.showToast({
        //         title: '请输入正确的手机号码！',
        //         icon: 'none'
        //     })
        //     return
        // }
        // if (!v_code) {
        //     wx.showToast({
        //         title: '请输入验证码！',
        //         icon: 'none'
        //     })
        //     return
        // }
        var _this = this;wx.showLoading({
            title: '加载中',
            mask: true
        });
        app.onGetUserInfo(e,res=>{
            wx.hideLoading()
            res = res.result
            console.log(res)
            if (res.errMsg == "cloud.callFunction:ok"||res.errMsg == "collection.update:ok") {
                var userInfo = _this.data.userInfo;
                userInfo.avatarUrl=e.detail.userInfo.avatarUrl;
                _this.validateCodeBtn(1)
                _this.setData({
                    userInfo:userInfo
                })
            } else {
                wx.showModal({
                    content: res.errMsg,
                    showCancel: false
                })
            }
        })
    },
    /**提交数据 */
    validateCodeBtn(type=0){
        var mobile = this.data.mobile;
        var v_code = this.data.v_code;
        if (!mobile){
            wx.showToast({
                title: '请输入手机号码！',
                icon: 'none'
            })
            return
        }
        if (!app.common.isMobilePhone(mobile)){
            wx.showToast({
                title: '请输入正确的手机号码！',
                icon: 'none'
            })
            return
        }
        if (!v_code) {
            wx.showToast({
                title: '请输入验证码！',
                icon: 'none'
            })
            return
        }
        
        if(!type){
            wx.showLoading({
                title: '加载中',
                mask: true
            });
        }
        this.validateCodeFunc(type)
    },
    // 输入手机号码
    mobileInput(e){
        console.log(e)
        this.setData({
            mobile: e.detail.value
        })
    },
    // 输入验证吗
    vcodeInput(e) {
        this.setData({
            v_code: e.detail.value
        })
    },
    // 倒计时
    countdownFn() {
        var that = this
        if (that.data.second > 0) return;
        var second = 120;
        timePromise = setInterval(() => {
            if (second <= 0) {
                clearInterval(timePromise);
                timePromise = undefined;
            } else {
                second--;
                that.setData({
                    second: second<=0?0:second
                })
            }
        }, 1000);
    },
     // 获取验证吗
     getCode(){
        var _this = this;
        var mobile = this.data.mobile;
        if (!mobile) {
            wx.showToast({
                title: '请输入手机号码！',
                icon: 'none'
            })
            return
        }
        if (!app.common.isMobilePhone(mobile)) {
            wx.showToast({
                title: '请输入正确的手机号码！',
                icon:'none'
            })
            return
        }
        if (this.data.second > 0) return;
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        /**倒计时 */
        wx.cloud.callFunction({
            name: 'zhenzisms',
            data: {
                $url: 'sendCode',
                apiUrl: 'https://sms_developer.zhenzikj.com',
                message: '验证码是:${code},有效时长2分钟，验证码打死不告诉别人额！',
                number: mobile,
                seconds: 120,
                length: 6
            }
        }).then((res) => {
            res = res.result
            wx.hideLoading()
            if (res.code == "success") {
                _this.countdownFn()
                wx.showToast({
                    title: '发送成功!',
                    icon:"success"
                })
            }else{
                wx.showModal({
                    content: res.msg,
                    showCancel: false
                })
            }
            console.log(res.msg);
            }).catch((err) => {
                console.log('err', err)
                wx.hideLoading()
                wx.showModal({
                    content: '网络错误！',
                    showCancel: false
                })
            });
    },
    
    // 验证
    validateCodeFunc(type) {
        var _this = this;
        if(!type){
            wx.showLoading({
                title: '加载中',
                mask: true
            });
        }
        var mobile = this.data.mobile;
        var v_code = this.data.v_code;
        wx.cloud.callFunction({
            name: 'zhenzisms',
            data: {
                $url: 'validateCode',
                apiUrl: 'https://sms_developer.zhenzikj.com',
                number: mobile,
                code: v_code
            }
        }).then((res) => {
            res = res.result
            console.log(res)
            if (res.code == "success") {
                var data_info = {
                    code_mobile_creare_time: app.common.getNewTime(),
                    code_mobile: mobile,
                    isMember:1,
                    code_v_code: v_code,
                    type: 1,
                }
                wx.cloud.callFunction({
                    name: 'userinfo',
                    data: data_info
                }).then(async res2 => {
                    wx.hideLoading()
                    console.log('res2')
                    res2 = res2.result
                    if (res2.errMsg == "cloud.callFunction:ok"||res2.errMsg == "collection.update:ok") {
                        wx.showToast({
                            title: '注册成功!',
                            icon: "success"
                        })
                        setTimeout(res3=>{
                            wx.navigateBack({
                                complete: (res4) => {},
                            })
                        },600)
                    } else {
                        wx.showModal({
                            content: res2.errMsg,
                            showCancel: false
                        })
                    }
                })
            } else {
                wx.hideLoading()
                wx.showModal({
                    content: res.msg,
                    showCancel: false
                })
            }
        }).catch((e) => {
            wx.hideLoading()
            wx.showModal({
                content: '网络错误！',
                showCancel: false
            })
        });
    },
})