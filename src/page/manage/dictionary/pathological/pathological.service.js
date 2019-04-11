import Vue from 'vue';
import {baseUrl} from '@/config/utils';

class PathologicalService {

  pathologicalList(params) {
    return Vue.http.get(`${baseUrl}/setting/get`, {params: params});
  }

  setPathological(data) {
    return Vue.http.post(`${baseUrl}/setting`, data);
  }

}

export const pathologicalService = new PathologicalService();
