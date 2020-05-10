// pages/classify/classify.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageShow:false,
        classify:[],
        classify_index:0,
        product:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getDataClaCssify()
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
            res.result = res.result.map((obj,i)=>{
                obj.active=false
                if(_this.data.classify_index == i) obj.active=true
                return obj
            })
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
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    // 切换标题
    mainLeftIndex(e){
        var index = e.currentTarget.dataset.index;
        var classify = this.data.classify;
        classify = classify.map((e,i)=>{
            e.active = 0;
            if(i == index) e.active=1
            return e
        })
        this.setData({
            classify_index:index,
            classify:classify
        })
        this.getDataproduct()
    },
    // 收场
    likeBtn(e){
        var index = e.currentTarget.dataset.index;
        var product = this.data.product;
        
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        var type = product[index].is_favorites?0:1;
        wx.cloud.callFunction({
            name: 'getdata',
            data: {
                action:"favorites",
                productId:product[index]._id,
                type:type
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            product[index].is_favorites = type
            _this.setData({
                product:product
            })
        })
    }
})