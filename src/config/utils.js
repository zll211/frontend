const baseRoutes = [
  '/404', '/login', '/error',
];
let baseUrl = '';
let slideViewUrl = '';
let baseImgPath;

if (process.env.NODE_ENV === 'development') {
  baseUrl = '/api';
  slideViewUrl = '';
  baseImgPath = '';
} else {
  baseUrl = window.location.origin+ '/api';
  slideViewUrl = window.location.origin;
  baseImgPath = '';
}

const formatDate = (date, type = '/') => {
  const {toString} = Object.prototype;
  if (!date) return;
  if (date::toString() === '[Object String]') {
    date = new date();
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join(type);
};

const formatDateTime = (date, type = '-') => {
  if (!date) return;
  return formatDate(date, type) + ' ' + formatTime(date);
};

const formatTime = (date) => {
  const {toString} = Object.prototype;
  if (!date) return;
  if (date::toString() === '[Object String]') {
    date = new date(date);
  }
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

const strSplice = (str, index, count, newstr = '') => {
  if (!str) return '';
  if (index >= 0) {
    return str.slice(0, index) + newstr + str.slice(index + count);
  } else {
    return str.slice(0, str.length + index) + newstr + str.slice(str.length + index + count);
  }
};

const flatteningArray = (list, newList = []) => {
  list.forEach((item) => {
    if (item.children && item.children.length > 0) {
      flatteningArray(item.children, newList);
    } else {
      newList.push(item.uri);
    }
  });
  return newList;
};

const areaArrToString = (areaIndexArr, areaArr) => {
  if (!areaArr && !Array.isArray(areaArr)) return '';
  let areaIndex = areaIndexArr.splice(0, 1)[0];
  if (areaIndex) {
    const area = areaArr.find((item) => item.value === areaIndex);
    if (area) {
      return area.label + areaArrToString(areaIndexArr, area.children);
    }
  }
  return ''
};

const encodeQueryData = (data) => {
  const {hasOwnProperty} = Object.prototype;
  let ret = [];
  for (let d in data) {
    if (data::hasOwnProperty(d)) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
  }
  return ret.join('&');
};

const debounce = (func, delay) =>{
  let timer;
  return function(...args){
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export {
  baseRoutes,
  baseUrl,
  slideViewUrl,
  encodeQueryData,
  formatTime,
  baseImgPath,
  formatDateTime,
  flatteningArray,
  formatDate,
  areaArrToString,
  strSplice,
  formatNumber,
  debounce,
};

