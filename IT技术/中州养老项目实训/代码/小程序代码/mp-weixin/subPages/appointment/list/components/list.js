"use strict";
const common_vendor = require("../../../../common/vendor.js");
const utils_index = require("../../../../utils/index.js");
const utils_commonData = require("../../../../utils/commonData.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_load_more + EmptyPage)();
}
const EmptyPage = () => "../../../../components/EmptyPage/index.js";
const _sfc_main = {
  __name: "list",
  props: {
    itemData: {
      type: Array,
      default: () => []
    },
    moreStatus: {
      type: String,
      default: "noMore"
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ["setTabIndex", "handleCancel", "onReachBottom"],
  setup(__props, { emit }) {
    const activeIndex = common_vendor.ref(0);
    const scrollinto = common_vendor.ref("tab0");
    const emptyInfo = common_vendor.ref("未找到相关任务");
    const contentText = common_vendor.ref({
      // 加载状态说明
      contentdown: "上拉加载更多",
      contentrefresh: "努力加载中...",
      contentnomore: "- 没有更多了 -"
    });
    const capsuleBottom = common_vendor.ref();
    common_vendor.onLoad(() => {
      common_vendor.index.getSystemInfo({
        success: () => {
          capsuleBottom.value = common_vendor.index.getMenuButtonBoundingClientRect().bottom + 12;
        }
      });
    });
    common_vendor.onShow(() => {
      activeIndex.value = 0;
    });
    const changeTab = (index2) => {
      if (activeIndex.value === index2) {
        return;
      }
      activeIndex.value = index2;
      emit("setTabIndex", index2);
    };
    function scrolltoupperHandle() {
      emit("setTabIndex", index);
    }
    const handleCancel = (id) => {
      emit("handleCancel", id);
    };
    common_vendor.onReachBottom(() => {
      emit("onReachBottom");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(utils_commonData.listTabData), (item, index2, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: index2,
            c: common_vendor.n(activeIndex.value === index2 ? "active" : ""),
            d: common_vendor.o(($event) => changeTab(index2), index2)
          };
        }),
        b: common_vendor.n(activeIndex.value === 1 ? "active" : ""),
        c: scrollinto.value,
        d: common_vendor.f(__props.itemData, (item, index2, i0) => {
          return common_vendor.e({
            a: common_vendor.t(common_vendor.unref(utils_index.getNow)(item.time)),
            b: common_vendor.t(item.type === 0 ? "参观预约" : "探访预约"),
            c: common_vendor.n(item.type === 0 ? "tagApp" : "tagLook"),
            d: common_vendor.t(item.mobile),
            e: common_vendor.t(common_vendor.unref(utils_index.getTime)(item.time)),
            f: item.status === 0
          }, item.status === 0 ? {} : {}, {
            g: item.status === 1
          }, item.status === 1 ? {} : {}, {
            h: item.status === 2
          }, item.status === 2 ? {} : {}, {
            i: item.status === 3
          }, item.status === 3 ? {} : {}, {
            j: item.name.length <= 8 || item.visitor.length <= 8
          }, item.name.length <= 8 || item.visitor.length <= 8 ? common_vendor.e({
            k: common_vendor.t(item.name),
            l: common_vendor.t(item.visitor),
            m: item.status === 0
          }, item.status === 0 ? {
            n: common_vendor.o(($event) => handleCancel(item.id), index2)
          } : {}) : {}, {
            o: item.name.length > 8 && item.visitor.length > 8
          }, item.name.length > 8 && item.visitor.length > 8 ? {
            p: common_vendor.t(item.name)
          } : {}, {
            q: item.name.length > 8 && item.visitor.length > 8
          }, item.name.length > 8 && item.visitor.length > 8 ? {
            r: common_vendor.t(item.visitor)
          } : {}, {
            s: index2
          });
        }),
        e: __props.itemData.length > 6
      }, __props.itemData.length > 6 ? {
        f: common_vendor.p({
          status: __props.moreStatus,
          ["content-text"]: contentText.value
        })
      } : {}, {
        g: common_vendor.o(scrolltoupperHandle),
        h: __props.itemData.length === 0 && __props.loading
      }, __props.itemData.length === 0 && __props.loading ? {
        i: common_vendor.p({
          emptyInfo: emptyInfo.value
        })
      } : {}, {
        j: capsuleBottom.value + "px"
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/subPages/appointment/list/components/list.vue"]]);
wx.createComponent(Component);
