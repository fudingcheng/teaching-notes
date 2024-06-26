"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = {
  __name: "index",
  props: {
    allElderData: {
      type: Array,
      default: () => []
    },
    // 表单基本信息
    formData: {
      type: Object,
      default: () => ({})
    },
    serviceVal: {
      type: String,
      default: ""
    }
  },
  emits: ["bindFamily"],
  setup(__props, { expose, emit }) {
    const props = __props;
    const popup = common_vendor.ref(null);
    const value = common_vendor.ref([0]);
    const visible = true;
    const indicatorStyle = `height: 50px`;
    const selectItem = common_vendor.ref({});
    common_vendor.watch(props, (newValue) => {
      common_vendor.nextTick$1(() => {
        newValue.allElderData.forEach((ele, i) => {
          if (ele.elderId === newValue.formData.elderId) {
            value.value = [i];
          }
        });
      });
    });
    const bindChange = (e) => {
      selectItem.value = props.allElderData[e.detail.value[0]];
    };
    const onSubmit = (e, val) => {
      console.log(val);
      if (selectItem.value.id === void 0 && selectItem.value.elderVo && selectItem.value.elderVo.elderId === -1 || selectItem.value.id === void 0) {
        selectItem.value = props.allElderData[0];
      }
      value.value = e.detail.value;
      emit("bindFamily", selectItem.value);
      popup.value.close();
    };
    const handleClose = () => {
      value.value = [];
      popup.value.close();
    };
    expose({
      popup
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleClose),
        b: visible
      }, {
        c: common_vendor.f(__props.allElderData, (item, index, i0) => {
          return {
            a: common_vendor.t(item.elderVo.name),
            b: index,
            c: common_vendor.o(($event) => onSubmit($event, item), index)
          };
        }),
        d: indicatorStyle,
        e: value.value,
        f: common_vendor.o(bindChange)
      }, {
        g: _ctx.type === "left" || _ctx.type === "right" ? 1 : "",
        h: common_vendor.sr(popup, "61cfdd26-0", {
          "k": "popup"
        }),
        i: common_vendor.o(_ctx.change)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/components/FamilyView/index.vue"]]);
wx.createComponent(Component);
