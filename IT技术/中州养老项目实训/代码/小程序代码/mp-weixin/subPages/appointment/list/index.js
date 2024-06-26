"use strict";
const common_vendor = require("../../../common/vendor.js");
const pages_api_appointment = require("../../../pages/api/appointment.js");
require("../../../utils/request.js");
require("../../../utils/env.js");
if (!Array) {
  const _component_NavBar = common_vendor.resolveComponent("NavBar");
  const _component_net_fail = common_vendor.resolveComponent("net-fail");
  (_component_NavBar + _component_net_fail)();
}
if (!Math) {
  (List + CancelPopup)();
}
const CancelPopup = () => "./components/CancelPopup.js";
const List = () => "./components/list.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const store = common_vendor.useStore();
    const users = store.state.user;
    const cancel = common_vendor.ref(null);
    const itemData = common_vendor.ref([]);
    const moreStatus = common_vendor.ref("more");
    const netStatus = common_vendor.ref(true);
    const loading = common_vendor.ref(false);
    const reservationId = common_vendor.ref();
    const errorTipText = common_vendor.ref({
      title: "取消预约",
      text: ""
    });
    let params = common_vendor.reactive({
      pageNum: 1,
      pageSize: 10,
      status: ""
    });
    const pageNum = common_vendor.ref(1);
    const pages = common_vendor.ref(0);
    const isSendRequest = common_vendor.ref(false);
    common_vendor.onMounted(() => {
      getNewData();
    });
    const getNewData = async () => {
      params = {
        pageSize: params.pageSize,
        pageNum: pageNum.value,
        status: params.status
      };
      if (isSendRequest.value) {
        return;
      }
      moreStatus.value = "loading";
      loading.value = false;
      await pages_api_appointment.getList(params).then((res) => {
        if (res.code === 200) {
          const {
            data
          } = res;
          const items = data.records == null ? [] : data.records;
          moreStatus.value = items.length < 10 ? "no-more" : "more";
          params.pageNum == 1 ? itemData.value = void 0 : null;
          itemData.value = itemData.value ? [...itemData.value, ...items] : items;
          pages.value = data.pages;
          if (data.pages === pageNum.value) {
            isSendRequest.value = true;
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
    const subCancel = async () => {
      isSendRequest.value = false;
      await pages_api_appointment.cancelReservation(reservationId.value).then((res) => {
        if (res.code === 200) {
          getNewData();
          common_vendor.index.showToast({
            title: "取消成功",
            duration: 1e3,
            icon: "none"
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    };
    const setTabIndex = (index) => {
      const tab = users.appStatus;
      store.commit("user/setAppStatus", index);
      pageNum.value = tab === index ? pageNum.value + 1 : 1;
      if (index === 1) {
        params.status = 0;
      } else {
        params.status = "";
      }
      isSendRequest.value = false;
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
    const handleCancel = (id) => {
      reservationId.value = id;
      cancel.value.popup.open();
    };
    const handleToLink = () => {
      if (users.appointmentType !== null) {
        store.commit("setFootStatus", 0);
        store.commit("user/setAppointmentType", null);
      } else {
        store.commit("setFootStatus", 3);
      }
      common_vendor.index.navigateBack({
        delta: 2
      });
    };
    const handleToRefresh = () => {
      params.value.pageNum = 1;
      getNewData();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "我的预约",
          isShowBack: true,
          handleToLink
        }),
        b: netStatus.value
      }, netStatus.value ? {
        c: common_vendor.o(setTabIndex),
        d: common_vendor.o(handleCancel),
        e: common_vendor.o(onReachBottom),
        f: common_vendor.p({
          itemData: itemData.value,
          moreStatus: moreStatus.value,
          loading: loading.value
        })
      } : {
        g: common_vendor.p({
          handleToRefresh
        })
      }, {
        h: common_vendor.sr(cancel, "99bb77d9-3", {
          "k": "cancel"
        }),
        i: common_vendor.o(subCancel),
        j: common_vendor.p({
          errorTipText: errorTipText.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-99bb77d9"], ["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/subPages/appointment/list/index.vue"]]);
wx.createPage(MiniProgramPage);
