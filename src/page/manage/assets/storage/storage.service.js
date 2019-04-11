import Vue from 'vue';
import {baseUrl} from "../../../../config/utils";

class StorageService {
  constructor() {}

  addAssets(params) {
    return Vue.http.post(`${baseUrl}/organization_asset`,params);
  }

  getAssets(params) {
    return Vue.http.get(`${baseUrl}/organization_asset?include=assetsHandle`,{params:params});
  }

  deleteAssets(id) {
    return Vue.http.delete(`${baseUrl}/organization_asset`,{body: {id:id}});
  }

  editAssets(id,params) {
    return Vue.http.patch(`${baseUrl}/organization_asset/${id}`,params);
  }

  handleAssets(params) {
    return Vue.http.post(`${baseUrl}/assets_handle/changeStatus`,params);
  }

  handleRecord(id,params) {
    return Vue.http.get(`${baseUrl}/assets_handle/${id}`,{params:params});
  }

  changeAssetsStatus(id) {
    return Vue.http.post(`${baseUrl}/change_asset_status`,{id: id});
  }

}

const storageService = new StorageService();
export {storageService};
