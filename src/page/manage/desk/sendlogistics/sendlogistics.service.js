import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class SendLogiscticsService {

  constructor(){}

  submitHandForm(params) {
    return Vue.http.post(`${baseUrl}/logistics`, params);
  }

  getLogisticsTable(pageSize,page,status){
    return Vue.http.get(`${baseUrl}/logistics?page_size=${pageSize}&page=${page}&status=${status}`)
  }

  delLogistics(params) {
   return Vue.http.delete(`${baseUrl}/logistics`,{body:params})
  }

  editLogistics(id,params) {
    return Vue.http.patch(`${baseUrl}/logistics/${id}`,params)
  }

  getLogisticsInfo(id) {
    return Vue.http.get(`${baseUrl}/logistics/${id}`)
  }

  organizationList() {
    return Vue.http.get(`${baseUrl}/organization_list`)
  }
}

const sendLogiscticsService = new SendLogiscticsService();
export {sendLogiscticsService};
