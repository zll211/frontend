import Vue from 'vue';
import {baseUrl} from "../../../../config/utils";

class ServiceService {
  constructor() {}

  addService(params) {
    return Vue.http.post(`${baseUrl}/assets_maintain`,params);
  }

  getServiceList(params) {
    return Vue.http.get(`${baseUrl}/assets_maintain?include=assetsMaintainItem.organizationAsset`,{params:params});
  }

  editService(id,params) {
    return Vue.http.patch(`${baseUrl}/assets_maintain/${id}`,params);
  }

  changeStatus(params) {
    return Vue.http.post(`${baseUrl}/assets_maintain/changeStatus`,params);
  }

  servicePrint(params) {
    return Vue.http.post(`${baseUrl}/assetMaintainPdf`,params,{responseType:'blob'});
  }
}

const serviceService = new ServiceService();
export {serviceService};
