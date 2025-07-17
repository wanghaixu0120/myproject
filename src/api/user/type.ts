export interface loginFormData{
  username:string,
  password:string
}
// interface dataType{
//   token?:string | null
// }

export interface loginResponseData{
  status:number,
  // data?:dataType,
  data?:userInfoData,
  msg?:string
}
interface userInfoData{
  _id:string,
  username:string,
  name?:string,
  password:string,
  phone?:string,
  role_id?:string,
  create_time:number,
  token?:string,
  __v:number,
  role:userRoleData,
}
interface userRoleData{
  _id?:string,
  name?:string,
  menus:string[],
  create_time?:number,
  __v?:number,
  auth_time?:number,
  auth_name?:string
}
export interface userInfoResponseData{
  status:number,
  data:userInfoData
}
// 校验与修改密码携带的参数
export interface pwdData{
  userId:string,
  password:string
}
// 校验密码接口返回的类型
export interface checkPwdResponseData{
  status:number,
  data?:userInfoData,
  msg?:string
}

export interface userListFormData{
  page:number,
  size:number
}
export interface userAllResponseData{
  status:number,
  data?:userInfoData[],
  msg?:string
}
export interface userListResponseData{
  status:number,
  data?:userListData,
  msg?:string
}
export interface userListData{
  data:userInfoData[],
  roles:[],
  total:number
}