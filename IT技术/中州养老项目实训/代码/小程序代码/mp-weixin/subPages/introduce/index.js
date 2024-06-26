"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_NavBar = common_vendor.resolveComponent("NavBar");
  _component_NavBar();
}
if (!Math) {
  Phone();
}
const Phone = () => "../../components/uni-phone/index2.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const capsuleBottom = common_vendor.ref();
    const phone = common_vendor.ref(null);
    common_vendor.onLoad(() => {
      common_vendor.index.getSystemInfo({
        success: () => {
          capsuleBottom.value = common_vendor.index.getMenuButtonBoundingClientRect().bottom + 12;
        }
      });
    });
    const handlePhone = () => {
      phone.value.popup.open("center");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "养老院介绍",
          isShowBack: true,
          handleToLink: _ctx.handleToLink
        }),
        b: common_vendor.o(($event) => handlePhone()),
        c: capsuleBottom.value + "px",
        d: common_vendor.sr(phone, "bd219101-1", {
          "k": "phone"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bd219101"], ["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/subPages/introduce/index.vue"]]);
wx.createPage(MiniProgramPage);
