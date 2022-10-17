const url = "";
const api = {
  login: `${url}api/login`,
  addCreateAdminUser: `${url}api/saveUser`,
  getOrdersEchartData: `${url}dapi/vapi/getOrdersEchartData`,
  getAdminUserList: `${url}dapi/vapi/getAdminUserList`,
  updateAdminUser: `${url}dapi/vapi/updateAdminUser`,
  delAdminUser: `${url}dapi/vapi/delAdminUser`,
  usersList: `${url}dapi/vapi/usersList`,
  getPro: `${url}dapi/vapi/getPro`,
  addpro: `${url}dapi/vapi/addpro`,
  getDetail: `${url}dapi/vapi/getDetail`,
  updatepro: `${url}dapi/vapi/updatepro`,
  delPro: `${url}dapi/vapi/delPro`,
  getAllProType: `${url}dapi/vapi/getAllProType`,
  adddetailimg: `${url}dapi/vapi/adddetailimg`,
  deldetailimg: `${url}dapi/vapi/deldetailimg`,
  getOrdersList: `${url}dapi/vapi/getOrdersList`,
  updateOrders: `${url}dapi/vapi/updateOrders`,
};
export const staticUrl = "http://localhost:3080";
export default api;
