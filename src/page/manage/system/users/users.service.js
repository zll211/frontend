import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * @class
 * 用户管理服务
 */
class UserService {

  /**
   * 获取用户列表
   * @return {Promise}
   */
  userList(params) {
    return Vue.http.get(`${baseUrl}/users?include=organization,roles`,{params:params});
  }

  /**
   * 获取用户详情
   * @param {number} id 用户id
   * @return {Promise}
   */
  userInfo(id) {
    return Vue.http.get(`${baseUrl}/users/${id}?include=organization,roles`);
  }

  /**
   * 创建用户
   * @param {Object} data 用户参数
   * @return {Promise}
   */
  createUser(data) {
    return Vue.http.post(`${baseUrl}/users`, data);
  }

  /**
   * 修改用户
   * @param {number} id 用户id
   * @param {Object} data 用户参数
   * @return {Promise}
   */
  patchUser(id, data) {
    return Vue.http.patch(`${baseUrl}/users/${id}`, data);
  }

  /**
   * 批量删除用户
   * @param {Object} data 用户id列表对象
   * @param {Array} data.id 用户id列表
   * @return {Promise}
   */
  deleteUser(data) {
    return Vue.http.delete(`${baseUrl}/users`, {body: data});
  }

  userPermission(){
    return Vue.http.get(`${baseUrl}/user/permission`);
  }

  userNameCheck(params) {
    return Vue.http.get(`${baseUrl}/user_check_unique`,{params:params});
  }

}


const userService = new UserService();

export {
  userService,
}
