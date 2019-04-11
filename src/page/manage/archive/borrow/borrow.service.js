import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class BorrowService {

  constructor(){}

  getTable(params) {
    return Vue.http.get(`${baseUrl}/borrow?include=borrowItem`,{params:params});
  }

  addBorrow(params) {
    return Vue.http.post(`${baseUrl}/borrow`,params);
  }

  deleteBorrow(id) {
    return Vue.http.delete(`${baseUrl}/borrow`,{body: {id:id}});
  }

  editBorrow(id,params) {
    return Vue.http.patch(`${baseUrl}/borrow/${id}`,params);
  }

  patholoygIdList() {
    return Vue.http.get(`${baseUrl}/suggest`);
  }

  printBorrow(data) {
    return Vue.http.post(`${baseUrl}/borrow/pdfToken`, data,{responseType:'blob'});
  }
}

const borrowService = new BorrowService();
export {borrowService};
