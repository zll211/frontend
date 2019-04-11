import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * 诊断模板数据服务
 * @class
 */
class DiagnosisTemplateService {

  /**
   * 获取诊断模板列表
   * @return {Promise}
   */
  diagnosisTemplateList() {
    return Vue.http.get(`${baseUrl}/dict_diagnostic`);
  }

  /**
   * 创建诊断模板
   * @param {Object} data 诊断模板的信息
   * @param {string} data.dict_diagnostic_name  新增诊断模板的名称
   * @param {number=} data.parent_id 新增诊断模板的上级id
   * @return {Promise}
   */
  createDiagnosisTemplate(data) {
    return Vue.http.post(`${baseUrl}/dict_diagnostic`, data);
  }

  /**
   * 修改诊断模板
   * @param {number} id 诊断模板的id
   * @param {Object} data 诊断模板的信息
   * @param {string} data.dict_diagnostic_name  新增诊断模板的名称
   * @param {number=} data.parent_id 新增诊断模板的上级id
   * @return {Promise}
   */
  patchDiagnosisTemplate(id, data) {
    return Vue.http.patch(`${baseUrl}/dict_diagnostic/${id}`, data);
  }

  /**
   * 删除诊断模板
   * @param {Array} data  删除诊断模板的id列表
   * @param {Array|number} data.id  删除诊断模板的id列表或单个id
   * @return {Promise}
   */
  deleteDiagnosisTemplate(data) {
    return Vue.http.delete(`${baseUrl}/dict_diagnostic`, {body: data});
  }

  /**
   * 获取单个诊断模板内容
   * @param {Number} id  病理号id
   * @return {*} {Promise}
   */
  diagnosisTemplateInfo(id) {
    return Vue.http.get(`${baseUrl}/dict_diagnostic/${id}?include=dictPathologicDiagnosis`);
  }

}

const diagnosisTemplateService = new DiagnosisTemplateService();

export {diagnosisTemplateService};
