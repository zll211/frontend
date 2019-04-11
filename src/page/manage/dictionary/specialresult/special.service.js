import Vue from 'vue';
import {baseUrl} from '@/config/utils';

class SpecialResultService {

  getSpecialResult(params) {
    return Vue.http.get(`${baseUrl}/setting/get`, {params: params});
  }

  setSpecialResult(data) {
    return Vue.http.post(`${baseUrl}/setting`, data);
  }

}

export const specialResultService = new SpecialResultService();
