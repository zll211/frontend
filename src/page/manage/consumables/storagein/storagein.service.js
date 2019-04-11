import Vue from 'vue';
import {baseUrl} from "@/config/utils";

class StorageinService {

  addStoragein(params){
    return Vue.http.post(`${baseUrl}/consumables_stock_in`,params);
  }

  getTable(params) {
    return Vue.http.get(`${baseUrl}/consumables_stock_in`,{params:params});
  }

  getChooseMaterials(id) {
    return Vue.http.get(`${baseUrl}/consumables_stock_in/${id}?include=consumablesStock.consumables`);
  }

  editStoragein(id,params){
    return Vue.http.patch(`${baseUrl}/consumables_stock_in/${id}`,params);
  }
}


const storageinService = new StorageinService();

export {
  storageinService,
}
