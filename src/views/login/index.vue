<template>
  <div class="login-container">
    <!-- ref 相当于 id，:model 表单数据对象, label-width 表单域标签的的宽度 -->
    <el-form 
      ref="ruleFormRef" 
      :model="form" 
      label-width="80px" 
      class="login-form"
      :rules="rules"
    >
      <h2 class="login-title">登录</h2>
      <el-form-item 
        label="帐号"
        prop="username"  
      >
        <el-input v-model="form.username" placeholder="请输入帐号"></el-input>
      </el-form-item>
      <el-form-item 
        label="密码"
        prop="password"  
      >
        <el-input
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reactive,ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {useRouter} from "vue-router";
let $router = useRouter();
import useUserStore from "@/store/modules/user";
let useStore = useUserStore();
import {ElMessage} from "element-plus";


// 收集表单数据对象
const form = reactive({
  username: '',
  password: '',
});

const ruleFormRef = ref<FormInstance>();
//校验用户名符合规则
const validateUserName = (rule:any,value:any,callback:any)=>{
  value = value.trim();
  const length = value && value.length;
  const pwdReg = /^[a-zA-Z0-9_]+$/;
  if(value === ""){
    callback(new Error("请输入账号"));
  }else if(length < 4 || length > 12){
    callback(new Error("长度在 4 到 12 个字符"));
  }else if(!pwdReg.test(value)){
    callback(new Error("账号必须是英文、数字或下划线组成"));
  }else{
    callback();
  }
}
const rules = reactive<FormRules>({
  username:[
    {
      required:true,
      validator:validateUserName,
      trigger:["blur","change"]
    }
  ],
  password:[
    {
      required:true,
      message:"请输入密码",
      trigger:["blur","change"]
    }
  ]
})

// 登录按钮点击回调
const onSubmit = (formEl:FormInstance | undefined) => {
  if(!formEl) return 
  formEl.validate(async (valid)=>{
    if(valid){
      try{
        await useStore.userLogin(form)
        $router.push("/")
        ElMessage({
          type:"success",
          message:"登录成功",
        })
      }catch(error){
        ElMessage({
          type:"error",
          message:(error as Error).message
        })
      }
    }else{
      console.log("error submit");
      return false;
    }
  })
}
</script>

<style scoped>
.login-form {
  width: 350px;
  /* 上下间隙150px, 左右自动 */
  margin: 160px auto;
  /*透明背景色*/
  background-color: rgb(255, 255, 255, 0.8);
  padding: 30px;
  /* 圆角 */
  border-radius: 20px;
}

.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('../../assets/bg.jpeg');
  overflow: hidden;
}

/* 标题 */
.login-title {
  text-align: center;
  color: #303133;
}
</style>
