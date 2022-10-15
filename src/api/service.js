import { GET, POST } from "./axios";
import api from "./api";

export function login(data, callback) {
  POST(api.login, data, callback);
}

export function getOrdersEchartData(callback) {
  GET(api.getOrdersEchartData, callback);
}
 
export function getAdminUserList(data,callback) { //页码通过data传过来
  GET(`${api.getAdminUserList}?page=${data.page}`, callback);
}

export function addCreateAdminUser(data, callback) {
  POST(api.addCreateAdminUser, data, callback);
}

export function updateAdminUser(data, callback) {
  POST(api.updateAdminUser, data, callback);
}

export function delAdminUser(data, callback) {
  GET(`${api.delAdminUser}?id=${data.id}`, callback);
}

export function deldetailimg(data, callback) {
  POST(api.deldetailimg, data, callback);
}

export function addpro(data, callback) {
  POST(api.addpro, data, callback);
}

export function usersList(data, callback) {
  POST(api.usersList, data, callback);
}

export function getPro(data, callback) {
  POST(api.getPro, data, callback);
}

export function delPro(data, callback) {
  POST(api.delPro, data, callback);
}

export function getAllProType(callback) {
  GET(api.getAllProType, callback);
}

export function updatepro(data, callback) {
  POST(api.updatepro, data, callback);
}

export function getDetail(data, callback) {
  GET(`${api.getDetail}?id=${data.id}`, callback);
}

export function getOrdersList(data, callback) {
  POST(api.getOrdersList, data, callback);
}

export function updateOrders(data, callback) {
  POST(api.updateOrders, data, callback);
}
