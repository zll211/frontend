import Vue from 'vue';
import {baseUrl} from "@/config/utils";

class ReportFormService {
  /**
   * 工作量列表
   * @param {Object} params 参数
   * @param {string} params.type 类型
   * @param {string} params.start_date 开始时间
   * @param {string} params.end_date 结束时间
   * @return {Promise}
   */
  reportFormList(params) {
    return Vue.http.get(`${baseUrl}/statistic_report_form`, {params: params});
  }

  exportData(params) {
    return Vue.http.get(`${baseUrl}/report_form_excel`,{params: params})
  }
}

export const reportFormService = new ReportFormService();
