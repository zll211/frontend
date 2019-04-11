import Vue from 'vue';
import {baseUrl} from '@/config/utils';

class ProcessService {
  processConfigList(params) {
    return Vue.http.get(`${baseUrl}/setting/get`, {params: params});
  }

  setProcessConfig(data) {
    return Vue.http.post(`${baseUrl}/setting`, data);
  }
}

export const processService = new ProcessService();
