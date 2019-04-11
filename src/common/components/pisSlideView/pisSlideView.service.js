import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * @class
 */
class PisSlideViewService {

  getImageInfo(fileName) {
    return Vue.http.get(`${baseUrl}/slide/info`, {params: {file: fileName}});
  }


  labelList(fileName) {
    return  Vue.http.get(`${baseUrl}/image_annotation`, {params: {path: fileName}});
  }

  saveLabel(content,fileName) {
    return  Vue.http.post(`${baseUrl}/image_annotation`,  [content], {params: {path: fileName}});
  }

  deleteLabel(id,fileName) {
    return  Vue.http.delete(`${baseUrl}/image_annotation`, {params: {path: fileName}, body: {id}});
  }

  modifyLabel(id, content,fileName) {
    return  Vue.http.patch(`${baseUrl}/image_annotation`, [Object.assign({id:id},content)], {params: {path: fileName}});
  }

  navigatorPointList(fileName) {
    return  Vue.http.get(`${baseUrl}/image_annotation/above`, {params: {path: fileName}});
  }

  navigatorPoint(content, fileName) {
    return  Vue.http.post(`${baseUrl}/image_annotation/above`, content, {params: {path: fileName}});
  }
}

const pisSlideViewService = new PisSlideViewService();

export {pisSlideViewService};
