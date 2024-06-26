"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = {
  __name: "CancelPopup",
  props: {
    // 选择的时间
    errorTipText: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["subCancel"],
  setup(__props, { expose, emit }) {
    const popup = common_vendor.ref(null);
    const handleClose = () => {
      popup.value.close();
    };
    const subCancel = () => {
      emit("subCancel");
      handleClose();
    };
    expose({
      popup
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(__props.errorTipText.title),
        b: common_vendor.t(__props.errorTipText.text),
        c: common_vendor.o(handleClose),
        d: common_vendor.o(subCancel),
        e: _ctx.type === "left" || _ctx.type === "right" ? 1 : "",
        f: common_vendor.sr(popup, "1c7beb52-0", {
          "k": "popup"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/subPages/appointment/list/components/CancelPopup.vue"]]);
wx.createComponent(Component);
