import Vue from 'vue';
import {baseUrl} from '@/config/utils';

class SearchService {

  constructor(){}

  getCaseStatus() {
    return Vue.http.get(`${baseUrl}/case_status_static`)
  }


}

const homeService = new SearchService();
export {homeService};
