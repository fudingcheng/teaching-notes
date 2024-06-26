"use strict";
const utils_request = require("../../utils/request.js");
const getServiceList = (params) => utils_request.request({
  url: "/orders/project/page",
  method: "get",
  params
});
const goodsDetail = (id) => utils_request.request({
  url: `/orders/project/${id}`,
  method: "get"
});
exports.getServiceList = getServiceList;
exports.goodsDetail = goodsDetail;
