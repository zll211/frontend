import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * @class
 */
class CaseService {

  /**
   * 查询日志列表
   * @param {Object} params 参数
   * @return {Promise}
   */
  logList(params) {
    return Vue.http.get(`${baseUrl}/case/log`, {params: params});
  }


}

export const caseService = new CaseService();
