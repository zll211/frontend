import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class WarehouseService {

  constructor() {
  }


  warehouseList(params) {
    return Vue.http.get(`${baseUrl}/lockers`, {params: params});
  }

  saveWarehouse(params) {
    return Vue.http.post(`${baseUrl}/lockers`, params);
  }

  editWarehouse(id, params) {
    return Vue.http.patch(`${baseUrl}/lockers/${id}`, params);
  }

  deleteWarehouse(id) {
    return Vue.http.delete(`${baseUrl}/lockers/${id}`);
  }

}

const warehouseService = new WarehouseService();
export {warehouseService};
