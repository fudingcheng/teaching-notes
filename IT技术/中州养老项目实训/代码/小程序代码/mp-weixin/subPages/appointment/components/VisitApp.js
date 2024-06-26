"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_index = require("../../../utils/index.js");
const _sfc_main = {
  __name: "VisitApp",
  props: {
    // 选择的时间
    nowDate: {
      type: String,
      default: ""
    }
  },
  emits: ["handleTime", "handleFamily"],
  setup(__props, { expose, emit }) {
    const store = common_vendor.useStore();
    const users = store.state.user;
    const appType = users.appointmentType;
    const formData = common_vendor.ref({});
    const handleTime = (val) => {
      emit("handleTime", val);
    };
    const handleFamily = (val) => {
      emit("handleFamily", val);
    };
    const handleBlur = (e) => {
      const text = utils_index.warnBlank(e.detail.value);
      formData.value.name = text.substring(0, 10);
    };
    const handleVisiBlur = (e) => {
      const text = utils_index.warnBlank(e.detail.value);
      formData.value.visitor = text.substring(0, 10);
    };
    expose({
      formData
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleBlur),
        b: formData.value.name,
        c: common_vendor.o(($event) => formData.value.name = $event.detail.value),
        d: formData.value.mobile,
        e: common_vendor.o(($event) => formData.value.mobile = $event.detail.value),
        f: common_vendor.unref(appType) === 0
      }, common_vendor.unref(appType) === 0 ? {
        g: common_vendor.o(handleVisiBlur),
        h: formData.value.visitor,
        i: common_vendor.o(($event) => formData.value.visitor = $event.detail.value)
      } : {
        j: common_vendor.t(formData.value.visitor),
        k: common_vendor.o(($event) => handleFamily("bottom"))
      }, {
        l: common_vendor.t(__props.nowDate),
        m: common_vendor.o(($event) => handleTime("bottom"))
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/subPages/appointment/components/VisitApp.vue"]]);
wx.createComponent(Component);
