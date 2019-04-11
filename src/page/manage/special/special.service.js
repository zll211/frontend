import Vue from "vue";
import {baseUrl} from "../../../config/utils";

class SpecialService {
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
    return Vue.http.get(`${baseUrl}/special_production_${type}`, {params: params});
  }

  /**
   * 更新制片状态
   * @param {Object} params 制片列表请求参数
   * @return {Promise}
   */
  updateStatus(type, data){
    return Vue.http.patch(`${baseUrl}/special_production_${type}`, data);
  }

  getTableCount(type,params) {
    return Vue.http.get(`${baseUrl}/special_count_${type}`, {params: params});
  }

  printLabel(type, params) {
    return Vue.http.get(`${baseUrl}/pdf/special_${type}_production`, {params: params, responseType:'blob'});
  }

  printSection(params) {
    return Vue.http.post(`${baseUrl}/sectionWorkOrder`,params, {responseType:'blob'});
  }

  changeSocialResult(type, data) {
    return Vue.http.post(`${baseUrl}/special_result_${type}`, data);
  }


  specialDyeingResult(params) {
    return Vue.http.post(`${baseUrl}/special_dyeing_estimate`,params);
  }
}


export const specialService =  new SpecialService();

