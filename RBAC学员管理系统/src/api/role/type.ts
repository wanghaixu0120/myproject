// 获取角色列表接口返回 的数据类型
export interface getRoleListResponseData{
  status:number,
  data?:roleInfoData[],
  msg?:string
}
// 服务器返回角色信息中data选项的数据类型
export interface roleInfoData{
  _id?:string,
  name:string,
  menus?:string[],
  create_time:number,
  __v:number,
  auth_time?:number,
  auth_name?:string
}
// 添加角色返回的数据类型
export interface addRoleResponseData{
  status:number,
  data?:roleInfoData,
  msg?:string
}