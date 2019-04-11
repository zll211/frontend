import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class TakeSpecimenService {

  constructor(){}

  /**
   * 根据病理id获取病人信息
   * @param id
   * @returns {*}
   */
  registerInfo(id) {
    return Vue.http.get(`${baseUrl}/draw_material/${id}?include=specimen.paraffinBlock,specimen.dictGiganticInspection,img`);
  }

  /**
   * 保存取材信息
   * @returns {*}
   */
  takeSpecimen(params) {
    return Vue.http.post(`${baseUrl}/draw_material`,params);
  }

  /**
   *
   * @param caseType
   * @param pageSize
   * @param page
   * @param status
   * @returns {*}
   */
  getRegisterTable(params) {
    return Vue.http.get(`${baseUrl}/draw_material?include=specimen`,{params:params})
  }

  /**
   * 重补取
   * @param params
   * @returns {*}
   */
  reCharge(params) {
    return Vue.http.post(`${baseUrl}/recharge`,params);
  }

  /**
   * 上传图片
   * @param params
   * @returns {*}
   */
  uploadImage(params) {
    return Vue.http.post(`${baseUrl}/image`, params);
  }

  orderPrint(params){
    return Vue.http.post(`${baseUrl}/drawWorkOrder`,params,{responseType:'blob'});
  }

  frozenResult(params){
    return Vue.http.get(`${baseUrl}/associate_pathology`,{params: params});
  }

}

const takeSpecimenService = new TakeSpecimenService();
export {takeSpecimenService};
