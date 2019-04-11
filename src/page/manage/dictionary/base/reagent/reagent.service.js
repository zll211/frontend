import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * 字典管理中基础数据中试剂服务类
 * @class
 */
class ReagentService {

  /**
   * 获取试剂列表
   * @param {string} type 试剂的类型，immunohistochemical：免疫组化，dye：特殊试剂
   * @return {Promise}
   */
  reagentList(type, params) {
    return Vue.http.get(`${baseUrl}/dict/${type}`, {params: params});
  }

  /**
   * 创建试剂信息
   * @param {Object} data 试剂信息
   * @param {string} type 试剂的类型，immunohistochemical：免疫组化，dye：特殊试剂
   * @return {Promise}
   */
  createReagent(type, data) {
    return Vue.http.post(`${baseUrl}/dict/${type}`, data);
  }

  /**
   * 修改试剂信息
   * @param {string} type 试剂的类型，immunohistochemical：免疫组化，dye：特殊试剂
   * @param {string} id 修改试剂信息的id
   * @param {Object} data 试剂信息
   * @return {Promise}
   */
  patchReagent(type, id, data) {
    return Vue.http.patch(`${baseUrl}/dict/${type}/${id}`, data);
  }

  /**
   * 删除试剂信息
   * @param {string} type 试剂的类型，immunohistochemical：免疫组化，dye：特殊试剂
   * @param {string} id 删除试剂信息的id
   * @return {Promise}
   */
  deleteReagent(type, id) {
    return Vue.http.delete(`${baseUrl}/dict/${type}/${id}`);
  }

  configReagent(type, ids) {
    return Vue.http.patch(`${baseUrl}/dict/${type}`, {id: ids});
  }

  reagentPackageList(type, params) {
    return Vue.http.get(`${baseUrl}/dict/${type}/package`, {params: params});
  }

  createReagentPackage(type, data) {
    return Vue.http.post(`${baseUrl}/dict/${type}/package`, data);
  }

  patchReagentPackage(type, id, data) {
    return Vue.http.patch(`${baseUrl}/dict/${type}/package/${id}`, data);
  }

  deleteReagentPackage(type, id){
    return Vue.http.delete(`${baseUrl}/dict/${type}/package/${id}`);
  }

}

const reagentService = new ReagentService();

export {reagentService};
