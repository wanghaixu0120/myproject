<template>
  <div>
    <div class="btn_box" style="margin:20px 0;">
      <el-button type="primary" @click="handleAdd">新增用户</el-button>
    </div>
    <el-table
      :data="users"
      style="width:100%;height:380px"
      border
    >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column  prop="username" label="用户名"></el-table-column>
      <el-table-column  prop="name" label="姓名"></el-table-column>
      <el-table-column  prop="phone" label="电话"></el-table-column>
      <el-table-column  prop="create_time" label="创建时间" :formatter="resetDate"></el-table-column>
      <el-table-column  prop="role_id" label="所属角色" :formatter="formatRole"></el-table-column>
      <el-table-column  label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row._id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 15, 20]"
      layout="total, sizes, prev, next,jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="page"
    />
    <!-- 新增用户弹窗 -->
     <el-dialog
      v-model="userFormVisible"
      title="添加用户"
      width="500px"
     >
      <el-form
        :model="user"
        ref="userFormRef"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :rules="rules"
      >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="user.role_id" placeholder="请点击选择">
          <el-option
            v-for="option in roleOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="user.phone"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="user._id === null?addData(userFormRef):updateData(userFormRef)">确定</el-button>
        <el-button @click="userFormVisible = false">取消</el-button>
      </span>
    </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import {formateDate} from "@/utils/dateUtils"
  import type {roleInfoData} from "@/api/role/type"
  import {reactive,ref,onMounted, nextTick} from "vue"
  import useRoleStore from "@/store/modules/role"
  import type {userInfoData} from "@/api/user/type"
  import useUserStore from "@/store/modules/user"
  import { ElMessage, ElMessageBox, FormInstance,FormRules } from "element-plus"
  let userStore = useUserStore();
  const validateUserName = (rule:any,value:any,callback:any)=>{
    value = value.trim()
    const length = value && value.length;
    const pwdReg = /^[a-zA-Z0-9_]+$/
    if(value === ""){
      callback(new Error("请输入账号"))
    }else if(length<4 || length>12){
      callback(new Error("长度在4到12个字符之间"))
    }else if(!pwdReg.test(value)){
      callback(new Error("账号必须是英文、数字、下划线组成"))
    }else{
      callback()
    }
  }
  const validatePhone = (rule:any,value:any,callback:any)=>{
    value = value.trim();
    const phoneReg = /^1[3456789]\d{9}$/;
    if(value === ""){
      callback(new Error("请输入手机号"))
    }else if(!phoneReg.test(value)){
      callback(new Error("请输入正确的手机号"))
    }else{
      callback()
    }
  }
  let roleStore = useRoleStore();
  // const users = ref([
  //   {
  //     _id:1,
  //     username:"test1",
  //     password:"1234",
  //     name:"测试1",
  //     phone:"13111111111",
  //     role_id:"640ec59a9f6e3402f8edd4ec",
  //     create_time:1678934269969
  //   },
  //   {
  //     _id:2,
  //     username:"test2",
  //     password:"1234",
  //     name:"测试2",
  //     phone:"13888888888",
  //     role_id:"640ec59a9f6e3402f8edd4ec",
  //     create_time:1678934269969
  //   }
  // ])
  const users = ref<userInfoData[]|undefined>([])
  const user = ref<userInfoData | undefined>({
    _id:null,
    username:"",
    password:"",
    name:"",
    phone:"",
    role_id:""
  })
  const userFormVisible = ref(false)
  const userFormRef = ref<FormInstance>();
  const rules = reactive<FormRules>({
    username:[
      {required:true,validator:validateUserName,trigger:["blur","change"]}
    ],
    password:[
      {required:true,message:"请输入密码",trigger:"blur"},
      {min:3,message:"密码长度需要大于4位",trigger:"blur"}
    ],
    name:[{required:true,message:"请输入姓名",trigger:"blur"}],
    role_id:[{required:true,message:"请选择角色",trigger:"blur"}],
    phone:[{
      required:true,validator:validatePhone,trigger:["blur","change"]
    }]
  })
  
  const handleAdd = ()=>{
    user.value = {
      _id:null,
      username:"",
      password:"",
      name:"",
      phone:"",
      role_id:""
    }
    userFormVisible.value = true
    nextTick(()=>{
      userFormRef.value.resetFields()
    })
  }

  const addData = (formEl:FormInstance | undefined)=>{
    if(!formEl) return 
    formEl.validate(async (valid)=>{
      if(valid){
        userStore.addUser((user.value as userInfoData)).then(response=>{
          userFormVisible.value = false;
          getUserList()
        })
      }else{}
    })
  }

  let roleOptions = ref<roleInfoData[]|undefined>([])
  const handleEdit = (_id:string)=>{
    handleAdd()
    userStore.getUserById(_id).then(response=>{
      user.value = response
    })
  }
  const updateData = (formEl:FormInstance | undefined)=>{
    if(!formEl) return 
    formEl.validate(async (valid)=>{
      if(valid){
        userStore.updateUser((user.value as userInfoData)).then(response=>{
          userFormVisible.value = false;
          getUserList()
        })
      }
    })
  }
  const handleDelete = (_id:string)=>{
    ElMessageBox.confirm("确定要删除此条数据吗？","Warning",{
      confirmButtonText:"OK",
      cancelButtonText:"Cancel",
      type:"warning"
    }).then(()=>{
      userStore.deleteUser(_id).then(response=>{
        getUserList()
        ElMessage({
          type:"success",
          message:"删除成功"
        })
      })
    })
  }
  const resetDate = (row:any,column:any,cellValue:number,index:number)=>{
    return formateDate(cellValue)
  }
  const formatRole = (row:any,colum:any,cellValue:string,index:number)=>{
    let role = roleOptions?.value?.find((item)=>item._id === cellValue) || {}
    return role.name
  }
  const getRoleList = ()=>{
    if(roleStore.roles?.length){
      roleOptions.value = roleStore.roles
    }else{
      roleStore.roleList().then(()=>{
        roleOptions.value = roleStore.roles
      })
    }
  }


  const getUserList = ()=>{
    userStore.getUserList({page:currentPage.value,size:pageSize.value}).then(response=>{
      users.value = userStore.users;
      total.value = (response?.total as number)
    })
  }
  const currentPage = ref(1)
  const pageSize = ref(5)
  const total = ref(0)
  const totalPage = ref(1)
  const handleSizeChange = (val:number)=>{
    pageSize.value = val;
    getUserList()
  } 
  const handleCurrentChange = (val:number)=>{
    currentPage.value = val;
    getUserList()
  }

  
  onMounted(()=>{
    getRoleList(),
    getUserList()
  })
</script>

<style scoped>
  .page{
    margin-top:20px;
  }
</style>