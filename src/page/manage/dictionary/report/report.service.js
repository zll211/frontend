import Vue from 'vue';
import {baseUrl} from '@/config/utils';

class ReportService {

  getTable(params) {
    return Vue.http.get(`${baseUrl}/report_template`,{params: params});
  }

  delReport(id) {
    return Vue.http.delete(`${baseUrl}/report_template`,{body:{id:id}});
  }



}

export const reportService = new ReportService();
