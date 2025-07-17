import {defineStore} from "pinia"
import {getRoleList,addRole,updateRole} from "@/api/role"
import {RoleState} from "./type/roleType"
import type {getRoleListResponseData,roleInfoData,addRoleResponseData} from "@/api/role/type"
let useRoleStore = defineStore("Role",{
  state:():RoleState=>{
    return {
      roles:[]
    }
  },
  actions:{
    //
    async roleList(){
      let result:getRoleListResponseData = await getRoleList();
      if(result.status ===0){
        this.roles = result.data;
        return "OK"
      }else{
        return Promise.reject(new Error(result.msg))
      }
    },
    //添加角色
    async useAddRole(data:roleInfoData){
      let result:addRoleResponseData = await addRole(data);
      if(result.status === 0){
        return "OK"
      }else{
        return Promise.reject(new Error(result.msg))
      }
    },
    //更新角色
    async useUpdateRole(data:roleInfoData){
      let result:addRoleResponseData = await updateRole(data)
      if(result.status === 0){
        return "OK"
      }else{
        return Promise.reject(new Error(result.msg))
      }
    }
  },
  getters:{}
})
export default useRoleStore