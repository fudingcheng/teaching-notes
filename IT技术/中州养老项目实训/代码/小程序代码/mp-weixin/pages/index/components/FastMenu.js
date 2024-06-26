"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "FastMenu",
  emits: ["isToken"],
  setup(__props, { emit }) {
    const store = common_vendor.useStore();
    const handleIntro = () => {
      store.commit("setRouter", "pages/index/index");
      store.commit("setFootStatus", 0);
      store.commit("user/setBackLike", "home");
      common_vendor.index.navigateTo({
        url: "/subPages/introduce/index"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleIntro)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/pages/index/components/FastMenu.vue"]]);
wx.createComponent(Component);
