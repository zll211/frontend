import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class CollectService {

  constructor(){}

  getTable(params) {
    return Vue.http.get(`${baseUrl}/collection_case`,{params: params});
  }

  addCollect(id) {
    return Vue.http.post(`${baseUrl}/collection_case`,{case_id:id});
  }

  cancelCollect(data) {
    return Vue.http.delete(`${baseUrl}/collection_case`,{body: data});
  }

  exportExcel(params) {
    return Vue.http.get(`${baseUrl}/favoriteExcel`,{params:params});
  }
}

const collectService = new CollectService();
export {collectService};
