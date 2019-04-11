import Vue from 'vue';
import {baseUrl} from '@/config/utils';

class MachineService {
  /**
   * 获取机器设置列表
   * @param params 机器标识
   * @returns {*}
   */
  machineList(params) {
    return Vue.http.get(`${baseUrl}/default_machine`, {params: params});
  }

  /**
   * 设置默认机器
   * @param data 机器标识 机器名称
   * @returns {*}
   */
  setMachine(params) {
    return Vue.http.post(`${baseUrl}/default_machine`, params);
  }

  /**
   * 获取所有机器资产
   * @param params
   * @returns {*}
   */
  getAssets(params) {
    return Vue.http.get(`${baseUrl}/organization_asset_list`,{params:params});
  }

}

export const machineService = new MachineService();
