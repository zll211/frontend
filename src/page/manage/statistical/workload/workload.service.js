import Vue from 'vue';
import {baseUrl} from "@/config/utils";

class WorkLoadService {
  /**
   * 工作量列表
   * @param {Object} params 参数
   * @param {string} params.type 类型
   * @param {string} params.start_date 开始时间
   * @param {string} params.end_date 结束时间
   * @return {Promise}
   */
  workList(params) {
    return Vue.http.get(`${baseUrl}/workload`, {params: params});
  }

  userWorkList(params) {
    return Vue.http.get(`${baseUrl}/workload/user`, {params: params});
  }

  exportDataFromMyChart(params) {
    return Vue.http.get(`${baseUrl}/workload_excel`, {params: params});
  }

  exportDataFromMyChart1(params) {
    return Vue.http.get(`${baseUrl}/workload/user_excel`, {params: params});
  }
}

export const workLoadService = new WorkLoadService();
