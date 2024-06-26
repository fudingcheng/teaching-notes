"use strict";
const utils_request = require("../../utils/request.js");
const addReservation = (params) => utils_request.request({
  url: `/reservation`,
  method: "post",
  params
});
const getList = (params) => utils_request.request({
  url: "/reservation/page",
  method: "get",
  params
});
const cancelReservation = (id) => utils_request.request({
  url: `/reservation/${id}/cancel`,
  method: "put"
});
exports.addReservation = addReservation;
exports.cancelReservation = cancelReservation;
exports.getList = getList;
