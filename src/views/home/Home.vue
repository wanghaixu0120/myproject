<template>
  <div>
    <h1 class="home.title" style="text-align:center">
      <el-button :icon="ArrowLeft" @click="getPreYearData">上一年</el-button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <span>{{ year }}</span>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <el-button @click="getNextYearData">下一年<el-icon><ArrowRight></ArrowRight></el-icon></el-button>
    </h1>
    <div id="myChart" style="height:500px"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts"
import {reqStudentForYear} from "@/api/student"
import {ArrowLeft ,ArrowRight} from "@element-plus/icons-vue"
import {onMounted,ref} from "vue"
const year=ref(new Date().getFullYear())
const getPreYearData=()=>{
  year.value--
  drwaChart()
}
const getNextYearData=()=>{
  year.value++
  drwaChart()
}
onMounted(()=>{
  drwaChart()
})
const drwaChart=()=>{
  reqStudentForYear(year.value).then(response=>{
    const resp=response
    if(resp.status===0){
      var chartDom=document.getElementById("myChart")
      var mychart=echarts.init(chartDom)
      var option 
      var dataArr=[0]
      if(resp.data&&resp.data.length){
        resp.data.forEach(item=>{
          dataArr[parseInt(item._id)-1]=item.count
        })
      }else{}
      option={
        xAxis:{
          type:"category",
          data:[
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "11",
            "12",
          ]
        },
        yAxis:{
          type:"value"
        },
        series:[
          {
            data:dataArr,
            type:"bar"
          }
        ]
      }
      option&&mychart.setOption(option)
    }
  })
}
</script>

<style lang="scss" scoped>

</style>