"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_index = require("../../../utils/index.js");
const utils_commonData = require("../../../utils/commonData.js");
const _sfc_main = {
  __name: "TimeSelect",
  props: {
    // 选择的时间
    nowDate: {
      type: String,
      default: ""
    },
    allTimeAll: {
      type: Array,
      default: () => []
    },
    // 是探访预约还是参观预约
    appType: {
      type: Number,
      default: 0
    }
  },
  emits: ["getTime"],
  setup(__props, { expose, emit }) {
    const props = __props;
    const activeIndex = common_vendor.ref(0);
    const activeAmIndex = common_vendor.ref(-1);
    const activePmIndex = common_vendor.ref(-1);
    const activeTimeIndex = common_vendor.ref(-1);
    const tabList = common_vendor.ref(utils_commonData.timeTabData);
    const timeAm = common_vendor.ref(utils_commonData.timeBaseData.slice(0, 9));
    const timePm = common_vendor.ref(utils_commonData.timeBaseData.slice(9, 21));
    const timeData = common_vendor.ref("");
    const allTime = common_vendor.ref([]);
    common_vendor.watch(
      () => props.nowDate,
      (newValue) => {
        timeData.value = newValue;
        settleData();
      }
    );
    common_vendor.watch(
      () => props.allTimeAll,
      (newValue) => {
        if (newValue) {
          allTime.value = newValue;
          settleData();
        }
      }
    );
    const settleData = () => {
      const timeNow = /* @__PURE__ */ new Date();
      const years = timeNow.getFullYear();
      const months = timeNow.getMonth() + 1;
      const days = timeNow.getDate();
      const hours = timeNow.getHours();
      const mins = timeNow.getMinutes();
      const ymsData = `${years}/${months}/${days}`;
      const sameDay = new Date(ymsData).getTime();
      const selectValue = timeData.value.split(".");
      const selectYear = selectValue[0];
      const selectMonths = selectValue[1];
      const selectDays = selectValue[2];
      const selectTime = (/* @__PURE__ */ new Date(
        `${selectYear}/${selectMonths}/${selectDays}`
      )).getTime();
      const timeNum = hours * 60 + mins;
      if (sameDay < selectTime || hours > 8 && hours <= 12) {
        activeIndex.value = 0;
      } else {
        activeIndex.value = 1;
      }
      utils_commonData.timeBaseData.forEach((time) => {
        const t = utils_index.timeToSec(time.label);
        if (sameDay === selectTime) {
          if (timeNum > Number(t)) {
            time.disabled = true;
          } else {
            time.disabled = false;
          }
        } else if (sameDay > selectTime) {
          time.disabled = true;
        } else {
          time.disabled = false;
        }
        if (allTime.value.length > 0) {
          allTime.value.forEach((val) => {
            const t2 = utils_index.getTime(val.time);
            if (t2 === time.label && props.appType !== 1) {
              time.count = Number(val.count);
            }
          });
        } else {
          time.count = null;
        }
      });
    };
    const changeTab = (index) => {
      activeIndex.value = index;
    };
    const handleAm = (item) => {
      if (!item.disabled && item.count !== 0) {
        activeTimeIndex.value = item.value;
        emit("getTime", item.label);
      }
    };
    expose({
      settleData,
      activeIndex,
      activeAmIndex,
      activePmIndex,
      activeTimeIndex
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(tabList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: index,
            c: common_vendor.n(activeIndex.value === index ? "active" : ""),
            d: common_vendor.o(($event) => changeTab(index), index)
          };
        }),
        b: common_vendor.n(activeIndex.value === 1 ? "active" : ""),
        c: activeIndex.value === 0
      }, activeIndex.value === 0 ? {
        d: common_vendor.f(timeAm.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(__props.appType !== 1 && item.count === 0 ? "已约满" : item.label),
            b: item.value,
            c: common_vendor.n(activeTimeIndex.value === item.value && !item.disabled && item.count !== 0 ? "active" : ""),
            d: common_vendor.n(item.disabled || item.count === 0 && __props.appType !== 1 ? "disabledActive" : ""),
            e: common_vendor.o(($event) => handleAm(item), item.value)
          };
        })
      } : {}, {
        e: activeIndex.value === 1
      }, activeIndex.value === 1 ? {
        f: common_vendor.f(timePm.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(__props.appType !== 1 && item.count === 0 ? "已约满" : item.label),
            b: item.value,
            c: common_vendor.n(activeTimeIndex.value === item.value && !item.disabled && item.count !== 0 ? "active" : ""),
            d: common_vendor.n(item.disabled || item.count === 0 && __props.appType !== 1 ? "disabledActive" : ""),
            e: common_vendor.o(($event) => handleAm(item), item.value)
          };
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-83a8e59d"], ["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/subPages/appointment/components/TimeSelect.vue"]]);
wx.createComponent(Component);
