import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class FollowService {

  constructor(){}

  getTable(params) {
    return Vue.http.get(`${baseUrl}/followups`,{params: params});
  }

  editFollow(params) {
    return Vue.http.patch(`${baseUrl}/followups`,params);
  }

  cancelCollect(data) {
    return Vue.http.delete(`${baseUrl}/collection_case`,{body: data});
  }

  getTableCount() {
    return Vue.http.get(`${baseUrl}/followups_status`);
  }
}

const followService = new FollowService();
export {followService};
