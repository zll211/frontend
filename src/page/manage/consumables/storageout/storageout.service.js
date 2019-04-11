import Vue from 'vue';
import {baseUrl} from "@/config/utils";

class StorageoutService {

  addStorageout(params){
    return Vue.http.post(`${baseUrl}/consumables_stock_out`,params);
  }

  getTable(params) {
    return Vue.http.get(`${baseUrl}/consumables_stock_out`,{params:params});
  }

  getChooseMaterials(id) {
    return Vue.http.get(`${baseUrl}/consumables_stock_out/${id}?include=consumablesStock.consumables`);
  }

  editStorageout(id,params){
    return Vue.http.patch(`${baseUrl}/consumables_stock_out/${id}`,params);
  }
}


const storageoutService = new StorageoutService();

export {
  storageoutService,
}
