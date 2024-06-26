"use strict";
const isPhone = (value) => {
  const reg = /^[1][3-9][0-9]{9}$/;
  if (!reg.test(value)) {
    return false;
  } else {
    return true;
  }
};
exports.isPhone = isPhone;
