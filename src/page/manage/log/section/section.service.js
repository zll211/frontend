import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * @class
 */
class SectionService {

  /**
   * 查询日志列表
   * @param {Object} params 参数
   * @return {Promise}
   */
  sectionList(params) {
    return Vue.http.get(`${baseUrl}/opt_log`, {params: params});
  }


}

export const sectionService = new SectionService();
