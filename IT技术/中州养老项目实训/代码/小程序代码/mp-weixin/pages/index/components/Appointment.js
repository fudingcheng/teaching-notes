"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Math) {
  LookPopup();
}
const LookPopup = () => "../../../components/Binding/index.js";
const _sfc_main = {
  __name: "Appointment",
  setup(__props) {
    const store = common_vendor.useStore();
    const popupLook = common_vendor.ref(null);
    const isClick = common_vendor.ref(false);
    const typeVal = common_vendor.ref(null);
    common_vendor.ref([]);
    const token = common_vendor.ref(null);
    common_vendor.onShow(() => {
      token.value = common_vendor.index.getStorageSync("token");
    });
    const handleVisit = (type) => {
      typeVal.value = type;
      if (!isClick.value) {
        isClick.value = true;
        if (type === 0) {
          store.commit("user/setAppointmentType", 0);
          common_vendor.index.navigateTo({
            url: "/subPages/appointment/index"
          });
        } else {
          store.commit("user/setAppointmentType", 1);
        }
        const times = setTimeout(() => {
          isClick.value = false;
          clearTimeout(times);
        }, 3e3);
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => handleVisit(1)),
        b: common_vendor.o(($event) => handleVisit(0)),
        c: common_vendor.sr(popupLook, "358753f6-0", {
          "k": "popupLook"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/pages/index/components/Appointment.vue"]]);
wx.createComponent(Component);
