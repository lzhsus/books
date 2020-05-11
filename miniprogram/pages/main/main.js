// pages/main/main.js
const app = getApp()
const QRCode = require('./services/weapp-qrcode')
var qrcode;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageShow:false,
        userInfo:{},
        erwmShow:"",
        mylistDatas: [
            {
                icon: 'icon-2',
                name: '我的借阅',
                dian: false,
                type: "2-2",
            },
            {
                icon: 'icon-3',
                name: '我的收藏',
                dian: false,
                type: "2-3",
            },          
            {
                icon: 'icon-9',
                name: '个人信息',
                dian: false,
                type: "2-5",
            },
            {
                icon: 'icon-5',
                name: '版本信息',
                dian: false,
                type: "2-6",
            },{
                icon: 'icon-10',
                name: '管理图书',
                is:"管理员",
                dian: false,
                type: "2-7",
            },
            {
                icon: 'icon-8',
                name: '探索更多',
                dian: false,
                type: "2-8",
            },
            {
                icon: 'icon-3',
                name: '我的电子卡',
                dian: false,
                type: "2-9",
            }
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
  async onLoad (options) {
    },


    /**
     * 生命周期函数--监听页面显示
     */
    async  onShow () {

        await app.getUserInfo().then(res => {
            console.log(app.globalData.userInfo)
            this.setData({
                userInfo: app.globalData.userInfo
            })
            if(!app.globalData.userInfo.isMember){
                wx.navigateTo({
                  url: '/pages/login/login',
                })
            }
        })
    },
    
    oepnPageTap(e){
        var item = e.currentTarget.dataset.item;
        if( item.type=='2-2' ){
            wx.navigateTo({
                url: '/pages/borrowlist/borrowlist',
            });
            return;
        }
        if( item.type=='2-3' ){
            wx.navigateTo({
                url: '/pages/favorites/favorites',
            });
            return;
        }
        if( item.type=='2-5'){
            wx.navigateTo({
                url: '/pages/myinfo/myinfo',
            });
            return;
        }
        if( item.type=='2-6'){
            wx.navigateTo({
                url: '/pages/version/version',
            });
            return;
        }
        if( item.type=='2-7'){
            wx.navigateTo({
                url: '/pages/library/library',
            });
            return;
        }
        if( item.type=='2-8'){
            wx.showToast({
              title: '敬请期待...',
              icon:"none"
            })
            return;
        }
        if( item.type=='2-9'){
            this.erwmTap()
            return;
        }
        
    },
    async erwmTap(){
        var _this =this
        var erwmShow = _this.data.erwmShow;

        erwmShow = !erwmShow; 
        if(erwmShow){
            if( !qrcode ){
                qrcode = new QRCode('canvas', {
                    text: _this.data.userInfo.isMember,
                    width: 250,
                    height: 250,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H,
                });
            }else{
                qrcode.makeCode(_this.data.userInfo.isMember);
            }
            _this.setData({
                erwmShow:erwmShow
            })
        }else{
            _this.setData({
                erwmShow:erwmShow
            })
        }
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