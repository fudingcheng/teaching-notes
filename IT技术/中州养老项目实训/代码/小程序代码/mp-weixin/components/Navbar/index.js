"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "index",
  props: {
    title: {
      type: String,
      default: ""
    },
    handleToLink: {
      // 用于自定义跳转
      type: Function
    },
    src: {
      type: String,
      default: "../../static/arrows.png"
    },
    isShowBack: {
      type: Boolean
    },
    // 是否显示搜索
    isShowSearch: {
      type: Boolean
    },
    params: {
      type: Object,
      default: () => ({})
    }
  },
  setup(__props) {
    const props = __props;
    const deviceNavHeight = common_vendor.ref();
    const capsuleTop = common_vendor.ref();
    const capsuleBottom = common_vendor.ref();
    const all = common_vendor.ref();
    const searchVal = common_vendor.ref(props.name);
    const capsuleHeight = common_vendor.ref();
    common_vendor.onLoad(() => {
      common_vendor.index.getSystemInfo({
        success: (res) => {
          deviceNavHeight.value = res.statusBarHeight;
          capsuleTop.value = common_vendor.index.getMenuButtonBoundingClientRect().top;
          capsuleBottom.value = common_vendor.index.getMenuButtonBoundingClientRect().bottom - 8;
          all.value = `${capsuleTop.value + capsuleBottom.value - deviceNavHeight.value + 14}px`;
          capsuleHeight.value = common_vendor.index.getMenuButtonBoundingClientRect().height;
        }
      });
    });
    common_vendor.onShow(() => {
      if (props.params !== void 0) {
        searchVal.value = props.params.name;
      }
    });
    const handleSearch = () => {
      common_vendor.index.redirectTo({
        url: `/subPages/search/index?name=${searchVal.value}`
      });
    };
    const handleTo = () => {
      if (props.handleToLink) {
        props.handleToLink();
      } else {
        common_vendor.index.navigateBack();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.title),
        b: __props.isShowBack
      }, __props.isShowBack ? {
        c: __props.src,
        d: common_vendor.o(handleTo)
      } : {}, {
        e: __props.isShowSearch
      }, __props.isShowSearch ? {
        f: common_vendor.p({
          type: "search",
          size: "18",
          color: "#999"
        }),
        g: common_vendor.o(handleSearch),
        h: common_vendor.o(handleSearch),
        i: searchVal.value,
        j: common_vendor.o(($event) => searchVal.value = $event.detail.value)
      } : {}, {
        k: capsuleTop.value + "px",
        l: capsuleBottom.value + "px",
        m: capsuleHeight.value + "px",
        n: all.value
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4fdf528"], ["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/components/Navbar/index.vue"]]);
wx.createComponent(Component);
