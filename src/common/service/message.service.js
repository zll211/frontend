import Vue from 'vue';

/**
 * 基于MessageBox的通用service
 * @class
 */
class MessageBoxService {
  /**
   * 封装了一个基于MessageBox的删除弹框
   * @param {string} title  弹框标题
   * @param {string} content 弹框内容
   * @param {string} [cancelText] 取消按钮文字
   * @param {string} [confirmText] 确定按钮文字
   * @return {Promise<MessageBoxData>}
   */
  delete(title, content, cancelText = '取消', confirmText = '删除') {
    return Vue.prototype.$confirm(
      `<p style="font-size: 20px">${title}</p>
       <p style="font-size: 12px;
       margin-bottom: 30px;color: #7B7B7B">${content}</p>`,
      {
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      center: true,
      dangerouslyUseHTMLString: true,
      showClose: false,
      roundButton: false,
      confirmButtonClass: 'el-button--danger messagebox-button',
      cancelButtonClass: 'el-button--primary messagebox-button',
    });
  }

  /**
   * 封装了一个基于MessageBox的确定弹框
   * @param {string} title  弹框标题
   * @param {string} content 弹框内容
   * @param {string} [cancelText] 取消按钮文字
   * @param {string} [confirmText] 确定按钮文字
   * @return {Promise<MessageBoxData>}
   */
  confirm(title, content, cancelText = '取消', confirmText = '确定') {
    return Vue.prototype.$confirm(
      `<p style="font-size: 20px">${title}</p>
       <p style="font-size: 12px;
       margin-bottom: 30px;color: #7B7B7B">${content}</p>`,
      {
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        center: true,
        dangerouslyUseHTMLString: true,
        showClose: false,
        roundButton: false,
        confirmButtonClass: 'el-button--primary messagebox-button',
        cancelButtonClass: 'el-button--info messagebox-button',
      });
  }

  /**
   *
   * @param {string} title  弹框标题
   * @param {string} content 弹框input提示内容
   * @param {string }[inputPlaceholder] input占位符内容
   * @param {string} [inputValue] input初始内容
   * @param {string} [cancelText] 取消按钮文字
   * @param {string} [confirmText] 确定按钮文字
   * @return {Promise<MessageBoxData>}
   */
  prompt(title, content, inputPlaceholder = '请输入内容', inputValue = '', cancelText = '取消', confirmText = '确定') {
    return Vue.prototype.$prompt(content, title, {
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        showClose: false,
        roundButton: false,
        inputPlaceholder: inputPlaceholder,
        inputValue: inputValue,
        confirmButtonClass: 'el-button--primary messagebox-button',
        cancelButtonClass: 'el-button--danger messagebox-button',
      });
  }
}

const messageBoxService = new MessageBoxService();

export {
  messageBoxService,
};
