// pages/myinfo/myinfo.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageShow:false,
        user:{},
        sexArray: [            
            {
                id: 0,
                name: '女',
            },
            {
                id: 1,
                name: '男',
            },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPersonalInfo()
    },
    // 获取个人信息
    getPersonalInfo(){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        wx.cloud.callFunction({
            name: 'getdata',
            data:{
                action:"personal",
                look:true
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            
            _this.setData({
                user:res.result,
                pageShow:true
            })
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    // 用户名
    bindKeyInput(e){
        var key = e.currentTarget.dataset.name
        var user = this.data.user;
        user[key] = e.detail.value
        this.setData({
            user:user
        })
    },
    bindPickerSexChange(e){
        let index = e.detail.value
        var user = this.data.user;
        user['sex'] = this.data.sexArray[index];
        this.setData({
            user:user
        })
    },
    bindBirthdayDateChange(e){
        var user = this.data.user;
        user['birthday'] = e.detail.value;
        this.setData({
            user:user
        })
    },
    
    bindRegionChange(e){
        var user = this.data.user;
        user['city'] = e.detail.value;
        this.setData({
            user:user
        })
    },
    submitTap(){
        console.log(this.data.user)
        var user = this.data.user;
        if( !user.name ){
            wx.showToast({
                title: '请输入姓名',
                icon: 'none',
            });
            return;
        }
        if( !user.mobile ){
            wx.showToast({
                title: '请输入手机号码',
                icon: 'none',
            });
            return;
        }
        if( !user.sex ){
            wx.showToast({
                title: '请选择性别',
                icon: 'none',
            });
            return;
        }
        if( !user.birthday ){
            wx.showToast({
                title: '请选择出生日期',
                icon: 'none',
            });
            return;
        }
        if( !user.email ){
            wx.showToast({
                title: '请输入邮箱',
                icon: 'none',
            });
            return;
        }
        if( !user.grade ){
            wx.showToast({
                title: '请输入年级',
                icon: 'none',
            });
            return;
        }
        if( !user.class ){
            wx.showToast({
                title: '请输入班级',
                icon: 'none',
            });
            return;
        }
        if( user.city.length<=0 ){
            wx.showToast({
                title: '请选择城市',
                icon: 'none',
            });
            return;
        }
        if( !user.address ){
            wx.showToast({
                title: '请输入详细地址',
                icon: 'none',
            });
            return;
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        wx.cloud.callFunction({
            name: 'getdata',
            data:Object.assign(user,{
                action:"personal",
            })
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            
            wx.showToast({
              title: '提交成功！',
            })
        })
    }
    
})