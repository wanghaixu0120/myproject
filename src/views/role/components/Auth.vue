<template>
  <div>
    <el-form
      :model="updateRole"
      ref="roleForm"
      label-width="100px"
      label-position="right"
      style="width:400px"
      :rules="rules"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="updateRole.name"
          placeholder="请输入角色名称"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-tree
      :data="authList"
      show-checkbox
      node-key="index"
      :default-expand-all="true"
      :default-checked-keys="checkedKeys"
      @check-change="handleCheckChange"
    ></el-tree>
  </div>
</template>

<script setup lang="ts">
  import type {FormInstance,FormRules} from "element-plus"
  //导航列表
  import menuList from "@/config/menuConfig";
  import type {roleInfoData} from "@/api/role/type"
  import {onMounted,reactive,ref} from "vue"
  interface Tree{
    index:string
  }
  //接收属性 父组件更新对象
  const props = defineProps(["role"])
  //更新角色数据
  let updateRole:roleInfoData = reactive({
    name:""
  })
  //树形列表
  const authList = ref([])
  //树形选中项
  let checkedKeys = reactive<any>([])
  //表单对象
  const roleForm = ref<FormInstance>()
  //表单校验规则
  const rules = reactive<FormRules>({
    name:[{required:true,message:"请输入角色名称",trigger:"blur"}]
  })
  //为父组件提供数据
  const getMenus = ()=>{
    updateRole.menus = checkedKeys
    return updateRole
  }
  //传给父组件 暴漏出去给父组件使用
  defineExpose({
    getMenus
  })
  //点击确定
  const handleCheckChange = (
    data:Tree,
    checked:boolean,
    indeterminate:boolean//是否有子对象
  )=>{
    if(checked){
      //student有二级菜单
      if(data.index != "/students" && checkedKeys.indexOf(data.index) === -1){
        //加入
        checkedKeys.push(data.index)
      }
    }else{
      if(checkedKeys.indexOf(data.index) !=-1){
        //没被勾去除
        checkedKeys.splice(checkedKeys.indexOf(data.index),1)
      }
    }
  }
  //获取树形控件元素
  const getAuthNodes = (menuList:any)=>{
    return menuList.map((item:any)=>{
      if(!item.children){
        //没有子对象，拿走
        return {
          index:item.index,
          label:item.title
        }
      }else{
        return {
          index:item.index,
          label:item.title,
          //再次调用递归
          children:getAuthNodes(item.children)
        }
      }
    })
  }
  onMounted(()=>{
    //列表
    authList.value = getAuthNodes(menuList)
    //新的角色
    updateRole = reactive({...props.role})
    //默认选中项
    checkedKeys = [...props.role.menus]
  })
</script>

<style lang="scss" scoped>

</style>