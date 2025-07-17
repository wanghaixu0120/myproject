<template>
  <div class="navbar">
    <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
      :default-active="$route.path"
      :default-openeds="['/students']"
    >
      <Menu :menuList="menuNodes" />
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import Menu from "./menu/index.vue";
import menuList from "@/config/menuConfig";
import type { MenuData, MenuChildrenData } from "./types/type";
import useUserStore from "@/store/modules/user";
let useStore = useUserStore();
import { useRoute } from "vue-router";
const $route = useRoute();
//判断当前是否拥有权限
const hashAuth = (item: MenuData) => {
  const { index, isPublic } = item;
  const menus = useStore.user?.role.menus;
  const username = useStore.user?.username;

  if (username === "admin" || isPublic || menus?.indexOf(index) != -1) {
    return true;
  } else if (item.children) {
    return !!item.children.find(
      (child: MenuChildrenData) => menus.indexOf(child.index) != -1
    );
  } else {
    return false;
  }
};
//菜单项
let menuNodes: any[] = [];
//计算菜单项有什么
const getMenuNodes = () => {
  menuList.forEach((item) => {
    if (!item.children) {
      if (hashAuth(item)) {
        menuNodes.push(item);
      }
    } else {
      //当前二级菜单用户权限列表
      let tempArr = [];
      //遍历二级菜单
      item.children.forEach((i) => {
        if (hashAuth(i)) {
          tempArr.push(i);
        }
      });
      let obj = { ...item, children: tempArr };
      menuNodes.push(obj);
    }
  });
};
getMenuNodes();
</script>

<style scoped>
.el-menu {
  border: 0;
}
</style>