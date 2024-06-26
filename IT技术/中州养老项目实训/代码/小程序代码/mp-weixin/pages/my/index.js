"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_UniFooter = common_vendor.resolveComponent("UniFooter");
  _component_UniFooter();
}
if (!Math) {
  (FastMenu + MyMenu + DeletePopup)();
}
const FastMenu = () => "./components/FastMenu.js";
const MyMenu = () => "./components/MyMenu.js";
const DeletePopup = () => "../../components/Operate/index.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const store = common_vendor.useStore();
    const operate = common_vendor.ref(null);
    const nickName = common_vendor.ref(null);
    const token = common_vendor.ref(null);
    const errorTipText = common_vendor.ref({
      text: "您真的要退出登录吗？"
    });
    const capsuleBottom = common_vendor.ref();
    common_vendor.onShow(() => {
      nickName.value = common_vendor.index.getStorageSync("nickName");
      token.value = common_vendor.index.getStorageSync("token");
    });
    common_vendor.onLoad(() => {
      common_vendor.index.getSystemInfo({
        success: () => {
          capsuleBottom.value = common_vendor.index.getMenuButtonBoundingClientRect().bottom + 12;
        }
      });
    });
    const subUnbind = () => {
      store.dispatch("user/loginOut");
      operate.value.popup.close();
      nickName.value = null;
      token.value = null;
    };
    const handleApp = () => {
      common_vendor.index.navigateTo({
        url: "/subPages/appointment/list/index"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleApp),
        b: capsuleBottom.value + "px",
        c: common_vendor.sr(operate, "f97bc692-2", {
          "k": "operate"
        }),
        d: common_vendor.o(subUnbind),
        e: common_vendor.p({
          errorTipText: errorTipText.value
        }),
        f: common_vendor.p({
          pagePath: "pages/my/index"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f97bc692"], ["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/pages/my/index.vue"]]);
wx.createPage(MiniProgramPage);
