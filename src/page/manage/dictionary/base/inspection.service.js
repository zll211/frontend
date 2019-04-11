import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * 字典管理中基础数据中送检服务类
 * @class
 */
class InspectionService {

  /**
   * 获取送检列表
   * @param {string} type 送检的类型，分为hospital：医院，department：科室，doctor：医生
   * @return {Promise}
   */
  inspectionList(type) {
    return Vue.http.get(`${baseUrl}/inspection_${type}`);
  }

  /**
   * 创建送检信息
   * @param {Object} data 送检信息
   * @param {string} type 送检的类型，分为hospital：医院，department：科室，doctor：医生
   * @return {Promise}
   */
  createInspection(type, data) {
    return Vue.http.post(`${baseUrl}/inspection_${type}`, data);
  }

  /**
   * 修改送检信息
   * @param {string} type 送检的类型，分为hospital：医院，department：科室，doctor：医生
   * @param {string} id 修改送检信息的id
   * @param {Object} data 送检信息
   * @return {Promise}
   */
  patchInspection(type, id, data) {
    return Vue.http.patch(`${baseUrl}/inspection_${type}/${id}`, data);
  }

  /**
   * 删除送检信息
   * @param {string} type 送检的类型，分为hospital：医院，department：科室，doctor：医生
   * @param {string} id 删除送检信息的id
   * @return {Promise}
   */
  deleteInspection(type, id) {
    return Vue.http.delete(`${baseUrl}/inspection_${type}/${id}`);
  }

}

const inspectionService = new InspectionService();

export {inspectionService};
