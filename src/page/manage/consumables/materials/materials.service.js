import Vue from 'vue';
import {baseUrl} from "@/config/utils";

class MaterialsService {

  addGroup(params){
    return Vue.http.post(`${baseUrl}/consumables_category`,params);
  }

  getGroupData() {
    return Vue.http.get(`${baseUrl}/consumables_category`);
  }

  editGroup(id,params) {
    return Vue.http.patch(`${baseUrl}/consumables_category/${id}`,params);
  }

  delGroup(id){
    return Vue.http.delete(`${baseUrl}/consumables_category`,{body: {id:id}});
  }

  addMaterials(params) {
    return Vue.http.post(`${baseUrl}/consumables`,params);
  }

  getTable(params) {
    return Vue.http.get(`${baseUrl}/consumables`,{params:params});
  }

  editMaterials(id,params) {
    return Vue.http.patch(`${baseUrl}/consumables/${id}`,params);
  }

  delMaterials(id) {
    return Vue.http.delete(`${baseUrl}/consumables`,{body: {id:id}});
  }
}


const materialsService = new MaterialsService();

export {
  materialsService,
}
