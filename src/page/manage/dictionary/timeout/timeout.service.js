import Vue from 'vue';
import {baseUrl} from '@/config/utils';

class TimeoutService {

  timeoutList(params) {
    return Vue.http.get(`${baseUrl}/setting/get`, {params: params});
  }

  setTimeout(data) {
    return Vue.http.post(`${baseUrl}/setting`, data);
  }

}

export const timeoutService = new TimeoutService();
