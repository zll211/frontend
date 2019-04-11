import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class TimeoutService {

  constructor(){}


  getTable(params) {
    return Vue.http.get(`${baseUrl}/case`,{params: params});
  }

  timeoutTableCount() {
    return Vue.http.get(`${baseUrl}/pathology_timeout_status_count`);
  }
}

const timeoutService = new TimeoutService();
export {timeoutService};
