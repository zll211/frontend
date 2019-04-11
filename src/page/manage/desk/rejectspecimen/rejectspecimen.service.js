import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class RejectspecimenService {

  constructor(){}


  getTable(params) {
    return Vue.http.get(`${baseUrl}/specimen/rejectionList`,{params: params});
  }

  getCaseNo() {
    return Vue.http.get(`${baseUrl}/specimen/rejectionCount`);
  }

}

const rejectService = new RejectspecimenService();
export {rejectService};
