// pages/library/library.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageShow:true,
        headTableID:0,
        library:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    getDataproduct(){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        wx.cloud.callFunction({
            name: 'getdata',
            data: {
                action:"product",
                type:_this.data.classify[_this.data.classify_index].id
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            res.result = res.result.map((obj,i)=>{

                return obj
            })
            _this.setData({
                product:res.result,
                pageShow:true
            })
        })
    },
    headTableBtn(e){
        var id = e.currentTarget.dataset.id;
        this.setData({
            headTableID:id
        })
    }
})