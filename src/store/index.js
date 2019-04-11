import Vue from 'vue';
import Vuex from 'vuex';
import {productionModule} from "../page/manage/production/production.store";

Vue.use(Vuex);

const state = {
  urlList: [],
  menus: [],
  isLogin: false,
  user: {},
  setting: {},
  area: [],
  hospitals: [],
  departments: [],
  doctors: [],
  collapse: false,
  userList:[],
};

const mutations = {
  setUserList(state, list) {
    state.userList = list;
  },
  setURL(state, list) {
    state.urlList = list;
  },
  setMenus(state, menus) {
    state.menus = menus;
  },
  isLogin(state, status) {
    state.isLogin = status;
  },
  setUser(state, user) {
    state.user = user;
  },
  setSetting(state, setting) {
    state.setting = setting;
  },
  setArea(state, areaJson) {
    state.area = areaJson;
  },
  setHospital(state, hospital) {
    state.hospitals = hospital;
  },
  setDepartment(state, department) {
    state.departments = department;
  },
  setDoctor(state, doctor) {
    state.doctors = doctor;
  },
  setCollapse(state, collapse) {
    state.collapse = collapse;
  },
};

const actions = {};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    productionModule,
  }
});
