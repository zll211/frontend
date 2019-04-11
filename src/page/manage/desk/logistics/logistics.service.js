import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class LogiscticsService {

  constructor(){}

  getLogisticsTable(params) {
    return Vue.http.get(`${baseUrl}/logistics`,{params: params});
  }

  getTableCount() {
    return Vue.http.get(`${baseUrl}/logistics_count`);
  }
}

const logiscticsService = new LogiscticsService();
export {logiscticsService};
