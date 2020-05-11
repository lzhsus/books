// pages/classify/classify.js
const app = getApp()
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
   async onShow () {
        await app.getUserInfo().then(res => {
            console.log(app.globalData.userInfo)
            this.setData({
                userInfo: app.globalData.userInfo
            })
        })
    },
    // 查看详情
    lookDetailBtn(e){
        var item = e.currentTarget.dataset.item;
        wx.navigateTo({
          url: '/pages/detail/detail?id='+item._id,
        })
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