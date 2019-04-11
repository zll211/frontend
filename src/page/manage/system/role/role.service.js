import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * @class
 * 角色管理服务
 */
class RoleService {

  /**
   * 获取角色列表
   * @return {Promise}
   */
  roleList() {
    return Vue.http.get(`${baseUrl}/roles`);
  }

  /**
   * 获取角色详情
   * @param {number} id 角色id
   * @return {Promise}
   */
  roleInfo(id) {
    return Vue.http.get(`${baseUrl}/roles/${id}`);
  }

  /**
   * 创建角色
   * @param {Object} data 角色参数
   * @return {Promise}
   */
  createRole(data) {
    return Vue.http.post(`${baseUrl}/roles`, data);
  }

  /**
   * 修改角色
   * @param {number} id 角色id
   * @param {Object} data 角色参数
   * @return {Promise}
   */
  patchRole(id, data) {
    return Vue.http.patch(`${baseUrl}/roles/${id}`, data);
  }

  /**
   * 批量删除角色
   * @param {Object} data 角色id列表对象
   * @param {Array} data.id 角色id列表
   * @return {Promise}
   */
  deleteRole(data) {
    return Vue.http.delete(`${baseUrl}/roles`, {body: data});
  }

}


const roleService = new RoleService();

export {
  roleService,
}
