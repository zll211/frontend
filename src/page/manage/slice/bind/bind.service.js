import Vue from 'vue';
import {baseUrl} from '@/config/utils';

/**
 * @class
 */
class DBindService {

  /**
   * 查询切片列表
   * @param {Object} params 参数
   * @return {Promise}
   */
  bindList(params) {
    return Vue.http.get(`${baseUrl}/pathologySectionList?include=sectionPath`, {params: params});
  }

  bindCount() {
    return Vue.http.get(`${baseUrl}/sectionBindCount`);
  }

  /**
   * 绑定切片
   * @param {Object} data 参数
   * @return {Promise}
   */
  bindParafinSection(data) {
    return Vue.http.post(`${baseUrl}/sectionBind`, data);
  }

  pathologySectionScan(data) {
    return Vue.http.post(`${baseUrl}/pathologySectionScan`, data);
  }

  upBindParafinSection(data) {
    return Vue.http.delete(`${baseUrl}/untieBind`, {body: data});
  }

  pathList(params) {
    return Vue.http.get(`${baseUrl}/SectionPathList`, {params: params});
  }

  pathologySection(params) {
    return Vue.http.get(`${baseUrl}/pathologySectionShow`, {params: params});
  }

}

export const dBindService = new DBindService();
