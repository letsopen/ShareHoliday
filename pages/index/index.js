
// index.js
Page({
  data: {
    // 用户信息
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    
    // 用户积分
    points: 0
  },
  
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
    
    // 获取本地存储的用户信息
    const userInfo = wx.getStorageSync('userInfo') || {};
    if (Object.keys(userInfo).length > 0) {
      this.setData({
        userInfo,
        hasUserInfo: true
      });
    }
  },
  
  onShow() {
    // 每次页面显示时更新积分信息
    const points = wx.getStorageSync('points') || 0;
    this.setData({ points });
  },
  
  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        // 保存用户信息到本地存储
        wx.setStorageSync('userInfo', res.userInfo);
      }
    });
  },
  
  // 导航到签到页面
  navigateToCheckin() {
    wx.navigateTo({
      url: '/pages/checkin/checkin'
    });
  }
})