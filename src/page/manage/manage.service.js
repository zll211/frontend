import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * @class
 */
class ManageService {

  /**
   * 获取设置信息
   * @return {Promise}
   */
  setting() {
    return Vue.http.get(`${baseUrl}/setting`);
  }

  userList() {
    return Vue.http.get(`${baseUrl}/users?include=organization,roles`);
  }

  getRegionList() {
    return Vue.http.get(`${baseUrl}/region`)
  }

  /**
   * 获取用户详情
   * @param {number} id 用户id
   * @return {Promise}
   */
  userInfo(id) {
    return Vue.http.get(`${baseUrl}/users/${id}?include=organization,roles`);
  }

  /**
   * 获取送检列表
   * @param {string} type 送检的类型，分为hospital：医院，department：科室，doctor：医生
   * @return {Promise}
   */
  inspectionList(type) {
    return Vue.http.get(`${baseUrl}/inspection_${type}`);
  }


  roleUserList(type) {
    return Vue.http.get(`${baseUrl}/role_user/${type}`);
  }

  /**
   * 获取用户菜单
   * @return {Promise}
   */
  userMenus() {
    return Vue.http.get(`${baseUrl}/user/menu`);
  }
}

const manageService = new ManageService();

export {manageService};
