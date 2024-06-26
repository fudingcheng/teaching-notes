"use strict";
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
require("./store/modules/global.js");
require("./store/modules/user.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/service/index.js";
  "./pages/service/details.js";
  "./pages/my/index.js";
  "./components/Foot/index.js";
  "./components/uni-phone/index.js";
  "./subPages/appointment/index.js";
  "./subPages/appointment/components/PickerView.js";
  "./subPages/appointment/list/index.js";
  "./subPages/introduce/index.js";
  "./subPages/search/index.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    return () => {
    };
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/project/2024/java/project-zhyl-xcx-uniapp-java-gaowendong/App.vue"]]);
const NavBar = () => "./components/Navbar/index.js";
const NetFail = () => "./components/NetFail/index.js";
const UniFooter = () => "./components/Foot/index2.js";
common_vendor.index.setStorageSync("token", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiLml6Xlr4zkuIDml6UxMDY2IiwiZXhwIjoxNDY2Njg0NTM3NywidXNlcmlkIjo3fQ.Um2KeKsHa2_EyWCEyvEZ4kx2WVCW8LDdOkbQu5rPBC0");
const app = common_vendor.createApp(App);
app.use(store_index.store);
app.mount("#app");
app.component("NavBar", NavBar);
app.component("UniFooter", UniFooter);
app.component("NetFail", NetFail);
