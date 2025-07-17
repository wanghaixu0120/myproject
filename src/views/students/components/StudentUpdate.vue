<template>
  <div class="student-update">
    <el-button
      icon="el-icon-arrow-left"
      @click="$router.push('/student')"
      circle
    ></el-button>
    <!-- status-icon 当表单校验不通过时, 输入框右侧有个 x 小图标 -->
    <el-form
      status-icon
      ref="studentFormRef"
      :model="updateStudent"
      label-width="100px"
      label-position="right"
      style="width: 100%; height: 100%"
      :rules="rules"
      class="update-form"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="updateStudent.name" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select
          v-model="updateStudent.gender"
          class="filter-item"
          placeholder="请点击选择"
          width="600px"
        >
          <el-option
            v-for="option in genderOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所在学校" prop="school">
        <el-autocomplete
          class="inline-input"
          v-model="updateStudent.school"
          :fetch-suggestions="querySearchSchool"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-autocomplete
          class="inline-input"
          v-model="updateStudent.major"
          :fetch-suggestions="querySearchMajor"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-select
          v-model="updateStudent.grade"
          class="filter-item"
          placeholder="请点击选择"
        >
          <el-option
            v-for="option in gradeOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学历" prop="education">
        <el-select
          v-model="updateStudent.education"
          class="filter-item"
          placeholder="请点击选择"
        >
          <el-option
            v-for="option in educationOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学习方向" prop="direction">
        <el-select
          v-model="updateStudent.direction"
          class="filter-item"
          placeholder="请点击选择"
        >
          <el-option
            v-for="option in directionOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号码" prop="id_number">
        <el-input v-model="updateStudent.id_number" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="updateStudent.phone" />
      </el-form-item>
      <el-form-item label="家长姓名" prop="parent">
        <el-input v-model="updateStudent.parent" />
      </el-form-item>
      <el-form-item label="家长联系电话" prop="parent_phone">
        <el-input v-model="updateStudent.parent_phone" />
      </el-form-item>
      <el-form-item label="家庭住址" prop="address">
        <el-input v-model="updateStudent.address" />
      </el-form-item>
      <el-form-item label="QQ号码" prop="qq">
        <el-input v-model="updateStudent.qq" />
      </el-form-item>
      <el-form-item label="所在班级" prop="class">
        <el-select
          v-model="updateStudent.class"
          class="filter-item"
          placeholder="请点击选择"
        >
          <el-option
            v-for="option in classOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入学时间" prop="admission_date">
        <el-date-picker
          v-model="updateStudent.admission_date"
          type="date"
          placeholder="请点击选择"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="授课教师" prop="teacher_id">
        <el-select
          v-model="updateStudent.teacher_id"
          class="filter-item"
          placeholder="请点击选择"
        >
          <el-option
            v-for="option in teacherOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学管" prop="manager_id">
        <el-select
          v-model="updateStudent.manager_id"
          class="filter-item"
          placeholder="请点击选择"
        >
          <el-option
            v-for="option in managerOptions"
            :key="option._id"
            :label="option.name"
            :value="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="照片" prop="pictures">
        <el-upload
          :action="baseApi + `/manage/img/uplaod`"
          list-type="picture-card"
          :auto-upload="true"
          name="image"
          accept="image/*"
          :file-list="fileList"
          :on-change="handleChange"
        >
          <el-icon>
            <Plus></Plus>
          </el-icon>
          <template #file = "{file}">
            <div>
              <img :src="file.url" alt="" class="el-upload-list_item-thumbnail">
              <span class="el-upload-list_item-actions">
                <span class="el-upload-list_item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <el-icon>
                    <zoom-in></zoom-in>
                  </el-icon>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <el-icon><Download /></el-icon>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <el-icon><Delete /></el-icon>
                </span>

              </span>
            </div>
          </template>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image">
        </el-dialog>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <Editor v-model="updateStudent.note" :api-key="tiny.apiKey" :init="tiny.init"></Editor>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="
          updateStudent._id === null
            ? addData(studentFormRef)
            : updateData(studentFormRef)
        "
      >
        确 定
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref ,onMounted, toRaw} from 'vue'
// 引入用户数据类型
import type { userInfoData } from '@/api/user/type'
// 引入角色数据类型
import type { roleInfoData } from '@/api/role/type'
// 引入角色小仓库
import useRoleStore from '@/store/modules/role'
let roleStore = useRoleStore()
// 引入用户小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
// 引入班级数据类型
import type { classInfoData } from '@/api/class/type'
// 引入班级小仓库
import useClassStore from '@/store/modules/class'
let classStore = useClassStore()
// 引入学校数据类型
import type { schoolInfoData } from '@/api/school/type'
// 引入学校小仓库
import useSchoolStore from '@/store/modules/school'
let schoolStore = useSchoolStore()
// 引入专业数据类型
import type { majorInfoData } from '@/api/major/type'
// 引入专业小仓库
import useMajorStore from '@/store/modules/major'
let majorStore = useMajorStore()
// 引入学员数据类型
import type { studentInfoData } from '@/api/student/type'
// 角色列表
let roleOptions = ref<roleInfoData[] | undefined>([])
// 用户列表
let userOptions = ref<userInfoData[] | undefined>([])
// 角色为教师的id
const teacher_role_id = ref<string | undefined>('')
// 角色为学管的id
const manager_role_id = ref<string | undefined>('')
// 教师列表
let teacherOptions = ref<userInfoData[]>([])
// 学管列表
let managerOptions = ref<userInfoData[]>([])
// 班级列表
let classOptions = ref<classInfoData[]>([])
// 学校列表
let schoolOptions = ref<schoolInfoData[]>([])
// 专业列表
let majorOptions = ref<majorInfoData[]>([])
// 性别、年级、学历、学习方向数据格式
interface FilterData {
  _id: string
  name: string
}
// 性别数据格式化列表
const genderOptions = ref<FilterData[]>([
  { _id: '0', name: '男' },
  { _id: '1', name: '女' },
])
// 年级数据格式化列表
const gradeOptions = ref<FilterData[]>([
  { _id: '1', name: '大一' },
  { _id: '2', name: '大二' },
  { _id: '3', name: '大三' },
  { _id: '4', name: '大四' },
  { _id: '5', name: '在读研究生' },
])
// 学历数据格式化列表
const educationOptions = ref<FilterData[]>([
  { _id: '1', name: '专科' },
  { _id: '2', name: '本科' },
  { _id: '3', name: '硕士' },
  { _id: '4', name: '社会' },
])
// 年级数据格式化列表
const directionOptions = ref<FilterData[]>([
  { _id: '1', name: 'web前端' },
  { _id: '2', name: 'Java' },
  { _id: '3', name: 'UI/UE' },
  { _id: '4', name: 'C/C++' },
])
// 获取角色列表
const getRoleList = () => {
  if (roleStore.roles?.length) {
    roleOptions.value = roleStore.roles
    //   遍历所有角色中的教师和学管id分别存储到变量中
    roleOptions.value?.forEach((item) => {
      if (item.name == '教师') {
        teacher_role_id.value = item._id
      } else if (item.name == '学管') {
        manager_role_id.value = item._id
      }
    })
  } else {
    roleStore.roleList().then(() => {
      roleOptions.value = roleStore.roles
      //   遍历所有角色中的教师和学管id分别存储到变量中
      roleOptions.value?.forEach((item) => {
        if (item.name == '教师') {
          teacher_role_id.value = item._id
        } else if (item.name == '学管') {
          manager_role_id.value = item._id
        }
      })
    })
  }
}
// 获取用户列表
const getUserList = () => {
  if (userStore.users?.length) {
    userOptions.value = userStore.users
    //   遍历所有用户将role_id为教师的存储到教师列表中，role_id为学管的存储到学管列表中
    userOptions.value?.forEach((item) => {
      if (item.role_id == teacher_role_id.value) {
        teacherOptions.value.push(item)
      } else if (item.role_id == manager_role_id.value) {
        managerOptions.value.push(item)
      }
    })
  } else {
    userStore.getUserAll().then(() => {
      userOptions.value = userStore.users
      //   遍历所有用户将role_id为教师的存储到教师列表中，role_id为学管的存储到学管列表中
      userOptions.value?.forEach((item) => {
        if (item.role_id == teacher_role_id.value) {
          teacherOptions.value.push(item)
        } else if (item.role_id == manager_role_id.value) {
          managerOptions.value.push(item)
        }
      })
    })
  }
}
// 获取班级列表
const getClassList = () => {
  if (classStore.classes?.length) {
    classOptions.value = classStore.classes
  } else {
    classStore.getClassAll().then(() => {
      classOptions.value = classStore.classes as classInfoData[]
    })
  }
}

