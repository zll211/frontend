import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class NSpecimenService {

  constructor(){}

  /**
   *
   * @param caseType 病理类型
   * @param pageSize 分页数量
   * @param page 页数
   * @returns {*}
   */
  getRegisterTable(params) {
    return Vue.http.get(`${baseUrl}/draw_material?include=specimen`,{params: params});
  }

  /**
   *
   * @param id 删除的病理id
   * @returns {*}
   */
  delRegister(id) {
    return Vue.http.delete(`${baseUrl}/case/${id}`);
  }

  getTableCount() {
    return Vue.http.get(`${baseUrl}/case_status_count_routine`);
  }
}

const nSpecimenService = new NSpecimenService();
export {nSpecimenService};
