import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * @class
 * 组织管理服务
 */
class OrganizationService {

  /**
   * 获取组织列表
   * @return {Promise}
   */
  organizationList() {
    return Vue.http.get(`${baseUrl}/organization`);
  }

  /**
   * 获取组织详情
   * @param {number} id 组织id
   * @return {Promise}
   */
  organizationInfo(id) {
    return Vue.http.get(`${baseUrl}/organization/${id}`);
  }

  /**
   * 创建组织
   * @param {Object} data 组织参数
   * @return {Promise}
   */
  createOrganization(data) {
    return Vue.http.post(`${baseUrl}/organization`, data);
  }

  /**
   * 修改组织
   * @param {number} id 组织id
   * @param {Object} data 组织参数
   * @return {Promise}
   */
  patchOrganization(id, data) {
    return Vue.http.patch(`${baseUrl}/organization/${id}`, data);
  }

  /**
   * 批量删除组织
   * @param {Object} data 组织id列表对象
   * @param {Array} data.id 组织id列表
   * @return {Promise}
   */
  deleteOrganization(data) {
    return Vue.http.delete(`${baseUrl}/organization`, {body: data});
  }

}


const organizationService = new OrganizationService();

export {
  organizationService,
}