const  getSchoolList = ()=>{
  if(schoolStore.schools?.length){
    schoolOptions.value = schoolStore.schools
  }else{
    schoolStore.getSchoolAll().then(()=>{
      schoolOptions.value = schoolStore.schools as schoolInfoData[]
    })
  }
}
const getMajorList = ()=>{
  if(majorStore.majors?.length){
    majorOptions.value = majorStore.majors
  }else{
    majorStore.getMajorAll().then(()=>{
      majorOptions.value = majorStore.majors as majorInfoData[]
    })
  }
}
onMounted(()=>{
  getRoleList(),
  getUserList(),
  getClassList(),
  getSchoolList(),
  getMajorList(),
  getStudent()
})
const querySearchSchool = (queryStirng:any,cb:any)=>{
  schoolOptions.value.forEach(item=>{
    return (item.value = item.schoolname)
  })
  var results = queryStirng?schoolOptions.value.filter(createFilter(queryString)):schoolOptions.value
  cb(results)
}
const querySearchMajor = (queryString:any,cb:any)=>{
  majorOptions.value.forEach(item=>{
    return (item.value = item.majorname)
  })
  var results = queryString?majorOptions.value.filter(createFilter(queryString)):majorOptions.value
  cb(results)
}
const createFilter =(queryString:string)=>{
  return (restaurant:any)=>{
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase())===0
    )
  }
}
const updateStudent = ref({
  _id: null,
  name: '', //姓名
  gender: '', //性别
  school: '', //学校
  major: '', //专业
  grade: '', //年级
  education: '', //学历
  direction: '', //学习方向
  id_number: '', //身份号码
  phone: '', //电话号码
  parent: '', //家长姓名
  parent_phone: '', //家长联系电话
  address: '', //家庭住址
  qq: '', //QQ号码
  class: '', //所在班级
  admission_date: '', //入学时间
  teacher_id: '', //教师id
  manager_id: '', //学管id
  pictures: '', //照片数组
  note: '', //备注信息

})

