
// pages/checkin/checkin.js
Page({
  data: {
    // 用户信息
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    
    // 签到相关数据
    points: 0,          // 用户当前积分
    checkedIn: false,   // 今日是否已签到
    checkinDays: 0,     // 连续签到天数
    todayPoints: 0,     // 今日签到可获得积分
    
    // 签到日历数据
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    checkinDates: []    // 已签到的日期数组
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
    
    // 初始化数据
    this.initCheckinData();
  },
  
  onShow() {
    // 每次页面显示时检查今日是否已签到
    this.checkTodayCheckin();
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
        // 保存用户信息
        wx.setStorageSync('userInfo', res.userInfo);
      }
    });
  },
  
  // 初始化签到数据
  initCheckinData() {
    // 从本地存储获取数据
    const points = wx.getStorageSync('points') || 0;
    const checkinDays = wx.getStorageSync('checkinDays') || 0;
    const checkinDates = wx.getStorageSync('checkinDates') || [];
    const userInfo = wx.getStorageSync('userInfo') || {};
    
    // 计算今日签到可获得的积分（连续签到越多，积分越多）
    const todayPoints = Math.min(10 + checkinDays, 30); // 基础10分，每天+1，上限30分
    
    this.setData({
      points,
      checkinDays,
      checkinDates,
      todayPoints,
      userInfo,
      hasUserInfo: Object.keys(userInfo).length > 0
    });
    
    // 检查今日是否已签到
    this.checkTodayCheckin();
  },
  
  // 检查今日是否已签到
  checkTodayCheckin() {
    const today = this.formatDate(new Date());
    const checkedIn = this.data.checkinDates.includes(today);
    
    this.setData({
      checkedIn
    });
  },
  
  // 执行签到
  doCheckin() {
    if (this.data.checkedIn) {
      wx.showToast({
        title: '今日已签到',
        icon: 'none'
      });
      return;
    }
    
    // 获取今日日期
    const today = this.formatDate(new Date());
    
    // 检查是否连续签到
    const yesterday = this.formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const isConsecutive = this.data.checkinDates.includes(yesterday);
    
    // 更新签到数据
    const checkinDays = isConsecutive ? this.data.checkinDays + 1 : 1;
    const points = this.data.points + this.data.todayPoints;
    const checkinDates = [...this.data.checkinDates, today];
    
    // 更新数据
    this.setData({
      checkedIn: true,
      checkinDays,
      points,
      checkinDates
    });
    
    // 保存到本地存储
    wx.setStorageSync('checkinDays', checkinDays);
    wx.setStorageSync('points', points);
    wx.setStorageSync('checkinDates', checkinDates);
    
    // 显示签到成功提示
    wx.showToast({
      title: `签到成功，获得${this.data.todayPoints}积分！`,
      icon: 'success'
    });
  },
  
  // 格式化日期为 YYYY-MM-DD 格式
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
})