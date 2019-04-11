import Vue from 'vue';
import {baseUrl} from "@/config/utils";

class SchedualCycleService {
  /**
   * 周期列表
   * @return {Promise}
   */
  cycleList() {
    return Vue.http.get(`${baseUrl}/scheduling_cycle`);
  }

  cycle(id) {
    return Vue.http.get(`${baseUrl}/scheduling_cycle/${id}`);
  }

  addCycle(data) {
    return Vue.http.post(`${baseUrl}/scheduling_cycle`, data);
  }

  editCycle(id, data) {
    return Vue.http.patch(`${baseUrl}/scheduling_cycle/${id}`, data);
  }

  deleteCycle(id) {
    return Vue.http.delete(`${baseUrl}/scheduling_cycle/${id}`);
  }


}

export const schedualCycleService = new SchedualCycleService();
