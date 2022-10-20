const url = "";
const api = {
  login: `${url}api/login`,
  addCreateAdminUser: `${url}api/saveUser`,
  getAdminUserList: `${url}api/getUsers`,
  delAdminUser: `${url}api/delUser`,
  updateAdminUser: `${url}api/upDateUser`,
  addpro: `${url}api/saveBlog`,
  adddetailimg: `${url}api/adddetailimg`,
  deldetailimg: `${url}api/deldetailimg`,
  getPro: `${url}api/getBlogs`,
  delPro: `${url}api/delBlog`,
  getDetail: `${url}api/getDetail`,
  
  getOrdersEchartData: `${url}dapi/vapi/getOrdersEchartData`,
  usersList: `${url}dapi/vapi/usersList`,
  updatepro: `${url}dapi/vapi/updatepro`,
  getAllProType: `${url}dapi/vapi/getAllProType`,
  getOrdersList: `${url}dapi/vapi/getOrdersList`,
  updateOrders: `${url}dapi/vapi/updateOrders`,
};
export const staticUrl = "http://localhost:3080";
export default api;
