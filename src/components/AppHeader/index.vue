<template>
  <div class="header">
    <a href="#/">
      <img src="@/assets/logo.png" alt="" class="logo" width="25px">
      <span class="company">学员管理系统</span>
    </a>
    <!-- 头部下拉菜单 -->
     <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{useStore.user?.username}}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="a">修改密码</el-dropdown-item>
            <el-dropdown-item command="b">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </template>
     </el-dropdown>
     <span class="date">{{ currentTime }}</span>
     <el-dialog
      title="修改密码"
      v-model="dialogFormVisible"
      width="500px"
     >
      <el-form
        :model="userForm"
        :rules="rules"
        ref="userFormRef"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
      <el-form-item label="原始密码" prop="oldPass">
        <el-input type="password" v-model="userForm.oldPass"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="userForm.pass"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="userForm.checkPass"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-button type="primary" @click="updatePwd(userFormRef)">提交</el-button>
      </el-form-item>
      </el-form>
     </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import {ArrowDown} from "@element-plus/icons-vue";
  import {formateTime} from "@/utils/dateUtils"
  import {onMounted,ref,reactive,nextTick} from "vue"
  import useUserStore from "@/store/modules/user"
  import { useRouter} from "vue-router"
  import type {FormInstance,FormRules} from "element-plus"
  import {reqCheckPwd,reqUpdatePwd} from "@/api/user"
  const $router = useRouter();
  //控制修改密码的对话框显隐
  const dialogFormVisible = ref(false)
  const userFormRef =ref<FormInstance>()
  //收集修改密码的信息
  const userForm = reactive({
    oldPass:"",
    pass:"",
    checkPass:""
  })
  //校验旧密码
  let validateOldPass = (rule:any,value:any,callback:any)=>{
    reqCheckPwd({userId:(useStore.user?._id as string),password:value}).then((response)=>{
      if(response.status === 0){
        callback()
      }else{
        callback(new Error(response.msg))
      }
    })
  }
  //校验新密码
  let validatePass = (rule:any,value:any,callback:any)=>{
    if(value !== userForm.pass){
      callback(new Error("两次密码输入不一致"))
    }else{
      callback()
    }
  }
  //验证规则（修改密码）
  const rules = reactive<FormRules>({
    oldPass:[
      {
        required:true,
        validator:validateOldPass,
        trigger:["blur","change"]
      }
    ],
    pass:[{required:true,message:"请输入新密码",trigger:"blur"}],
    checkPass:[
      {
        required:true,
        validator:validatePass,
        trigger:"change"
      }
    ]
  })

  let useStore = useUserStore();
  console.log(useStore)
  //小弹窗修改密码或退出登录
  const handleCommand = (command:string)=>{
    switch(command){
      case "a":
        // 修改密码
        handlePwd();
        break
      case "b":
        // 退出登陆
        handleLogout();
        break
      default:
        break
    }
  }
  //修改密码（弹窗）
  const handlePwd = ()=>{
    dialogFormVisible.value = true
    nextTick(()=>{
      userFormRef.value.resetFields()//重置
    })
  }
  //修改密码
  const updatePwd = (formEl:FormInstance|undefined)=>{
    if(!formEl) return 
    formEl.validate((valid)=>{
      if(valid){
        reqUpdatePwd({userId:(useStore?.user?._id as string),password:userForm.pass}).then(response=>{
          if(response.status === 0){
            handleLogout();
            dialogFormVisible.value = false
          }
        })
      }else{
        
      }
    })
  }
  //退出登录操作 同时跳转路由
  const handleLogout = ()=>{
    useStore.removeUser()
    if(!useStore.user){
      $router.replace("/login")
    }
  }
  let currentTime = ref<string>("")
  const getTime = ()=>{
    setInterval(()=>{
      currentTime.value = formateTime(Date.now());
    },1000)
  }
  onMounted(()=>{
    getTime()
  })
</script>

<style scoped>
  .logo{
    vertical-align: middle;
    padding:0 10px 0 40px;
  }
  .company{
    position:absolute;
    color:white;
  }
  .el-dropdown{
    float:right;
    margin-right:40px;
    height:50px;
    line-height: 50px;
  }
  .el-dropdown-link{
    cursor:pointer;
    color:#fff;
  }
  .date{
    float:right;
    color:#fff;
    margin-right:50px;
  }
</style>