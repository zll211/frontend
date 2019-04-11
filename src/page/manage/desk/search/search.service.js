import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class SearchService {

  constructor(){}


  getTable(params) {
    return Vue.http.get(`${baseUrl}/case`,{params: params});
  }

  exportExcel(params) {
    return Vue.http.get(`${baseUrl}/pathologyExcel`,{params:params});
  }
}

const searchService = new SearchService();
export {searchService};
