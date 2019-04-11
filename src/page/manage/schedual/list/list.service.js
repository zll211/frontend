import Vue from 'vue';
import {baseUrl} from "@/config/utils";

class SchedualListService {
  /**
   * 新增排班规则
   * @param {Object} data 参数
   * @return {Promise}
   */
  createSchedulingRule(data){
    return Vue.http.post(`${baseUrl}/scheduling_rule`, data);
  }

  schedualList(params) {
    return Vue.http.get(`${baseUrl}/scheduling`, {params: params});
  }
}

export const schedualListService = new SchedualListService();
