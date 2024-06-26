"use strict";
const global = {
  // 注意：全局模块中不需要开启命名空间
  state: {
    footStatus: 0,
    // 公用footer的激活状态码
    router: null
    // 公用footer的激活状态码
  },
  mutations: {
    // 公用footer的激活码
    setFootStatus(state, provider) {
      state.footStatus = provider;
    },
    // 路由，方便登陆有进入不同的页面
    setRouter(state, provider) {
      state.router = provider;
    }
  },
  actions: {},
  getters: {}
};
exports.global = global;
