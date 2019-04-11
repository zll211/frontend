import Vue from "vue";
import {baseUrl} from "../../../config/utils";

class ProductionService {
  assetList(params) {
    return Vue.http.get(`${baseUrl}/organization_asset`,{params:params});
  }


  /**
   * @param {string} type 制片类型 routine frozen cell
   * @param {Object} params 制片列表请求参数
   * @param {string} params.status 制片的状态
   * @return {Promise}
   */
  prodList(type, params){
    return Vue.http.get(`${baseUrl}/${type}_production`, {params: params});
  }

  /**
   * 更新制片状态
   * @param {Object} params 常规制片列表请求参数
   * @return {Promise}
   */
  updateStatus(type, data){
    return Vue.http.patch(`${baseUrl}/${type}_production`, data);
  }

  getTableCount(type) {
    return Vue.http.get(`${baseUrl}/${type}_production_status_count`);
  }

  printLabel(type, params) {
    return Vue.http.get(`${baseUrl}/pdf/${type}_production`, {params: params, responseType:'blob'});
  }

  printSection(params) {
    return Vue.http.post(`${baseUrl}/sectionWorkOrder`, params, {responseType:'blob'});
  }

  statusList(type) {
    return Vue.http.get(`${baseUrl}/${type}_production_status_get`);
  }

  recordEntrapmentSituation(params) {
    return Vue.http.post(`${baseUrl}/embed_situation`,params);
  }
}


export const productionService =  new ProductionService();

