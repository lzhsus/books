// pages/search/search.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchValue:"",
        searchShow:1,
        searchHot:[],
        focus:true,
        product:[],
        end:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getSearchHot()
    },
    // 获取热搜关键词
    getSearchHot(){
        var _this = this;
        wx.cloud.callFunction({
            name: 'getdata',
            data:{
                action:"searchhot",
            }
        }).then(res=>{
            res = res.result
            _this.setData({
                searchHot:res.result
            })
        })
    },
    recordSearchTap(e){
        var content = e.currentTarget.dataset.content;
        this.setData({
            searchValue:content
        })
        this.onClickSearch()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    
    // 收藏 取消
    likeBtn(e){
        if(!app.globalData.userInfo.isMember){
            wx.navigateTo({
              url: '/pages/login/login',
            })
            return
        }
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
    },
    async onShow () {
        await app.getUserInfo().then(res => {
            console.log(app.globalData.userInfo)
            this.setData({
                userInfo: app.globalData.userInfo
            })
        })
    },
    onClickSearch(e){
        this.setData({
            end:false
        })
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        wx.cloud.callFunction({
            name: 'getdata',
            data:{
                action:"searchmore",
                value:_this.data.searchValue
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            _this.setData({
                product:res.result,
                end:true
            })
        })
    },
    change(e){
        console.log(e)
        this.setData({
            searchValue:e.detail
        })
    },
    search(e){
        console.log('search',e,this.searchValue)
    },
    cancel(e){
        console.log('cancel',e,this.searchValue)
    },
    bindfocus(){
        console.log('1')
        this.setData({
            searchShow:1,
            focus:true
        })
    },
    bindblur(){
        console.log('10')
        var _this = this
        setTimeout(res=>{
            _this.setData({
                focus:false,
                searchShow:2
            })
        },200)
    },
})