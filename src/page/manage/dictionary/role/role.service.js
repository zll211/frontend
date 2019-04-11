import Vue from 'vue';
import {baseUrl} from '@/config/utils';

class RoleService {

  roleConfigList(params) {
    return Vue.http.get(`${baseUrl}/setting/get`, {params: params});
  }

  setRoleConfig(data) {
    return Vue.http.post(`${baseUrl}/setting`, data);
  }

}

export const roleConfigService = new RoleService();
