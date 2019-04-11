import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * 登录模块的服务
 * @class
 */
class LoginService {
  /**
   * @constructor
   */
  constructor() {}

  /**
   * 登录接口
   * @param {Object} params 登录所需的信息
   * @param {string} params.username - 登录用户名
   * @param {string} params.password - 登录密码
   * @return {Promise}
   */
  login(params) {
    return Vue.http.post(`${baseUrl}/auth/login`, params);
  }

  /**
   * 登出
   * @return {Promise}
   */
  logout() {
    return Vue.http.post(`${baseUrl}/auth/logout`);
  }

  /**
   * 获取设置信息
   * @return {Promise}
   */
  setting() {
    return Vue.http.get(`${baseUrl}/setting`);
  }

  verifyPass(params) {
    return Vue.http.post(`${baseUrl}/users/lockScreenVerify`,params);
  }

}

const loginService = new LoginService();

export {loginService};
