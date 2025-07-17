<template>
  <div>
    <div class="btn_box" style="margin:20px 0;">
      <el-button type="primary" @click="handleAdd">创建角色</el-button>
      <el-button type="primary" :disabled="currentRow == null ? true : false" @click="roleAuthVisible=true">设置角色权限</el-button>
    </div>
    <el-table
      class="role_table"
      ref="singleTable"
      :data="roleList"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width:100%;"
      border
      height="380"
    >
      <el-table-column type="index" width="60" label="序号"></el-table-column>
      <el-table-column property="name" label="角色名称"></el-table-column>
      <el-table-column property="create_name" label="创建时间" :formatter="resetDate"></el-table-column>
      <el-table-column property="auth_time" label="授权时间" :formatter="resetDate"></el-table-column>
      <el-table-column property="auth_name" label="授权人"></el-table-column>
    </el-table>
    <el-dialog v-model="roleFormVisible" title="添加角色" width="500px">
      <el-form :model="role" ref="roleFormRef" label-width="100px" label-position="right" style="width:400px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="addData(roleFormRef)">确定</el-button>
          <el-button @click="roleFormVisible=false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 设置权限弹窗 -->
     <el-dialog v-model="roleAuthVisible" title="设置角色权限" width="500px">
      <Auth :role="currentRow" v-if="roleAuthVisible" ref="authRef"></Auth>
      <template #footer>
        <span class="dialog-fo">
          <el-button type="primary" @click="updateData">确定</el-button>
          <el-button @click="roleAuthVisible=false">取消</el-button>
        </span>
      </template>
     </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import type {  FormInstance, FormRules} from "element-plus"
  import {onMounted,ref,reactive,nextTick} from "vue"
  import {formateDate} from "@/utils/dateUtils"
  //创建时间
  const resetDate = (row:any,colum:any,cellValue:number,index:number)=>{
    return formateDate(cellValue)
  }
  import {roleInfoData} from "@/api/role/type"
  import useRoleStore from "@/store/modules/role"
  import Auth from "./components/Auth.vue"
  //将角色当用户对待
  import useUserStore from "@/store/modules/user"
  let userStore = useUserStore();
  let useStore = useRoleStore()
  //设置角色权限可用
  let currentRow = ref(null)
  //弹窗显隐
  const roleAuthVisible = ref(false)
  //存储角色列表
  let roleList = ref<roleInfoData[]>([])
  //
  const handleCurrentChange = (val:any)=>{
    currentRow.value = val
  }
  //添加到角色列表当中去
  const getRoleList = ()=>{
    useStore.roleList().then(()=>{
      roleList.value = useStore.roles
    })
  }
  //获取输入角色名称
  let role = reactive({
    name:"",
  })
  //表单校验规则
  const rules = reactive<FormRules>({
    name:[{required:true,message:"请输入角色名称",trigger:"blur"}]
  })
  //控制弹窗显隐-添加弹窗
  const roleFormVisible = ref(false)
  const roleFormRef = ref<FormInstance>()
  //创建角色点击
  const handleAdd = ()=>{
    roleFormVisible.value = true
    nextTick(()=>{
      roleFormRef.value.resetFields()
    })
  }
  //添加角色
  const addData = (formEl:FormInstance|undefined)=>{
    if(!formEl) return 
    formEl.validate(async (valid)=>{
      if(valid){
        useStore.useAddRole(role).then(response=>{
          roleFormVisible.value = false//关闭弹窗
          getRoleList()//刷新数据列表
        })
      }else{

      }
    })
  }
  //对子组件操作
  const authRef = ref();
  //角色更新
  const updateData = ()=>{
    //调用子组件方法 将菜单更新到currentRow中
    const newRole = authRef.value.getMenus();
    currentRow.value.menus = newRole.menus;
    currentRow.value.name = newRole.name;
    currentRow.value.auth_name = userStore.user?.username
    useStore.useUpdateRole(currentRow.value).then(resopnse=>{
      roleAuthVisible.value = false//关闭弹窗
      getRoleList()//刷新数据
    })

  }
  onMounted(()=>{
    //刷新数据
    getRoleList()
  })
</script>

<style lang="scss" scoped>

</style>