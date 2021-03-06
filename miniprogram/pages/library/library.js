// pages/library/library.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageShow:false,
        headTableID:0,
        classify:[],
        product:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getDataClaCssify()
        
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    getDataClaCssify(){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        wx.cloud.callFunction({
            name: 'getdata',
            data: {
                action:"classify"
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            _this.setData({
                classify:res.result
            })
            _this.getDataproduct()
        })
    },
    getDataproduct(){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        wx.cloud.callFunction({
            name: 'admin',
            data: {
                action:"administrator",
                type:_this.data.headTableID
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            res.result = res.result.map((obj,i)=>{
                _this.data.classify.forEach(item=>{
                    if(obj.type == item.id){
                        obj.type_config = item.name
                    }
                })
                return obj
            })
            console.log(res.result)
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
        this.getDataproduct()
    },
    look(){
        wx.navigateTo({
          url: '/pages/updata/updata',
        })
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
    },
    lookadd(){
        wx.navigateTo({
          url: '/pages/updata/updata',
        })
    }
})