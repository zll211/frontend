import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * 账户服务
 */
class AccountService {

  /**
   *  修改密码
   * @param {Object} data 参数
   * @return {Promis}
   */
  modifyPassword(data) {
    return Vue.http.patch(`${baseUrl}/auth/change_password`, data);
  }
}


export const accountService = new AccountService();