// 关于图片上传所需要的方法
import  {Delete,Download,Plus,ZoomIn} from "@element-plus/icons-vue"
import type { UploadProps,UploadUserFile,UploadFile } from "element-plus"
const baseUrl = import.meta.env.VITE_APP_SERVICE_URL;
const baseApi = import.meta.env.VITE_APP_BASE_API;
import request from "@/utils/request"
const dialogImageUrl = ref("")
const dialogVisible = ref(false)
const disabled = ref(false)
const fileList = ref<UploadUserFile[]>([])

const handleChange:UploadProps["onChange"] = (uploadFile,uploadFiles)=>{
  if(uploadFile.status === "success"){
    const result = uploadFile.response
    if(result.status === 0){
      const {name,url} = result.data
      uploadFile = uploadFiles[uploadFiles.length-1];
      uploadFile.name = name;
      uploadFile.url = url
    }
  }
  fileList.value = uploadFiles
}
const getImgs = ()=>{
  return fileList.value.map(item=>item.name)
}
const handleRemove = (file:UploadFile)=>{
  request.post<any,any>('/manage/img/delete',{name:file.name}).then(response=>{
    if(response.status === 0){
      fileList.value.splice(fileList.value.indexOf(file),1)
    }
  })
}
const handlePictureCardPreview = (file:UploadFile)=>{
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true
}

/* ----------------富文本相关内容------------------------- */
import Editor from "@tinymce/tinymce-vue";
const tiny = reactive({
    apiKey: "68add95805ce66e3528cf8e49665197539aa2f448b80e6ed6f50da6bde757793",
    init: {
        toolbar_mode: 'sliding',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (_request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
    },
});

/* -------------校验规则----------------- */
// 自定义校验规则（电话号码）
const validatePhone = (rule: any, value: any, callback: any) => {
  value = value.trim()
  const phoneReg =
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  if (value === '') {
    callback(new Error('请输入手机号码'))
  } else if (!phoneReg.test(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}
// 自定义校验规则（身份证号码）
const validateIdNumber = (rule, value, callback) => {
  value = value.trim()
  const _IDRe18 =
    /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  const _IDre15 =
    /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/

  if (_IDRe18.test(value) || _IDre15.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的身份证号码'))
  }
}
import type { FormInstance, FormRules } from 'element-plus'
// 表单元素对象，需要和el-form 的ref属性值对应
const studentFormRef = ref<FormInstance>()
// 表单校验规则
const rules = reactive<FormRules>({
  name:[{required:true,message:'请输入姓名',trigger:'blur'}],
  gender:[{required:true,message:'请选择性别',trigger:'blur'}],
  direction:[{required:true,message:'请选择学习方向',trigger:'blur'}],
  id_number:[{validator:validateIdNumber,trigger:['blur','change']}],
  phone:[{validator:validatePhone,trigger:['blur','change']}],
  class:[{required:true,message:'请选择班级',trigger:'blur'}],
  admission_date:[{required:true,message:'请选择入学时间',trigger:'blur'}],
  teacher_id:[{required:true,message:'请选择授课教师',trigger:'blur'}],
  manager_id:[{required:true,message:'请选择学管',trigger:'blur'}],
})

import {useRouter,useRoute} from "vue-router"
const $router = useRouter();
const $route = useRoute()
import useStudentStore from '@/store/modules/student'
import { update } from 'lodash'
let studentStore = useStudentStore()
const addData = (formEl:FormInstance | undefined)=>{
  if(!formEl) return 
  formEl.validate(async (valid)=>{
    if(valid){
      updateStudent.value.pictures = getImgs();
      studentStore.addStudent((updateStudent.value as studentInfoData)).then(response=>{
        $router.replace("/student")
      })
    }else{
      return false
    }
  })
}

const getStudent = ()=>{
  const {_id} = $route.params
  if(_id!="-1"){
    studentStore.getStudentById(_id as string).then(response=>{
      updateStudent.value = response as studentInfoData
      const {pictures} = response as studentInfoData
      if(pictures && pictures.length!=0){
        fileList.value = pictures.map(item=>({
          name:item,
          url:baseApi + "/upload/" + item
        }))
      }
    })
  }
}
const updateData = (formEl:FormInstance |undefined)=>{
  if(!formEl) return 
  formEl.validate(async (valid)=>{
    if(valid){
      updateStudent.value.pictures = getImgs();
      studentStore.updateStudent(updateStudent.value).then(response=>{
        $router.replace("/student")
      })
    }else{
      return false
    }
  })
}
</script>

<style lang="scss" scoped>

</style>