"use strict";
const common_vendor = require("../common/vendor.js");
const store_modules_global = require("./modules/global.js");
const store_modules_user = require("./modules/user.js");
const store = common_vendor.createStore({
  // 全局模块
  ...store_modules_global.global,
  // 局部模块
  modules: {
    user: store_modules_user.user
  }
});
exports.store = store;
