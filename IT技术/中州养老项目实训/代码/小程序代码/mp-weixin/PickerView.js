"use strict";
const common_vendor = require("./common/vendor.js");
const utils_index = require("./utils/index.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "./uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = {
  __name: "PickerView",
  props: {
    // 选择的时间
    nowDate: {
      type: String,
      default: ""
    },
    ispicView: {
      type: Boolean,
      default: false
    }
  },
  emits: ["bindPicker", "clearTime"],
  setup(__props, { expose, emit }) {
    const props = __props;
    const popup = common_vendor.ref(null);
    const date = /* @__PURE__ */ new Date();
    const year = common_vendor.ref(date.getFullYear());
    const month = common_vendor.ref(date.getMonth() + 1);
    const day = common_vendor.ref(date.getDate());
    const selectValue = common_vendor.ref([0, 1, 1]);
    const visible = common_vendor.ref(true);
    const indicatorStyle = `height: 50px`;
    const isTime = common_vendor.ref(false);
    common_vendor.watch(props, (newValue) => {
      common_vendor.nextTick$1(() => {
        const date2 = new Date(utils_index.getTateTime(newValue.nowDate));
        const month2 = date2.getMonth() + 1;
        const day2 = date2.getDate();
        months.value.forEach((ele, i) => {
          if (month2 === ele) {
            selectValue.value[1] = i;
          }
        });
        days.value.forEach((v, index) => {
          if (day2 === v) {
            selectValue.value[2] = index;
          }
        });
      });
    });
    const months = common_vendor.ref();
    const years = common_vendor.ref([]);
    const days = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      for (let i = year.value; i <= date.getFullYear() + 10; i++) {
        years.value.push(i);
      }
      getMon();
      getDate();
    });
    const getMon = () => {
      const m = [];
      const date2 = /* @__PURE__ */ new Date();
      const month2 = date2.getMonth();
      for (let i = 1; i <= 12; i++) {
        m.push(i);
      }
      months.value = m.splice(month2);
    };
    const getDate = () => {
      const num = mGetDate(year.value, month.value);
      const date2 = /* @__PURE__ */ new Date();
      const day2 = date2.getDate() - 1;
      const d = [];
      for (let i = 1; i <= num; i++) {
        d.push(i);
      }
      days.value = d.splice(day2);
    };
    const mGetDate = (year2, month2) => {
      const m = new Date(year2, month2, 0);
      return m.getDate();
    };
    const bindChange = (e) => {
      const val = e.detail.value;
      const y = years.value[val[0]];
      const m = months.value[val[1]];
      const d = days.value[val[2]];
      const date2 = /* @__PURE__ */ new Date();
      const yearData = date2.getFullYear();
      const dayData = date2.getDate() - 1;
      const mon = date2.getMonth() + 1;
      const num = mGetDate(y, m);
      year.value = y;
      month.value = m;
      day.value = d;
      selectValue.value = val;
      const monBasedata = [];
      for (let monIndex = 1; monIndex <= 12; monIndex++) {
        monBasedata.push(monIndex);
      }
      const data = [];
      for (let dataIndex = 1; dataIndex <= num; dataIndex++) {
        data.push(dataIndex);
      }
      if (y === yearData) {
        if (m > mon) {
          days.value = data;
          setTimeout(() => {
            selectValue.value[2] = d - 1;
            clearTimeout();
          }, 100);
          months.value = monBasedata.splice(mon - 1);
          months.value.forEach((mV, MIn) => {
            if (mV === m) {
              selectValue.value[1] = MIn;
            }
          });
        } else {
          months.value = monBasedata.splice(mon - 1);
          days.value = data.splice(dayData);
          months.value.forEach((monsVal, monIn) => {
            if (monsVal === m) {
              selectValue.value[1] = monIn;
            }
          });
          month.value = months.value[selectValue.value[1]];
          days.value.forEach((daysVal, dayIn) => {
            if (daysVal === d) {
              selectValue.value[2] = dayIn;
            }
          });
          day.value = days.value[selectValue.value[2]];
        }
      }
      if (y > yearData) {
        days.value = data;
        months.value = monBasedata;
        if (m > mon) {
          setTimeout(() => {
            selectValue.value[2] = d - 1;
            clearTimeout();
          }, 100);
          setTimeout(() => {
            selectValue.value[1] = m - 1;
            clearTimeout();
          }, 100);
        } else {
          days.value.forEach((daysOldVal, dayOldIn) => {
            if (daysOldVal === d) {
              setTimeout(() => {
                selectValue.value[2] = dayOldIn;
                clearTimeout();
              }, 100);
            }
          });
          months.value.forEach((monVal, monIn) => {
            if (monVal === m) {
              selectValue.value[1] = monIn;
            }
          });
        }
      }
    };
    const onSubmit = () => {
      let data = "";
      data = `${year.value}.${month.value}.${day.value}`;
      if (!isTime.value) {
        emit("bindPicker", data, {
          year: year.value,
          month: month.value,
          day: day.value
        });
        emit("clearTime");
        popup.value.close();
        clearTimeout();
      } else {
        utils_index.tostTip("日期不可小于当前日期");
      }
    };
    const handleClose = () => {
      const date2 = new Date(utils_index.getTateTime(props.nowDate));
      const yearData = date2.getFullYear();
      const dayData = date2.getDate();
      const mon = date2.getMonth() + 1;
      years.value.forEach((yearVal, yearIn) => {
        if (yearVal === yearData) {
          selectValue.value[0] = yearIn;
        }
      });
      months.value.forEach((monVal, monIn) => {
        if (monVal === mon) {
          selectValue.value[1] = monIn;
        }
      });
      days.value.forEach((dayVal, dayIn) => {
        if (dayVal === dayData) {
          selectValue.value[2] = dayIn;
        }
      });
      popup.value.close();
    };
    expose({
      popup,
      visible
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleClose),
        b: visible.value
      }, visible.value ? {
        c: common_vendor.f(years.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        d: common_vendor.f(months.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        e: common_vendor.f(days.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        f: indicatorStyle,
        g: selectValue.value,
        h: common_vendor.o(bindChange)
      } : {}, {
        i: common_vendor.o(onSubmit),
        j: _ctx.type === "left" || _ctx.type === "right" ? 1 : "",
        k: common_vendor.sr(popup, "324010d9-0", {
          "k": "popup"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/subPages/appointment/components/PickerView.vue"]]);
exports.MiniProgramPage = MiniProgramPage;
