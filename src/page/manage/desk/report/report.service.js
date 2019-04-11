import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class ReportService {

  constructor(){}

  getTable(params) {
    return Vue.http.get(`${baseUrl}/case`,{params:params});
  }

  printReportPath(id) {  //获取单个打印地址
    return Vue.http.get(`${baseUrl}/pdf/${id}`,{responseType:'blob'});
  }

  updateStatus(params) {
    return Vue.http.post(`${baseUrl}/edit_pathology_info`,params);
  }

  multiPrintReportPath(params) { //获取批量打印地址
    return Vue.http.get(`${baseUrl}/pdf/?${params}`,{responseType:'blob'});
  }

  multiExportReportPath(params) { //导出报告
    return Vue.http.get(`${baseUrl}/pdf_download?${params}`,{responseType:'blob'});
  }

  reportStatusCount() {
    return Vue.http.get(`${baseUrl}/pathology_report_status_count`);
  }

  getLockers() {
    return Vue.http.get(`${baseUrl}/lockers`);
  }

  archiveFiles(params) {
    return Vue.http.post(`${baseUrl}/files`,params);
  }
}

const reportService = new ReportService();
export {reportService};
