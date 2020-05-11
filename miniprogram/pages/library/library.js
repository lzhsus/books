// pages/library/library.js
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
            name: 'getdata',
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
    }
})