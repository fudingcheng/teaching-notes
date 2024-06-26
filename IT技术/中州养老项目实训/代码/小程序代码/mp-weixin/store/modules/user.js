"use strict";
const common_vendor = require("../../common/vendor.js");
const user = {
  namespaced: true,
  // 开启命名空间
  state() {
    return {
      appointmentType: null,
      // 预约类型，方便从首页跳转的是参观预约（0）还是探访（1）
      appStatus: 0,
      // 预约的Table切换状态记录
      token: null,
      // token
      nickName: null,
      // 登录昵称
      orderStatus: null,
      // 订单当前选中状态
      goodsData: {},
      // 服务商品
      historyData: [],
      // 商品搜索历史数据
      isOrderType: false,
      // 订单是否提交成功
      backLink: ""
    };
  },
  mutations: {
    // 记录预约的类型
    setAppointmentType(state, provider) {
      state.appointmentType = provider;
    },
    // 记录商品id
    setGoodsData(state, provider) {
      state.goodsData = provider;
    },
    // 订单当前选中状态
    setOrderStatus(state, provider) {
      state.orderStatus = provider;
    },
    // 预约Table切换状态记录
    setAppStatus(state, provider) {
      state.appStatus = provider;
    },
    // 设置历史商品历史数据
    setHistoryData(state, provider) {
      state.historyData = provider;
    },
    // 设置token
    setToken(state, provider) {
      state.token = provider;
    },
    // // 设置昵称
    // setToken(state, provider) {
    //   state.nickName = provider
    // },
    // 订单是否提交成功
    setOrderType(state, provider) {
      state.isOrderType = provider;
    },
    setBackLike(state, provider) {
      state.backLink = provider;
    }
  },
  actions: {
    async loginOut() {
      common_vendor.index.clearStorageSync();
      this.token = null;
      this.nickName = null;
    }
  },
  getters: {}
};
exports.user = user;
