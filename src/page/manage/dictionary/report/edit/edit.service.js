import Vue from 'vue';
import {baseUrl} from '@/config/utils';

class EditService {

  getReport(id) {
    return Vue.http.get(`${baseUrl}/report_template/${id}`);
  }

  setReport(params) {
    return Vue.http.post(`${baseUrl}/report_template`, params);
  }

  updateReport(id,params) {
    return Vue.http.patch(`${baseUrl}/report_template/${id}`,params);
  }
}

export const editService = new EditService();
