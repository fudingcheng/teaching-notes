"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_index = require("../../utils/index.js");
const pages_api_service = require("../api/service.js");
require("../../utils/request.js");
require("../../utils/env.js");
if (!Array) {
  const _component_NavBar = common_vendor.resolveComponent("NavBar");
  const _component_net_fail = common_vendor.resolveComponent("net-fail");
  (_component_NavBar + _component_net_fail)();
}
if (!Math) {
  (PickerView + FamilyView + LookPopup)();
}
const LookPopup = () => "../../components/Binding/index.js";
const FamilyView = () => "../../components/FamilyView/index.js";
const PickerView = () => "./components/PickerView.js";
const _sfc_main = {
  __name: "details",
  setup(__props) {
    const store = common_vendor.useStore();
    const users = store.state.user;
    const token = common_vendor.index.getStorageSync("token");
    const routes = getCurrentPages();
    const curRoute = routes[routes.length - 1].route;
    const baseData = common_vendor.ref({});
    const formData = common_vendor.ref({});
    const netStatus = common_vendor.ref(true);
    const goodsId = common_vendor.ref(null);
    const isClick = common_vendor.ref(false);
    const familyPopup = common_vendor.ref(null);
    const allElderData = common_vendor.ref([]);
    const pickerPopup = common_vendor.ref();
    const nowDate = common_vendor.ref(null);
    const popupLook = common_vendor.ref(null);
    const capsuleBottom = common_vendor.ref();
    const isFamily = common_vendor.ref(false);
    const ispicView = common_vendor.ref(false);
    const serviceVal = common_vendor.ref("service");
    common_vendor.onLoad((option) => {
      common_vendor.index.getSystemInfo({
        success: () => {
          capsuleBottom.value = common_vendor.index.getMenuButtonBoundingClientRect().bottom + 11;
        }
      });
      if (option.id) {
        goodsId.value = option.id;
      } else if (option.item) {
        formData.value = JSON.parse(decodeURIComponent(option.item));
        goodsId.value = formData.value.projectId;
        nowDate.value = `${utils_index.getNow(formData.value.estimatedArrivalTime)} ${utils_index.getTime(
          formData.value.estimatedArrivalTime
        )}`;
      } else if (users.goodsData.id) {
        goodsId.value = users.goodsData.id;
      }
      getData();
    });
    const closePicView = () => {
      ispicView.value = false;
    };
    const getData = async () => {
      await pages_api_service.goodsDetail(goodsId.value).then((res) => {
        if (res.code === 200) {
          const { data } = res;
          baseData.value = data;
          store.commit("user/setGoodsData", baseData.value);
          netStatus.value = true;
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
    const handleToRefresh = () => {
      getData();
    };
    const handleFamily = (type) => {
      if (!token) {
        store.commit("setRouter", curRoute);
        common_vendor.index.redirectTo({
          url: "/pages/login/index"
        });
      } else {
        isFamily.value = true;
      }
    };
    const handleTime = (type) => {
      if (!token) {
        store.commit("setRouter", curRoute);
        common_vendor.index.redirectTo({
          url: "/pages/login/index"
        });
      } else {
        if (!nowDate.value) {
          pickerPopup.value.getMon(/* @__PURE__ */ new Date());
          pickerPopup.value.getDate(/* @__PURE__ */ new Date());
          pickerPopup.value.getHour(/* @__PURE__ */ new Date());
          pickerPopup.value.getMins(/* @__PURE__ */ new Date());
        }
      }
    };
    const bindPicker = (val, time) => {
      nowDate.value = `${utils_index.getNow(utils_index.getTateTime(val))} ${time.hour}:${utils_index.addZero(
        time.mins
      )}`;
      isClick.value = false;
    };
    const bindFamily = (val) => {
      formData.value.name = val.elderVo.name;
      formData.value.elderId = val.elderId;
    };
    const handleToLink = () => {
      common_vendor.index.reLaunch({
        url: `/pages/service/index`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "商品详情",
          isShowBack: true,
          handleToLink
        }),
        b: netStatus.value
      }, netStatus.value ? common_vendor.e({
        c: baseData.value.image,
        d: common_vendor.t(baseData.value.name),
        e: common_vendor.t(baseData.value.nursingRequirement),
        f: common_vendor.t(common_vendor.unref(utils_index.decimalsReplenish)(baseData.value.price)),
        g: common_vendor.t(baseData.value.unit),
        h: formData.value.name
      }, formData.value.name ? {
        i: common_vendor.t(formData.value.name)
      } : {}, {
        j: common_vendor.o(($event) => handleFamily()),
        k: nowDate.value
      }, nowDate.value ? {
        l: common_vendor.t(nowDate.value)
      } : {}, {
        m: common_vendor.o(($event) => handleTime()),
        n: capsuleBottom.value + "px"
      }) : {
        o: common_vendor.p({
          handleToRefresh
        })
      }, {
        p: common_vendor.sr(pickerPopup, "8d98c490-2", {
          "k": "pickerPopup"
        }),
        q: common_vendor.o(bindPicker),
        r: common_vendor.o(closePicView),
        s: common_vendor.p({
          nowDate: nowDate.value,
          ispicView: ispicView.value
        }),
        t: common_vendor.sr(familyPopup, "8d98c490-3", {
          "k": "familyPopup"
        }),
        v: common_vendor.o(bindFamily),
        w: common_vendor.p({
          serviceVal: serviceVal.value,
          formData: formData.value,
          allElderData: allElderData.value
        }),
        x: common_vendor.sr(popupLook, "8d98c490-4", {
          "k": "popupLook"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8d98c490"], ["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/pages/service/details.vue"]]);
wx.createPage(MiniProgramPage);
