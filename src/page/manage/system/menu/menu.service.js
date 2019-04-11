import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * @class
 * 菜单管理服务
 */
class MenuService {

  /**
   * 获取菜单列表
   * @return {Promise}
   */
  menuList() {
    return Vue.http.get(`${baseUrl}/menu`);
  }

  /**
   * 获取菜单详情
   * @param {number} id 菜单id
   * @return {Promise}
   */
  menuInfo(id) {
    return Vue.http.get(`${baseUrl}/menu/${id}`);
  }

  /**
   * 创建菜单
   * @param {Object} data 菜单参数
   * @return {Promise}
   */
  createMenu(data) {
    return Vue.http.post(`${baseUrl}/menu`, data);
  }

  /**
   * 修改菜单
   * @param {number} id 菜单id
   * @param {Object} data 菜单参数
   * @return {Promise}
   */
  patchMenu(id, data) {
    return Vue.http.patch(`${baseUrl}/menu/${id}`, data);
  }

  /**
   * 批量删除菜单
   * @param {Object} data 菜单id列表对象
   * @param {Array} data.id 菜单id列表
   * @return {Promise}
   */
  deleteMenu(data) {
    return Vue.http.delete(`${baseUrl}/menu`, {body: data});
  }

  moveMenu(params) {
    return Vue.http.post(`${baseUrl}/menu_rank`,params);
  }

}


const menuService = new MenuService();

export {
  menuService,
}
