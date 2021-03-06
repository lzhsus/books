// pages/library/library.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageShow:false,
        headTableID:0,
        product:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getBorrowList()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    getBorrowList(){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        wx.cloud.callFunction({
            name: 'getdata',
            data: {
                action:"BorrowList",
                type:_this.data.headTableID
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
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
        this.getBorrowList()
    },
    changeStatus(e){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        console.log(e)
        const index = e.currentTarget.dataset.index;
        var status = this.data.product[index].status;
        var item = this.data.product[index]
        status = status?0:1;
        var _this = this
        wx.cloud.callFunction({
            name: 'admin',
            data: {
                action:"updata",
                status:status,
                id:item._id,
                type:1
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            wx.showToast({
              title: '更新成功',
              icon:'none'
            })
            if(_this.data.headTableID==0||_this.data.headTableID==3){
            }else{
                var product=_this.data.product;
                product.splice(index,1);
                _this.setData({
                    product:product
                })
            }
        })
    },
    changeHot(e){console.log(e)
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        const index = e.currentTarget.dataset.index;
        var hot = this.data.product[index].hot;
        var item = this.data.product[index]
        hot = hot?0:1;
        var _this = this
        wx.cloud.callFunction({
            name: 'admin',
            data: {
                action:"updata",
                hot:hot,
                id:item._id,
                type:2
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            wx.showToast({
              title: '更新成功',
              icon:'none'
            })
            if(_this.data.headTableID<3){
            }else{
                var product=_this.data.product;
                product.splice(index,1);
                _this.setData({
                    product:product
                })
            }
        })
    }
})