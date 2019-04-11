import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * @class
 */
class DScanService{

  /**
   * 查询切片列表
   * @param {Object} params 参数
   * @return {Promise}
   */
  scanList(params) {
    return Vue.http.get(`${baseUrl}/parafinSection`, {params: params});
  }

  scanCount() {
    return Vue.http.get(`${baseUrl}/sectionBindCount`);
  }

  /**
   * 审核
   * @param {Object} data 参数
   * @param {Array} data.ids 切片id列表
   * @return {Promise}
   */
  updateParafinSection(data){
    return Vue.http.post(`${baseUrl}/parafinSection`, data);
  }

}

export const dScanService = new DScanService();
