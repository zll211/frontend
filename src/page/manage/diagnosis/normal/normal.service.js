import Vue from 'vue';
import {baseUrl} from "@/config/utils";

/**
 * @class
 */
class DNormalService {

  /**
   * 查询诊断列表
   * @param {Object} params 参数
   * @return {Promise}
   */
  caseList(params) { //report
    return Vue.http.get(`${baseUrl}/case?include=ext,specimen,specimen.paraffinBlock,img,report`, {params: params});
  }

  reportCount(params) {
    return Vue.http.get(`${baseUrl}/report_status_count`, {params: params});
  }

  /**
   * 诊断信息录入
   * @param {Object} data 诊断上传信息
   * @return {Promise}
   */
  postDiagnosis(data) {
    return Vue.http.post(`${baseUrl}/report`, data);
  }

  postTCTDiagnosis(data) {
    return Vue.http.post(`${baseUrl}/tct_report`, data);
  }

  /**
   * 获取病例信息
   * @param {Number} id 病理号id
   * @return {Promise}
   */
  caseInfo(id) {
    return Vue.http.get(`${baseUrl}/case/${id}?include=ext,consultations,specimen,specimen.paraffinBlock,sectionPath,img,technicalAdvice,specialProductionRoutine,specialProductionCell&has_collection=1&has_followup=1&has_opinion=1&has_order=1`);
  }

  /**
   *  获取诊断信息
   * @param {Number}id 病理号id
   * @return {Promise}
   */
  diagnosisInfo(id) {
    return Vue.http.get(`${baseUrl}/report/${id}`);
  }

  /**
   *  获取诊断信息
   * @param {Number}id 病理号id
   * @return {Promise}
   */
  tctDiagnosisInfo(id) {
    return Vue.http.get(`${baseUrl}/tct_report/${id}`);
  }

  /**
   * 获取报告pdf
   * @param {Number}id 病理号id
   * @return {string}
   */
  /*viewReport(id) {
    return `${baseUrl}/pdf/${id}`;
  }*/
  viewReport(id) {
    return Vue.http.get(`${baseUrl}/pdf/${id}`,{responseType:'blob'});
  }
  /**
   * 签发报告
   * @param {Number}id 病理号id
   * @return {Promise}
   */
  filedReport(id) {
    return Vue.http.post(`${baseUrl}/report/filed/${id}`);
  }

  filedTCTReport(id) {
    return Vue.http.post(`${baseUrl}/tct_report_print`, {id: id});
  }

  /**
   * 下医嘱
   * @param {Object} data  医嘱内容
   * @return {Promise}
   */
  doctorOrder(data) {
    return Vue.http.post(`${baseUrl}/advice`, data);
  }

  /**
   * 查询特检医嘱列表
   * @param {Object} params 参数
   * @return {Promise}
   */
  adviceList(params) {
    return Vue.http.get(`${baseUrl}/advice`, {params: params});
  }

  /**
   * 获取镜下所见和诊断模板列表
   * @param {number} id 病理号id
   * @return {Promise}
   */
  reportTemplateInfo(id) {
    return Vue.http.get(`${baseUrl}/report/dict_diagnostic/${id}?include=dictPathologicDiagnosis`);
  }

  /**
   * 执行特检医嘱
   * @param {number} id 特检医嘱id
   * @param {Object} data 特检医嘱参数
   * @return {Promise}
   */
  excuteAdvice(id, data) {
    return Vue.http.patch(`${baseUrl}/advice/${id}`, data);
  }

  /**
   * 添加特检医嘱结果
   * @param {number} id 特检医嘱id
   */
  changeSocialResult(data) {
    return Vue.http.post(`${baseUrl}/advice/changeSocialResult`, data);
  }

  /**
   * 审核
   * @param {Object} data 审核参数
   * @return {Promise}
   */
  auditing(data) {
    return Vue.http.post(`${baseUrl}/edit_pathology_info`, data);
  }

  getImageInfo(file) {
    return Vue.http.get(`${baseUrl}/slide/info`, {params: {file: file}});
  }

  remoteConsultation(id) {
    return Vue.http.post(`${baseUrl}/remote_consultation_send`,{pathology_id:id});
  }

  bindTemplate(params) {
    return Vue.http.post(`${baseUrl}/pdf/bindTemplate`,params);
  }


  uploadImage(params) {
    return Vue.http.post(`${baseUrl}/image`, params);
  }

  processConfigList(params) {
    return Vue.http.get(`${baseUrl}/setting/get`, {params: params});
  }

  setFollow(params) {
    return Vue.http.post(`${baseUrl}/followups`,params);
  }

  cancelFollow(params) {
    return Vue.http.delete(`${baseUrl}/followups`,{body: params});
  }

  /**
   * 提交科内会诊申请
   * @param params
   * @returns {*}
   */
  consultations(params) {
    return Vue.http.post(`${baseUrl}/consultations`,params);
  }

  /**
   * 科内会诊列表
   */
  consultationList(params) {
    return Vue.http.get(`${baseUrl}/consultations`,{params:params});
  }

  /**
   * 更新会诊意见
   */
  updateConsultation(params) {
    return Vue.http.patch(`${baseUrl}/consultations`,params);
  }

  /**
   * 获取科内会诊医生
   * @param params 科内会诊权限id
   * @returns {*}
   */
  getDoctorById(params) {
    return Vue.http.get(`${baseUrl}/consultations/users`,{params:params});
  }

  sectionAssess(params) {
    return Vue.http.post(`${baseUrl}/sectionAssess`,params);
  }

  consultationsStatus() {
    return Vue.http.get(`${baseUrl}/consultations_status`);
  }
}

export const dNormalService = new DNormalService();
