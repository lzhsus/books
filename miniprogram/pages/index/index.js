//index.js
const app = getApp()

Page({
    data: {
        pageShow:false,
        userInfo: {},
        current: 0,
        product:[]
    },

    async onLoad () {
        this.getHotproduct()
    },
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
    // 获取热门
    getHotproduct(){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        wx.cloud.callFunction({
            name: 'getdata',
            data: {
                action:"hotproduct",
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            if( app.stopPullDownRefresh ) {
                wx.stopPullDownRefresh()
                app.stopPullDownRefresh = false
            }
            _this.setData({
                product:res.result,
                pageShow:true
            })
        })
    },
    goToSearch(){
        wx.navigateTo({
          url: '/pages/search/search',
        })
    },
    bindchange(e){
        this.setData({
            current:e.detail.current
        })
    },
    // 上拉监控
    onPullDownRefresh(){
        app.stopPullDownRefresh = true
        this.getHotproduct()
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