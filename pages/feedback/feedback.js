// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品/商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径 数组
    chooseImgs: [],
    // 文本域的内容
    textVal: ""
  },

  // 外网的图片的路径数组
  UpLoadImgs: [],

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const { index } = e.detail;
    // 修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 赋值到data中
    this.setData({
      tabs
    })
  },

  // 点击 + 选择图片
  handleChooseImg() {
    // 调用小程序内置的选择图片api
    wx.chooseImage({
      // 同时选中的图片数量
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        // console.log(result);
        this.setData({
          // 图片数组 进行拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    })
  },

  // 点击自定义图片组件
  handleRemoveImg(e) {
    // 获取被点击的组件索引
    const { index } = e.currentTarget.dataset;
    // 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({ chooseImgs })
  },

  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },

  // 提交按钮的点击
  handleFormSubmit() {
    // 获取文本域的内容
    const { textVal, chooseImgs } = this.data;
    // 合法性的验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    // 准备上传图片 到专门的图片服务器
    // 上传文件的 api不支持多个文件同时上传 遍历数组 逐个上传
    // 显示正在等待的图片
    wx.showLoading({
      title: '正在上传...',
      mask: true
    })

    // 判断有没有需要上传的图片数组
    if (chooseImgs.length != 0) {
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 图片要上传到哪儿
          // url: 'https://images.ac.cn/Home/Index/UploadAction/',
          url: 'https://imgchr.com/i/MjaXxU',
          // 被上传的文件路径
          filePath: v,
          // 上传的文件名称 后台来获取文件 file
          name: 'file',
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            console.log(result);
            // let url = JSON.parse(result.data).url;
            let url = result.cookies[0];
            console.log(url);
            this.UpLoadImgs.push(url);

            // 所有图片上传完毕才触发
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();
              console.log("把文本的内容和外网的图片数组提交到后台中");
              // 提交都成功后 重置页面
              this.setData({
                textVal: '',
                chooseImgs: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1,
              });
            }
          }
        })
      })
    } else {
      wx.hideLoading();
      console.log("只是提交了文本");
      wx.navigateBack({
        delta: 1,
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})