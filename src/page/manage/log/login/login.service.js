import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * @class
 */
class LoginService {

  /**
   * 查询日志列表
   * @param {Object} params 参数
   * @return {Promise}
   */
  logList(params) {
    return Vue.http.get(`${baseUrl}/auth_log`, {params: params});
  }


}

export const loginService = new LoginService();
