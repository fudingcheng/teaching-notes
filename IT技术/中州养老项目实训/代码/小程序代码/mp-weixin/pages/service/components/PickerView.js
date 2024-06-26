"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_index = require("../../../utils/index.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
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
  emits: ["bindPicker", "clearTime", "closePicView"],
  setup(__props, { expose, emit }) {
    const props = __props;
    const popup = common_vendor.ref(null);
    const date = /* @__PURE__ */ new Date();
    const year = common_vendor.ref(date.getFullYear());
    const month = common_vendor.ref(date.getMonth() + 1);
    const day = common_vendor.ref(date.getDate());
    const hour = common_vendor.ref(date.getHours());
    const mins = common_vendor.ref(date.getMinutes());
    const selectValue = common_vendor.ref([0, 0, 0, 0, 0]);
    const visible = common_vendor.ref(true);
    const indicatorStyle = `height: 50px`;
    const isTime = common_vendor.ref(false);
    const propDate = common_vendor.ref(null);
    common_vendor.watch(props, (newValue) => {
      common_vendor.nextTick$1(() => {
        if (newValue.ispicView) {
          if (newValue.nowDate) {
            propDate.value = newValue.nowDate;
            const date2 = new Date(utils_index.getTateTime(newValue.nowDate));
            const month2 = date2.getMonth() + 1;
            const day2 = date2.getDate();
            const hour2 = date2.getHours();
            const mins2 = date2.getMinutes();
            const newDate = /* @__PURE__ */ new Date();
            const yearD = newDate.getFullYear();
            const monthD = newDate.getMonth() + 1;
            const dayD = newDate.getDate();
            const hourD = newDate.getHours();
            const minsD = newDate.getMinutes();
            const num = mGetDate(yearD, monthD);
            const d = [];
            for (let i = 1; i <= num; i++) {
              d.push(i);
            }
            const m = [];
            for (let i = 0; i <= 59; i++) {
              i = utils_index.addZero(i);
              m.push(i);
            }
            const h = [];
            for (let i = 0; i <= 23; i++) {
              i = utils_index.addZero(i);
              h.push(i);
            }
            if (month2 === monthD) {
              days.value = d.splice(dayD - 1);
              if (day2 === dayD) {
                if (hour2 === hourD) {
                  hours.value = h.splice(hour2);
                  if (mins2 - minsD < 30) {
                    minutes.value = m.splice((minsD + 30) % 60);
                    if (60 - mins2 - 30 < 1) {
                      hours.value.splice(0, 1);
                    }
                  } else {
                    minutes.value = m.splice(minsD + 30);
                  }
                }
              }
            } else {
              days.value = d;
              hours.value = h;
              minutes.value = m;
            }
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
            hours.value.forEach((h2, index) => {
              if (hour2 === h2) {
                selectValue.value[3] = index;
              }
            });
            minutes.value.forEach((n, index) => {
              if (mins2 === n) {
                selectValue.value[4] = index;
              }
            });
          } else {
            selectValue.value = [0, 0, 0, 0, 0];
          }
        }
      });
    });
    const months = common_vendor.ref();
    const years = common_vendor.ref([]);
    const days = common_vendor.ref([]);
    const hours = common_vendor.ref([]);
    const minutes = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      for (let i = year.value; i <= date.getFullYear(); i++) {
        years.value.push(i);
      }
      for (let i = 0; i <= 23; i++) {
        i = utils_index.addZero(i);
        hours.value.push(i);
      }
      for (let i = 0; i <= 59; i++) {
        i = utils_index.addZero(i);
        minutes.value.push(i);
      }
      getMon(date);
      getDate(date);
      getHour(date);
      getMins(date);
    });
    const getMon = (val) => {
      const m = [];
      const date2 = val;
      const month2 = date2.getMonth();
      for (let i = 1; i <= 12; i++) {
        m.push(i);
      }
      months.value = m.splice(month2);
    };
    const getDate = (val) => {
      const num = mGetDate(year.value, month.value);
      const date2 = val;
      const day2 = date2.getDate() - 1;
      const d = [];
      for (let i = 1; i <= num; i++) {
        d.push(i);
      }
      days.value = d.splice(day2);
    };
    const getHour = (val) => {
      const date2 = val;
      const hour2 = date2.getHours();
      const h = [];
      for (let i = 0; i <= 23; i++) {
        i = utils_index.addZero(i);
        h.push(i);
      }
      hours.value = h.splice(hour2);
    };
    const getMins = (val) => {
      const date2 = val;
      const hour2 = date2.getHours();
      const min = date2.getMinutes();
      const m = [];
      for (let i = 0; i <= 59; i++) {
        i = utils_index.addZero(i);
        m.push(i);
      }
      minutes.value = m.splice(min - 30);
      if (60 - min - 30 < 1) {
        hours.value.splice(0, 1);
      }
      if (min === 59 && hour2 === 23) {
        days.value.splice(0, 1);
      }
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
      let h = hours.value[val[3]];
      const min = minutes.value[val[4]];
      const date2 = /* @__PURE__ */ new Date();
      const yearData = date2.getFullYear();
      const dayData = date2.getDate() - 1;
      const mon = date2.getMonth() + 1;
      const num = mGetDate(y, m);
      let hou = date2.getHours();
      const minsin = date2.getMinutes();
      year.value = y;
      month.value = m;
      day.value = d;
      hour.value = h;
      mins.value = min;
      selectValue.value = val;
      const monBasedata = [];
      for (let monIndex = 1; monIndex <= 12; monIndex++) {
        monBasedata.push(monIndex);
      }
      const data = [];
      for (let dataIndex = 1; dataIndex <= num; dataIndex++) {
        data.push(dataIndex);
      }
      const hourBasedata = [];
      for (let hourIndex = 0; hourIndex <= 23; hourIndex++) {
        hourIndex = utils_index.addZero(hourIndex);
        hourBasedata.push(hourIndex);
      }
      const minBasedata = [];
      for (let minIndex = 0; minIndex <= 59; minIndex++) {
        minIndex = utils_index.addZero(minIndex);
        minBasedata.push(minIndex);
      }
      if (y === yearData) {
        if (m > mon) {
          days.value = data;
          hours.value = hourBasedata;
          minutes.value = minBasedata;
          setTimeout(() => {
            selectValue.value[2] = d - 1;
            clearTimeout();
          }, 100);
          months.value = monBasedata.splice(mon - 1);
          months.value.forEach((mV, MIn) => {
            if (mV === min) {
              selectValue.value[1] = MIn;
            }
          });
          hours.value.forEach((ho, hi) => {
            if (ho === h) {
              setTimeout(() => {
                selectValue.value[3] = hi;
              }, 100);
            }
          });
          minutes.value.forEach((m2, i) => {
            if (m2 === min) {
              setTimeout(() => {
                selectValue.value[4] = i;
              }, 100);
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
          if (d > dayData + 1) {
            hours.value = hourBasedata;
            minutes.value = minBasedata;
            hours.value.forEach((ho, hi) => {
              if (ho === h) {
                setTimeout(() => {
                  selectValue.value[3] = hi;
                }, 100);
              }
            });
            minutes.value.forEach((m2, i) => {
              if (m2 === min) {
                setTimeout(() => {
                  selectValue.value[4] = i;
                }, 100);
              }
            });
          } else {
            days.value.forEach((d2, di) => {
              if (dayData + 1 === d2) {
                selectValue.value[2] = di;
                day.value = d2;
              } else {
                selectValue.value[2] = 0;
              }
            });
            if (60 - (minsin + 30) < 0) {
              hou += 1;
            }
            hours.value = hourBasedata.splice(hou);
            if (typeof h === "string") {
              if (h.indexOf(0) === 0) {
                h = Number(h.substring(1));
              }
            }
            hours.value.forEach((h2, i) => {
              if (h2 === hour.value) {
                setTimeout(() => {
                  selectValue.value[3] = i;
                }, 100);
              } else {
                selectValue.value[3] = 0;
              }
            });
            const hourDatas = hours.value[0];
            if (h > hourDatas) {
              minutes.value = minBasedata;
            } else {
              minutes.value = minBasedata.splice(minsin - 30);
            }
            minutes.value.forEach((m2, i) => {
              if (m2 === min) {
                setTimeout(() => {
                  selectValue.value[4] = i;
                }, 100);
              } else {
                selectValue.value[4] = 0;
              }
            });
          }
        }
      }
    };
    const onSubmit = () => {
      let data = "";
      hour.value = hours.value[selectValue.value[3]];
      mins.value = minutes.value[selectValue.value[4]];
      data = `${year.value}.${month.value}.${day.value} ${hour.value}:${mins.value}`;
      if (!isTime.value) {
        emit("bindPicker", data, {
          year: year.value,
          month: month.value,
          day: day.value,
          hour: hour.value,
          mins: +mins.value
        });
        emit("clearTime");
        popup.value.close();
        clearTimeout();
      } else {
        utils_index.tostTip("日期不可小于当前日期");
      }
      emit("closePicView");
    };
    const handleClose = () => {
      if (props.nowDate) {
        const date2 = new Date(utils_index.getTateTime(props.nowDate));
        const yearData = date2.getFullYear();
        const dayData = date2.getDate();
        const mon = date2.getMonth() + 1;
        const hou = date2.getHours();
        const minsin = date2.getMinutes();
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
        hours.value.forEach((houVal, houIn) => {
          if (houVal === hou) {
            selectValue.value[3] = houIn;
          }
        });
        minutes.value.forEach((minVal, minIn) => {
          if (minVal === minsin) {
            selectValue.value[4] = minIn;
          }
        });
      }
      popup.value.close();
      emit("closePicView");
    };
    expose({
      popup,
      visible,
      getMon,
      getDate,
      getHour,
      getMins
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
        f: common_vendor.f(hours.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        g: common_vendor.f(minutes.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        h: indicatorStyle,
        i: selectValue.value,
        j: common_vendor.o(bindChange)
      } : {}, {
        k: common_vendor.o(onSubmit),
        l: _ctx.type === "left" || _ctx.type === "right" ? 1 : "",
        m: common_vendor.sr(popup, "5e45b9a2-0", {
          "k": "popup"
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/pages/service/components/PickerView.vue"]]);
wx.createComponent(Component);
