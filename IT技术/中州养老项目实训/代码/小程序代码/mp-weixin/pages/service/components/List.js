"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_index = require("../../../utils/index.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_load_more + EmptyPage)();
}
const EmptyPage = () => "../../../components/EmptyPage/index.js";
const _sfc_main = {
  __name: "List",
  props: {
    // 列表数据
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
  emits: ["handleOpen", "onReachBottom"],
  setup(__props, { emit }) {
    const emptyInfo = common_vendor.ref("暂无相关内容哦～");
    const contentText = common_vendor.ref({
      // 加载状态说明
      contentdown: "上拉加载更多",
      contentrefresh: "努力加载中...",
      contentnomore: "- 没有更多了 -"
    });
    common_vendor.onReachBottom(() => {
      emit("onReachBottom");
    });
    const handleDetail = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/service/details?id=${id}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(__props.itemData, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.nursingRequirement),
            d: common_vendor.t(common_vendor.unref(utils_index.decimalsReplenish)(item.price)),
            e: common_vendor.t(item.unit),
            f: index,
            g: common_vendor.o(($event) => handleDetail(item.id), index)
          };
        }),
        b: __props.itemData.length > 6
      }, __props.itemData.length > 6 ? {
        c: common_vendor.p({
          status: __props.moreStatus,
          ["content-text"]: contentText.value
        })
      } : {}, {
        d: __props.itemData.length === 0 && __props.loading
      }, __props.itemData.length === 0 && __props.loading ? {
        e: common_vendor.p({
          emptyInfo: emptyInfo.value
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/pages/service/components/List.vue"]]);
wx.createComponent(Component);
