// pages/main/main.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageShow:false,
        userInfo:{},
        mylistDatas: [
            {
                icon: 'icon-2',
                name: '我的订单',
                dian: false,
                type: "2-2",
            },
            {
                icon: 'icon-3',
                name: '我的收藏',
                dian: false,
                type: "2-3",
            },          
            {
                icon: 'icon-9',
                name: '个人信息',
                dian: false,
                type: "2-5",
            },
            {
                icon: 'icon-5',
                name: '版本信息',
                dian: false,
                type: "2-6",
            },{
                icon: 'icon-10',
                name: '管理图书',
                is:"管理员",
                dian: false,
                type: "2-7",
            },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
  async onLoad (options) {
        await app.getUserInfo().then(res => {
            console.log(app.globalData.userInfo)
            this.setData({
                userInfo: app.globalData.userInfo
            })
            if(!app.globalData.userInfo.isMember){
                wx.navigateTo({
                  url: '/pages/login/login',
                })
            }
        })
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    
    oepnPageTap(e){
        var item = e.currentTarget.dataset.item;
        if( item.type=='2-1' ){
            // 我的优惠券
            wx.navigateTo({
                url: '/coupons/mycoupon',
            });
            return;
        }
        if( item.type=='2-2' ){
            // 我的订单
            wx.navigateTo({
                url: '/order/list',
            });
            return;
        }
        if( item.type=='2-3' ){
            // 我的订单
            wx.navigateTo({
                url: '/pages/favorites/favorites',
            });
            return;
        }
        if( item.type=='2-4' ){
            // 常见问题
            wx.navigateTo({
                url: '/pages/question',
            });
            return;
        }
        if( item.type=='2-5'){
            wx.navigateTo({
                url: '/pages/myinfo/myinfo',
            });
            return;
        }
        if( item.type=='2-6'){
            wx.navigateTo({
                url: '/pages/myinfo',
            });
            return;
        }
        if( item.type=='2-7'){
            wx.navigateTo({
                url: '/pages/library/library',
            });
            return;
        }
        
    },
})