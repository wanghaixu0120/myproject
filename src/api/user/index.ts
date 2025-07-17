import request from "@/utils/request"

import type {
  //登录相关
  loginFormData,
  //请求相关
  loginResponseData,
  //校验与修改密码携带的参数
  pwdData,
  //校验密码接口返回的类型
  checkPwdResponseData,
  userListFormData,
  userAllResponseData,
  userListResponseData,
  userInfoData
} from "./type"

enum API {
  //登录
  LOGIN_URL="/login",
  //退出
  LOGOUT_URL = "/logout",
  //修改密码
  CHECK_PWD_URL = "/manage/user/pwd",
  //校验密码
  UPDATE_PWD_URL = "/manage/user/pwd",
  USER_ALL_URL = "/manage/user/all",
  USER_LIST_URL = "/manage/user/list",
  USER_ADD_URL = "/manage/user/add",
  USER_GET_ID_URL="/manage/user/find",
  USER_UPDATE_URL = "/manage/user/update",
  USER_DELETE_URL = "/manage/user/delete",
}
// 登陆
export const reqLogin = (data:loginFormData)=>
  request.post<any,loginResponseData>(API.LOGIN_URL,data);
// 退出登陆
export const reqLogOut = ()=>
  request.post<any,any>(API.LOGOUT_URL)
// 校验密码
export const reqCheckPwd = 
  (data:pwdData)=>request.post<any,checkPwdResponseData>(API.CHECK_PWD_URL,data)
//修改密码
export const reqUpdatePwd = 
  (data:pwdData)=>request.put<any,checkPwdResponseData>(API.UPDATE_PWD_URL,data)

export const reqUserAll = ()=>
  request.get<any,userAllResponseData>(API.USER_ALL_URL)

export const reqUserList = (data:userListFormData)=>
  request.post<any,userListResponseData>(API.USER_LIST_URL,data)

export const reqUserAdd = (data:userInfoData)=>
  request.post<any,loginResponseData>(API.USER_ADD_URL,data)

export const reqUserById = (_id:string)=>
  request.get<any,loginResponseData>(API.USER_GET_ID_URL + `?_id=${_id}`)

export const reqUserUpdate = (data:userInfoData)=>
  request.post<any,loginResponseData>(API.USER_UPDATE_URL,data)

export const reqUserDelete = (userId:string)=>
  request.post<any,loginResponseData>(API.USER_DELETE_URL,{userId})