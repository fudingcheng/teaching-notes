"use strict";
const utils_request = require("../../utils/request.js");
const getHotHoust = (params) => utils_request.request({
  url: "/roomTypes",
  method: "get",
  params
});
exports.getHotHoust = getHotHoust;
