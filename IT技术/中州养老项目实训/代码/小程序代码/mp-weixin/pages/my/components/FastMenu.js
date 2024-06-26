"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "FastMenu",
  emits: ["handleOrder"],
  setup(__props, { emit }) {
    const handleOrder = (val) => {
      emit("handleOrder", val);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => handleOrder(0)),
        b: common_vendor.o(($event) => handleOrder(1)),
        c: common_vendor.o(($event) => handleOrder(2)),
        d: common_vendor.o(($event) => handleOrder(3))
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/pages/my/components/FastMenu.vue"]]);
wx.createComponent(Component);
