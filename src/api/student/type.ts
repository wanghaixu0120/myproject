export interface studentInfoData{
  _id?:string | null,
  name:string,
  gender:string,
  school?:string,
  major?:string,
  grade?:string,
  education?:string,
  direction:string,
  id_number?:string,
  phone?:string,
  parent?:string,
  parent_phone?:string,
  address?:string,
  qq?:string,
  class:string,
  adminssion_date?:string,
  teacher_id:string,
  manager_id:string,
  pictures?:string[],
  note?:string,
  __v?:number
}

export interface studentListFormData{
  page:string,
  size:string,
  searchMap:searchMapData
}
interface searchMapData{
  name:string,
  direction:string,
  teacher_id?:string,
  manager_id?:string,
  class:string
}
export interface studentResponseData{
  status:number,
  data?:studentInfoData,
  msg?:string
}
export interface studentListResponseData{
  status:number,
  data?:studentListData,
  msg?:string
}
interface studentListData{
  data:studentInfoData[],
  total:number
}
export interface studentAllResponseData{
  status:number,
  data?:studentInfoData[],
  mag?:string
}
interface monthData{
  _id:string,
  count:number
}
export interface studentYearResponseData{
  status:string,
  data:monthData[]
}