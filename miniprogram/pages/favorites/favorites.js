// pages/favorites/favorites.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageShow:false,
        favoritesProList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getFavorites()
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    getFavorites(){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        wx.cloud.callFunction({
            name: 'getdata',
            data: {
                action:"getfavorites"
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            res.result = res.result.map(obj=>{
                obj.is_favorites=1
                return
            })
            console.log('111',res.result)
            _this.setData({
                favoritesProList:res.result,
                pageShow:true
            })
        })
    }

})