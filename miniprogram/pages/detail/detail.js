// pages/detail/detail.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageShow:false,
        id:'',
        detail:{},
        product:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id:options.id
        })
        this.getDetail()
        this.getDataproduct()
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
    getDetail(){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this =this
        wx.cloud.callFunction({
            name: 'getdata',
            data: {
                action:"detail",
                id:_this.data.id
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            _this.setData({
                pageShow:true,
                detail:res.result
            })
        })
    },
    // 获取相关商品
    getDataproduct(){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        wx.cloud.callFunction({
            name: 'getdata',
            data: {
                action:"randomProduct",
                size:3
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            res.result = res.result.map((obj,i)=>{

                return obj
            })
            _this.setData({
                product:res.result
            })
        })
    },
    // 立即借阅
    submitBorrowBtn(){
        if(!app.globalData.userInfo.isMember){
            wx.navigateTo({
              url: '/pages/login/login',
            })
            return
        }
        var detail = this.data.detail
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        var type = detail.is_favorites?0:1;
        wx.cloud.callFunction({
            name: 'getdata',
            data: {
                action:"borrow",
                productId:detail._id,
                status:1,//借阅中  2  已归还  3 取消借阅
                author:detail.author,
                desc:detail.desc,
                title:detail.title,
                type_config:detail.type_config,
                publishing_house:detail.publishing_house,
                publishing_time:detail.publishing_time,
                url:detail.url,
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            if(res.success){
                wx.showModal({
                    content: "借阅成功，是否立即查看？",
                    success:res=>{
                        if (res.confirm) {
                            wx.navigateTo({
                              url: "/pages/borrowlist/borrowlist",
                            })
                        }
                    }
				})
            }else{
				wx.showModal({
					content: res.msg,
					showCancel: false,
				})
            }
        })
        
    },
    // 查看我的订阅
    lookBorrowBtn(){
        if(!app.globalData.userInfo.isMember){
            wx.navigateTo({
              url: '/pages/login/login',
            })
            return
        }
        wx.navigateTo({
          url: "/pages/borrowlist/borrowlist",
        })
    },
    // 收藏 取消
    likeBtn(e){
        if(!app.globalData.userInfo.isMember){
            wx.navigateTo({
              url: '/pages/login/login',
            })
            return
        }
        var detail = this.data.detail
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        var type = detail.is_favorites?0:1;
        wx.cloud.callFunction({
            name: 'getdata',
            data: {
                action:"favorites",
                productId:detail._id,
                type:type
            }
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            detail.is_favorites = type
            _this.setData({
                detail:detail
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