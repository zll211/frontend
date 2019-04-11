import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * 标本模板数据服务
 * @class
 */
class SpecimenTemplateService {

  /**
   * 获取标本模板列表
   * @return {Promise}
   */
  specimenTemplateList() {
    return Vue.http.get(`${baseUrl}/dict_specimen?include=dictGiganticInspection`);
  }

  /**
   * 创建标本模板
   * @param {Object} data 标本模板的信息
   * @param {string} data.dict_specimen_name  新增标本模板的名称
   * @param {number=} data.parent_id 新增标本模板的上级id
   * @return {Promise}
   */
  createSpecimenTemplate(data) {
    return Vue.http.post(`${baseUrl}/dict_specimen`, data);
  }

  /**
   * 修改标本模板
   * @param {number} id 标本模板的id
   * @param {Object} data 标本模板的信息
   * @param {string} data.dict_specimen_name  新增标本模板的名称
   * @param {number=} data.parent_id 新增标本模板的上级id
   * @return {Promise}
   */
  patchSpecimenTemplate(id, data) {
    return Vue.http.patch(`${baseUrl}/dict_specimen/${id}`, data);
  }

  /**
   * 删除标本模板
   * @param {Array} data  删除标本模板的id列表
   * @param {Array|number} data.id  删除标本模板的id列表或单个id
   * @return {Promise}
   */
  deleteSpecimenTemplate(data) {
    return Vue.http.delete(`${baseUrl}/dict_specimen`, {body: data});
  }

  /**
   * 删除巨检模板
   * @param {number} id  巨检模板的id
   * @return {Promise}
   */
  deleteGiganticInspection(id) {
    return Vue.http.delete(`${baseUrl}/dict_gigantic_inspection/${id}`);
  }

  /**
   * 创建巨检模板
   * @param {Object} data 巨检模板的信息
   * @param {string} data.gigantic_inspection_info  巨检模板的信息
   * @param {number=} data.dict_specimen_id 巨检模板的关联id
   * @return {Promise}
   */
  createGiganticInspection(data) {
    return Vue.http.post(`${baseUrl}/dict_gigantic_inspection`, data);
  }

  /**
   * 获取细胞标本模板列表
   * @return {Promise}
   */
  cellSpecimenTemplateList() {
    return Vue.http.get(`${baseUrl}/dict_cell_specimen`);
  }

  /**
   * 创建细胞标本模板
   * @param {Object} data 细胞标本模板的信息
   * @param {string} data.dict_specimen_name  细胞标本模板的名称
   * @param {number=} data.parent_id 细胞标本模板的上级id
   * @return {Promise}
   */
  createCellSpecimenTemplate(data) {
    return Vue.http.post(`${baseUrl}/dict_cell_specimen`, data);
  }

  /**
   * 修改细胞标本模板
   * @param {number} id 细胞 标本模板的id
   * @param {Object} data 细胞标本模板的信息
   * @param {string} data.dict_specimen_name  细胞标本模板的名称
   * @param {number=} data.parent_id 细胞标本模板的上级id
   * @return {Promise}
   */
  patchCellSpecimenTemplate(id, data) {
    return Vue.http.patch(`${baseUrl}/dict_cell_specimen/${id}`, data);
  }

  /**
   * 删除细胞标本模板
   * @param {Object} data 细胞标本模板的id列表对像
   * @param {Array|number} data.id  细胞标本模板的id列表或单个id
   * @return {Promise}
   */
  deleteCellSpecimenTemplate(data) {
    return Vue.http.delete(`${baseUrl}/dict_cell_specimen`,  {body: data});
  }


}

const specimenTemplateService = new SpecimenTemplateService();

export {specimenTemplateService};
