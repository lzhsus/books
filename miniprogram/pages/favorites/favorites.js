// pages/favorites/favorites.js
const app = getApp()
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
            console.log('111',res.result)
            _this.setData({
                product:res.result.list,
                pageShow:true
            })
        })
    },// 收场
    likeBtn(e){
        var index = e.currentTarget.dataset.index;
        var product = this.data.product;
        var _this = this;
        wx.showModal({
        content: '是否确认取消收藏？',
            success (res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '加载中',
                        mask: true
                    });
                    var type = product[index].is_favorites?0:1;
                    wx.cloud.callFunction({
                        name: 'getdata',
                        data: {
                            action:"favorites",
                            productId:product[index].productId,
                            type:type
                        }
                    }).then(res=>{
                        wx.hideLoading()
                        res = res.result
                        product.splice(index,1);
                        wx.showToast({
                          title: '已取消收藏！',
                          icon:'none'
                        })
                        _this.setData({
                            product:product
                        })
                    })
                }
            }
        })
    },
    onShareAppMessage (res) {
        let obj = {};
        if( res.from==='button' ) {
            console.log(res.target.dataset)
            obj = {
                imageUrl: res.target.dataset.imageurl,
                path: '/pages/detail/detail?id='+res.target.dataset.id,
                title: res.target.dataset.name
            };
        }else{
            obj = {
                imageUrl: 'https://6465-demo-q7d1r-1302081669.tcb.qcloud.la/share-icon.png?sign=69f0b5905dd49eb0e051c8539e3f1dd9&t=1589206924',
                path: '/pages/index/index',
                title: '好读者',
            };
        }
        console.log('obj',obj)
        return obj
    }

})