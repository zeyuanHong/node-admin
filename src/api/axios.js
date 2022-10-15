import axios from "axios";
import { message } from "antd"; // 引入消息提醒组件
import { showLoading, hideLoading } from "../loading/index";
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    showLoading(); // 请求之前需要显示加载动画，请求完成，需要隐藏加载动画
    // 在发送请求之前做些什么,config是axios的配置
    config.headers = {
      // 统一给请求添头添加Authorization属性。
      Authorization: sessionStorage.getItem("token"),
    };
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    console.log(error);
    return Promise.reject(error);
  }
);

// 封装axios的then方法
function handleOk(res, callback) {
  hideLoading();
  if (res.data.success) {
    // 后端返回成功
    callback(res.data);
  } else {
    // 后端返回失败，就需要显示错误消息。
    message.error(res.data.message);
  }
}
// 封装axios 请求错误执行的方法
function handleError(err) {
  hideLoading();
  message.error(err.message);
}
/**
 *
 * @param {*} url  请求地址
 * @param {*} callback 请求成功的回调函数
 */
export function GET(url, callback) {
  axios
    .get(url)
    .then((data) => handleOk(data, callback))
    .catch(handleError);
}

/**
 *
 * @param {*} url  请求地址
 * @param {*} data 请求发送的数据
 * @param {*} callback 请求成功执行的回调函数
 */
export function POST(url, data, callback) {
  axios
    .post(url, data)
    .then((data) => handleOk(data, callback))
    .catch(handleError);
}
