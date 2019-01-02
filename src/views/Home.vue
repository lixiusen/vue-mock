<template>
  <div class="container">
    <header class="header">
      <div class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        {{ collapsed?'':sysName }}
      </div>
      <div class="tools" @click.prevent="collapse">
        <i class="fa fa-align-justify"></i>
      </div>
      <div class="userinfo">
        <el-dropdown trigger="hover">
          <div class="el-dropdown-link userinfo-inner"><span>{{ this.sysUserName }}</span><img src="../assets/avatars.jpg" alt=""></div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <v-sidebar></v-sidebar>
    <section class="content-container" :style="this.collapsed?'left:60px':''">
      <div class="breadcrumb-container">
        <v-tags></v-tags>
      </div>
      <div class="content-wrapper">
        <!--面包屑-->
        <el-breadcrumb separator="/" class="breadcrumb-inner">
          <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
            {{item.name}}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import bus from '@/components/common/bus.js'
  import vTags from '@/components/common/Tags.vue'
  import vSidebar from '@/components/common/Sidebar.vue'
  export default {
    name: "Home",
    data(){
      return{
        collapsed:false,
        sysName:'后台管理系统',
        sysUserName:'',
        sysUserAvatar:'../assets/avatars.jpg'
      }
    },
    components:{
      vTags,vSidebar
    },
    methods:{
      collapse: function () {
        this.collapsed = !this.collapsed;
        bus.$emit('collapsed',this.collapsed)
      },
      logout: function () {
        var _this=this;
        this.$confirm('确定要退出吗？','提示',{
          type:'warning'
        }).then(() => {
          localStorage.removeItem('user');
          _this.$router.push('/login');
        }).catch( ()=>{
          return false
        })
      }
    },
    mounted(){
      let user = localStorage.getItem('user');
      if(user){
        user = JSON.parse(user).name;
        this.sysUserName = user || '用户';
      }
    }

  }
</script>

<style scoped lang="scss">
  @import '../styles/vars.scss';
  .container{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .header{
      width: 100%;
      height: 60px;
      line-height: 60px;
      background: $color-primary;
      .userinfo{
        float: right;
        padding-right: 15px;
        text-align: right;
        .userinfo-inner{
          cursor: pointer;
          color: #fff;
          img{
            margin: 10px 0px 10px 10px;
            float: right;
            width: 40px;
            height: 40px;
            border-radius: 20px;
          }
        }
      }
      .logo{
        float: left;
        box-sizing: border-box;
        height: 60px;
        font-size: 20px;
        padding:0 20px;
        border-right: 1px solid rgba(238,241,146,0.5);
        color: #fff;
        img{
          float: left;
          margin: 10px 10px 10px 18px;
          height: 40px;
        }
      }
      .logo-width{
        width: 230px;
      }
      .logo-collapse-width{
        width: 60px;
      }
      .tools{
        float: left;
        padding: 0 23px;
        width: 14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
        color: #fff;
      }
    }
    .content-container{
      position: absolute;
      left: 230px;
      right: 0;
      top:60px;
      bottom:0;
      padding-bottom: 30px;
      transition: left .3s ease-in-out;
      background-color: #f0f0f0;
      .breadcrumb-container{
        .title{
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner{
          float: right;
        }
      }
      .content-wrapper{
        float: none;
        width: auto;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        overflow-y: auto;
        .breadcrumb-inner{
          margin: 10px 0;
        }
      }
      .content{
        padding: 30px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
        overflow: hidden;
      }
    }
  }
  @keyframes scaleBox {
    0%{ transform: scale(0.9)}
    100%{ transform: scale(1)}
  }
</style>
