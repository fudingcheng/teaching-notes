"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_index = require("../../utils/index.js");
const pages_api_service = require("../../pages/api/service.js");
require("../../utils/request.js");
require("../../utils/env.js");
if (!Array) {
  const _component_NavBar = common_vendor.resolveComponent("NavBar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_net_fail = common_vendor.resolveComponent("net-fail");
  (_component_NavBar + _easycom_uni_icons2 + _component_net_fail)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + List + DeletePopup)();
}
const List = () => "./components/List.js";
const DeletePopup = () => "../../components/Operate/index.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const deleteRef = common_vendor.ref(null);
    const itemData = common_vendor.ref([]);
    const moreStatus = common_vendor.ref("more");
    const netStatus = common_vendor.ref(true);
    const isHistory = common_vendor.ref(false);
    const loading = common_vendor.ref(false);
    const searchData = common_vendor.ref({
      pageNum: 1,
      pageSize: 10,
      name: ""
    });
    const searchName = common_vendor.ref("");
    const pageNum = common_vendor.ref(1);
    const pages = common_vendor.ref(0);
    const showClearIcon = common_vendor.ref(false);
    const capsuleBottom = common_vendor.ref();
    const searchHistoryData = common_vendor.ref([]);
    const errorTipText = common_vendor.ref({
      title: "",
      text: "确定要全部清空吗？"
    });
    common_vendor.onLoad((option) => {
      common_vendor.index.getSystemInfo({
        success: () => {
          capsuleBottom.value = common_vendor.index.getMenuButtonBoundingClientRect().bottom + 10;
        }
      });
      if (option.name !== "undefined" && option.name !== "") {
        searchData.value.name = option.name;
        searchName.value = option.name;
        showClearIcon.value = true;
        getNewData();
      }
    });
    common_vendor.onShow(() => {
      searchHistoryData.value = common_vendor.index.getStorageSync("historyData").slice(0, 10);
    });
    const getNewData = async () => {
      const params = {
        ...searchData.value,
        name: searchName.value,
        page: pageNum.value
      };
      moreStatus.value = "loading";
      loading.value = false;
      await pages_api_service.getServiceList(params).then((res) => {
        if (res.code === 200) {
          const {
            data
          } = res;
          const items = data.records == null ? [] : data.records;
          moreStatus.value = items.length < 10 ? "no-more" : "more";
          searchData.value.page == 1 ? itemData.value = void 0 : null;
          itemData.value = [];
          itemData.value = itemData.value.length > 0 && itemData.value.length !== void 0 ? [...itemData.value, ...items] : items;
          let nameVal = searchName.value !== "" ? searchName.value : searchData.value.name;
          itemData.value.map((item, index) => {
            if (nameVal) {
              let replaceReg = new RegExp(nameVal, "ig");
              let replaceString = `<span style="color:#FE6A3D">${nameVal}</span>`;
              itemData.value[index].strName = item.name.replace(replaceReg, replaceString);
            }
          });
          pages.value = data.pages;
          if (data.pages === pageNum.value) {
            moreStatus.value = "noMore";
          }
          common_vendor.index.stopPullDownRefresh();
          netStatus.value = true;
          loading.value = true;
        }
      }).catch((err) => {
        common_vendor.index.showToast({
          title: err.msg,
          duration: 1e3,
          icon: "none"
        });
        netStatus.value = false;
      });
    };
    const handleBlur = (e) => {
      let text = e;
      const arr = [];
      if (text !== "") {
        text = utils_index.warnBlank(text).substring(0, 20);
        searchData.value.name = text;
        if (searchHistoryData.value.includes(text)) {
          const i = searchHistoryData.value.indexOf(text);
          searchHistoryData.value.splice(i, 1);
        }
        arr.unshift(text);
        searchHistoryData.value = [...arr, ...searchHistoryData.value];
        searchHistoryData.value = searchHistoryData.value.slice(0, 10);
        common_vendor.index.setStorageSync("historyData", searchHistoryData.value);
      }
    };
    const handleToRefresh = () => {
      searchData.value.pageNum = 1;
      getNewData();
    };
    const onReachBottom = () => {
      if (pageNum.value >= pages.value) {
        moreStatus.value = "noMore";
        return false;
      }
      moreStatus.value = "loading";
      const times = setTimeout(() => {
        pageNum.value++;
        getNewData();
        clearTimeout(times);
      }, 1e3);
    };
    const handleInput = (e) => {
      const regex = /\s+/g;
      let inputValue = "";
      itemData.value = [];
      isHistory.value = true;
      inputValue = e.detail.value.replace(regex, "");
      if (inputValue.length > 0) {
        showClearIcon.value = true;
        searchName.value = inputValue;
        getNewData();
      } else {
        isHistory.value = false;
        showClearIcon.value = false;
      }
    };
    const handleClear = () => {
      searchData.value.name = "";
      showClearIcon.value = false;
      isHistory.value = false;
      itemData.value = [];
    };
    const clearHistory = () => {
      deleteRef.value.popup.open();
    };
    const subDelete = async () => {
      if (searchHistoryData.value.length > 0) {
        common_vendor.index.removeStorage({
          key: "historyData"
        });
        searchHistoryData.value = [];
        deleteRef.value.popup.close();
      }
    };
    const handleList = (val) => {
      if (val === "cancel") {
        val = "";
        searchData.value.name = "";
      }
      if (searchData.value.name !== "") {
        val = searchData.value.name;
      }
      common_vendor.index.redirectTo({
        url: `/pages/service/index?name=${val}`
      });
    };
    const handleToLink = () => {
      common_vendor.index.redirectTo({
        url: `/pages/service/index`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "搜索",
          isShowBack: true,
          handleToLink
        }),
        b: netStatus.value
      }, netStatus.value ? common_vendor.e({
        c: common_vendor.p({
          type: "search",
          size: "18"
        }),
        d: common_vendor.o([($event) => searchData.value.name = $event.detail.value, handleInput]),
        e: searchData.value.name,
        f: showClearIcon.value
      }, showClearIcon.value ? {
        g: common_vendor.o(handleClear),
        h: common_vendor.p({
          type: "clear",
          size: "18"
        })
      } : {}, {
        i: common_vendor.o(($event) => handleList("cancel")),
        j: common_vendor.o(handleClear),
        k: common_vendor.o(onReachBottom),
        l: common_vendor.o(handleList),
        m: common_vendor.o(handleBlur),
        n: common_vendor.p({
          itemData: itemData.value,
          moreStatus: moreStatus.value,
          loading: loading.value,
          isHistory: isHistory.value
        }),
        o: itemData.value.length === 0 && searchHistoryData.value.length > 0 && !isHistory.value
      }, itemData.value.length === 0 && searchHistoryData.value.length > 0 && !isHistory.value ? {
        p: common_vendor.o(clearHistory),
        q: common_vendor.f(searchHistoryData.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.o(($event) => handleList(item), index)
          };
        })
      } : {}, {
        r: capsuleBottom.value + "px"
      }) : {
        s: common_vendor.p({
          handleToRefresh
        })
      }, {
        t: common_vendor.sr(deleteRef, "e87c614f-6", {
          "k": "deleteRef"
        }),
        v: common_vendor.o(subDelete),
        w: common_vendor.p({
          errorTipText: errorTipText.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e87c614f"], ["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/subPages/search/index.vue"]]);
wx.createPage(MiniProgramPage);
