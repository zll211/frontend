import Vue from 'vue';
import {baseUrl} from "@/config/utils";

class SpecimenService {
  /**
   * 工作量列表
   * @param {Object} params 参数
   * @param {string} params.type 类型
   * @param {string} params.start_date 开始时间
   * @param {string} params.end_date 结束时间
   * @return {Promise}
   */
  specimenList(params) {
    return Vue.http.get(`${baseUrl}/statistic_specimen`, {params: params});
  }

  exportData(params) {
    return Vue.http.get(`${baseUrl}/specimen_excel`,{params: params});
  }

}

export const specimenService = new SpecimenService();
