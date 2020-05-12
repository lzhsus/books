// pages/updata/updata.js


const app = getApp()
const db = wx.cloud.database()
const _ = db.command
import {
    setImgLink,
    uploadFiles
} from './services/uploadFile.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tempFilePaths:[],
        name:"",
        sex:{},
        sexArray: [            
            {
                id: 0,
                name: '女',
            },
            {
                id: 1,
                name: '男',
            },
        ],
        book:"",
        House:'',
        time:'',
        classify:[],
        class:"",
        class_type:'',
        number:100,
        desc:'',
        info:{},
        class_id:'',
        class_name:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getDataClaCssify()
    },
    
    getDataClaCssify(bol){
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
        })
    },
    onChangeName(event) {
        this.setData({
            name:event.detail
        })
      },
      onChangeBookeName(event) {
        this.setData({
            book:event.detail
        })
      },
      onChangeHouse(event) {
        this.setData({
            House:event.detail
        })
      },
      onChangedesc(event){
        this.setData({
            desc:event.detail
        })
      },
      onChangeNum(event){
        this.setData({
            number:event.detail
        })
      },
        // 性别选择
        bindPickerSexChange(e){
            let index = e.detail.value
            console.log(e,index)
            this.setData({
                sex:this.data.sexArray[index]
            })
        },
        bindPickerClassChange(e){
            let index = e.detail.value
            console.log(e,index)
            this.setData({
                class:this.data.classify[index].name,
                class_type:this.data.classify[index].id
            })
        },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
   async sumbitBtn(){
        var name = this.data.name
        if(!name){
            wx.showToast({
              title: '请输入作者姓名',
              icon:'none'
            })
            return
        }
        var sex = this.data.sex.name
        if(!sex){
            wx.showToast({
              title: '请选择作者性别',
              icon:'none'
            })
            return
        }
        var book = this.data.book
        if(!book){
            wx.showToast({
              title: '请输入图书名称',
              icon:'none'
            })
            return
        }
        var House = this.data.House
        if(!House){
            wx.showToast({
              title: '请输入发版社',
              icon:'none'
            })
            return
        }
        var time = this.data.time
        if(!time){
            wx.showToast({
              title: '请选择发版时间',
              icon:'none'
            })
            return
        }
        var classly = this.data.class
        if(!classly){
            wx.showToast({
              title: '请选择所属类别',
              icon:'none'
            })
            return
        }
        var number = this.data.number
        if(number<=0){
            wx.showToast({
              title: '上架数量不可为小于0',
              icon:'none'
            })
            return
        }
        var desc = this.data.desc
        if(!desc){
            wx.showToast({
              title: '请输入描述信息',
              icon:'none'
            })
            return
        }


        var info={
            author:{
                gender:sex,
                name:name
            },
            desc:desc,
            inventory:number,
            title:book,
            publishing_house:House,
            publishing_time:time,
            type_config:classly,
            type:parseInt(this.data.class_type||1)
        }
        var that = this;
        wx.showLoading({
            title: '上传中...',
        })
        var f = [this.data.file[0].url]
        // 上传资源(图片，文件名称)
        var images = await uploadFiles(f, 'product').then(res=>{
            
            info.url =res[0].fileID
            info.action = "addproduct"
            wx.cloud.callFunction({
                name: 'getdata',
                data: info,
            }).then(res=>{
                wx.hideLoading()
                res = res.result
                wx.showToast({
                  title: '提交成功',
                })
            })
        })
        

    },
    afterRead(event) {
      const { file } = event.detail;
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        var fileobj= [{
            url:file.path,
            size:file.size
        }]
        console.log(file)
        this.setData({
            file:fileobj
        })
    },
    onChangeClassName(event){
        
        this.setData({
            class_name:event.detail
        })
    },
    onChangeClassId(event){
        
        this.setData({
            class_id:event.detail
        })
    },
    classBtn(){
        if(!this.data.class_id||!this.data.class_name){
            
            wx.showToast({
                title: '所属类别，id不可为空',
                icon:'none'
              })
              return
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var _this = this;
        wx.cloud.callFunction({
            name: 'getdata',
            data: {
                action:'addclass',
                id:this.data.class_id,
                name:this.data.class_name
            },
        }).then(res=>{
            wx.hideLoading()
            res = res.result
            _this.getDataClaCssify()
            wx.showToast({
              title: '提交成功',
            })
        })
    },
    // 选择图片
    chooseImage() {
        var _this = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                // tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = {
                    url:res.tempFilePaths[0]
                }
                console.log(tempFilePaths)

                _this.setData({
                    tempFilePaths:tempFilePaths
                })
            }
        })
    },
})