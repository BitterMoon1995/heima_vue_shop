<template>
  <el-container class="home-container">
    <el-header>
      <div style="line-height:60px">
        <img src="../assets/image/heima.jpg">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleMenu">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened='false'
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activeIndex"
          router>
          <!--          设置可以同时打开多个二级菜单-->

<!--          一级菜单-->
          <el-submenu v-for="item in menus" :key="item.id" :index="item.id.toString()">
            <template slot="title">
              <i :class="iconsObj[item.id]" class="menuIcon" style="font-size: 20px"></i>
              <span>{{item.name}}</span>
            </template>
<!--            二级菜单-->
            <el-menu-item v-for="subItem in item.children" :index="subItem.path"
                          :key="subItem.id" @click="saveActiveState(subItem.path)">
              <template class="menu-icon">
                <i class="el-icon-minus"></i>
                <span>{{subItem.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {iAxios as axios} from "../config/iAxios";
  export default {
    created() {
      this.username = window.sessionStorage.getItem("username")

      //页面创建，获取所有菜单
      this.getMenus()
      //使页面刷新后二级菜单的激活状态不丢失
      this.activeIndex=window.sessionStorage.getItem('activeIndex')
    },
    data() {
      return {
        menus:[],
        iconsObj:{
          '1':'iconfont icon-xiangmuguanli-',
          '2':'iconfont icon-yonghuguanli',
          '3':'iconfont icon-hezuo',
          '4':'iconfont icon-zhiding',
          '5':'iconfont icon-shouji',
          '6':'iconfont icon-wulianwang-'
        },
        //控制导航栏折叠
        isCollapse:false,
        //被选中的二级菜单
        activeIndex:'',
        username:''
      }
    },
    methods: {
      logout() {
        let username = window.sessionStorage.getItem('username');
        axios.delete("evenstar/user/logout",{
          params:{username:username}
        })
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      async getMenus(){
        const {data}=await axios.get('evenstar/menu/getAll',{
          params:{username:this.username}
        })
        this.menus=data
      },
      toggleMenu(){
        this.isCollapse=!this.isCollapse
      },
      saveActiveState(activeIndex){
        window.sessionStorage.setItem('activeIndex',activeIndex)
        this.activeIndex=activeIndex
      }
    }
  }
</script>

<style scoped lang="less">
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;

    div {
      display: flex;
      align-content: center;

      span {
        font-size: 30px;
        color: white;
      }

      img {
        width: 60px;
        height: 60px;
        margin-right: 20px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #E9EDF1;
  }

  .home-container {
    height: 100vw;
  }

  .iconfont{
    height: 50px;
    width: 50px;
    margin-right: 15px;
  }

  .toggle-button{
    height: 25px;
    background-color: #4a5064;
    color: white;
    text-align: center;
  }
</style>
