import Vue from 'vue';
import {baseUrl} from "@/config/utils";

class ConsumablesService {
  /**
   * 工作量列表
   * @param {Object} params 参数
   * @param {string} params.type 类型
   * @param {string} params.start_date 开始时间
   * @param {string} params.end_date 结束时间
   * @return {Promise}
   */
  materialsNumList(params) {
    return Vue.http.get(`${baseUrl}/consumables_statistics`, {params: params});
  }

  materialsTrendList(params) {
    return Vue.http.get(`${baseUrl}/consumables_statistics_time`, {params: params});
  }

  exportData(params) {
    return Vue.http.get(`${baseUrl}/workload_excel`, {params: params});
  }
}

export const consumablesService = new ConsumablesService();
