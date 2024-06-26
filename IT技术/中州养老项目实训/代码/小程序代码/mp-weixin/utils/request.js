"use strict";
const common_vendor = require("../common/vendor.js");
const utils_env = require("./env.js");
function request({
  url = "",
  params = {},
  method = "GET"
}) {
  const token = common_vendor.index.getStorageSync("token");
  let header = {
    // 'Accept': 'application/json',
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json;charset=UTF-8",
    "authorization": token
  };
  const requestRes = new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: utils_env.baseUrl + url + "?userId=1",
      data: params,
      header,
      method,
      success: (res) => {
        const {
          data
        } = res;
        if (data.code == 0 || data.code == 200) {
          resolve(res.data);
        } else {
          resolve(res.data);
          handleError(res, resolve);
        }
      },
      fail: (err) => {
        const error = {
          data: {
            msg: err.data
          }
        };
        reject(error);
      }
    });
  });
  const handleError = (error, resolve, url2) => {
    var errorCode = error.data.code;
    if (errorCode == 401) {
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.removeStorageSync("nickName");
    } else if (errorCode == 500) {
      if (common_vendor.index.getStorageSync("token") == "")
        ;
    } else {
      resolve(error);
    }
  };
  return requestRes;
}
exports.request = request;
