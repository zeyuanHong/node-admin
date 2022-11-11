const url = "/";
const api = {
  login: `${url}api/login`,
  getPro: `${url}api/getBlogs`,
  getAdminUserList: `${url}api/getUsers`,
  addCreateAdminUser: `${url}api/saveUser`,
  delAdminUser: `${url}api/delUser`,
  updateAdminUser: `${url}api/upDateUser`,
  addpro: `${url}api/saveBlog`,
  adddetailimg: `${url}api/adddetailimg`,
  deldetailimg: `${url}api/deldetailimg`,
  delPro: `${url}api/delBlog`,
  getDetail: `${url}api/getDetail`,
  updatepro: `${url}api/updateBlog`,
  
};
export const staticUrl = "http://127.0.0.1:3080";
export default api;
