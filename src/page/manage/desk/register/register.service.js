import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class RegisterService {
  /**
   * @constructor
   */
  constructor() {}

  /**
   * 获取已登记表格
   * @param {string} caseType 病理类型 （常规，冰冻，细胞）
   * @returns {*}
   */
  getRegisterTable(params) {
    return Vue.http.get(`${baseUrl}/case`,{params:params})
  }
  /**
   * 提交表单信息
   * @param {object} params 表单信息
   * @returns {*}
   */
  submitRegisterForm(params) {
    return Vue.http.post(`${baseUrl}/case`, params);
  }

  /**
   * 获取表单信息
   * @param {string} id 病理号
   * @returns {*}
   */
  registerInfo(id) {
    return Vue.http.get(`${baseUrl}/case/${id}?include=ext,specimen,paraffinBlock,paraffinSection&has_collection=1`);
  }

  /**
   * 修改表单信息
   * @param {string} id 病理号
   * @param {object} params 表单信息
   * @returns {*}
   */
  editInfo(id,params) {
    return Vue.http.patch(`${baseUrl}/case/${id}`,params);
  }

  /**
   * 删除病理信息
   * @param {string} id 病理号
   * @returns {*}
   */
  delRegister(id) {
    return Vue.http.delete(`${baseUrl}/case/${id}`);
  }

  /**
   * 获取病理号
   * @param prefix
   * @returns {*}
   */

  getCaseNo(prefix) {
    return Vue.http.get(`${baseUrl}/case_get_no/${prefix}`);
  }

  /**
   * 同名检测
   * @param params 姓名 name
   * @returns {*}
   */
  getSameNameList(params) {
    return Vue.http.get(`${baseUrl}/name_retrieval`,{params:params});
  }

  /**
   * 打印回执单
   * @param params
   * @returns {*}
   */
  receiptPrint(params) {
    return Vue.http.post(`${baseUrl}/receipt_print`,params,{responseType:'blob'});
  }

}

const registerService = new RegisterService();

export {registerService};
