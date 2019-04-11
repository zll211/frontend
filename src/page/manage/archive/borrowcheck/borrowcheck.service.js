import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class BorrowCheckService {

  constructor(){}

  getCheckBorrow(params) {
    return Vue.http.get(`${baseUrl}/borrow?include=borrowItem&check_doctor_is_me=1`,{params:params});
  }

  changeStatus(params){
    return Vue.http.post(`${baseUrl}/borrow/changeStatus`,params);
  }
}

const borrowCheckService = new BorrowCheckService();
export {borrowCheckService};
