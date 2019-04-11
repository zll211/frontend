import Vue from 'vue';
import {baseUrl} from "@/config/utils";

class StoragenumService {

  getSingleTable(id,params) {
    return Vue.http.get(`${baseUrl}/consumables_item/${id}?include=consumablesStockIn,consumablesStockOut`,{params:params});
  }

}


const storagenumService = new StoragenumService();

export {
  storagenumService,
}
