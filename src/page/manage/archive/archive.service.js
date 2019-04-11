import Vue from 'vue';

import {baseUrl} from '@/config/utils';

class ArchiveService {

  constructor(){}


  archiveList(params) {
    return Vue.http.get(`${baseUrl}/case`,{params: params});
  }

  archiveInfo(id) {
    return Vue.http.get(`${baseUrl}/files/${id}?include=locker`);
  }

  filesStatusCount () {
    return Vue.http.get(`${baseUrl}/files_status`);
  }

  /**
   * 获取自动归档病理数
   * @returns {*}
   */
  getAutoArchiveNum() {
    return Vue.http.get(`${baseUrl}/qrcodes`);
  }

  /**
   * 归档接口
   * @param params 手动归档需传cases
   * @returns {*}
   */
  filesArchive(params) {
    return Vue.http.post(`${baseUrl}/files`,params)
  }

}

const archiveService = new ArchiveService();
export {archiveService};
