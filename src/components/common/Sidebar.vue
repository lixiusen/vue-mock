<template>
  <aside :class="collapsed?'menu-collapsed':'menu-expanded'" class="slide-wrap">
    <!--导航菜单-->
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      unique-opened
      router
      v-if="!collapsed"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
        <el-submenu :index="index+''" v-if="!item.leaf">
          <template slot="title"><i :class="item.iconCls"></i>{{ item.name }}</template>
          <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">
            {{ child.name }}
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-if="item.leaf && item.children.length>0" :index="item.children[0].path">
          <i :class="item.iconCls"></i>
          {{item.children[0].name}}
        </el-menu-item>
      </template>
    </el-menu>
    <!--导航菜单-折叠后-->
    <ul
      class="el-menu el-menu-vertical-demo collapsed"
      v-else="collapsed"
      ref="menuCollapsed"
    >
      <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
        <template v-if="!item.leaf">
          <div class="el-submenu__title" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
            <i :class="item.iconCls"></i>
          </div>
          <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
            <li
              v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item"
              :class="$route.path == child.path?'is-active':''"
              @click="$router.push(child.path)"
            >
              {{ child.name }}
            </li>
          </ul>
        </template>
        <template v-else>
          <ul>
            <li class="el-submenu">
              <div class="el-submenu__title el-menu-item"
                   :class="$route.path == item.children[0].path?'is-active':''"
                   @click="$router.push(item.children[0].path)"
                   style="padding: 0 20px; min-width: 60px"
              >
                <i :class="item.iconCls"></i>
              </div>
            </li>
          </ul>
        </template>
      </li>
    </ul>
  </aside>
</template>

<script>
  import bus from '../common/bus'
    export default {
      name: "Sidebar",
      data(){
          return{
            collapsed:false
          }
      },
      methods:{
        showMenu(i,status){
          this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
        },
      },
      created(){
        //通过Event Bus 进行组件间通讯，来折叠侧边栏
        bus.$on('collapsed',msg => {
          this.collapsed = msg;
        })
      }
    }
</script>

<style scoped lang="scss">
  .slide-wrap{
    display: block;
    position: absolute;
    left: 0;
    top:60px;
    bottom:0;
    .el-menu{
      width: 230px;
      height: 100%;
      i.fa{
        vertical-align: middle;
        margin-right: 5px;
        width: 18px;
        font-size: 14px;
      }
    }
    .collapsed{
      width: 60px;
      background-color: #545c64;
      :hover{
        background-color: #454b51;
      }
      .item{
        position: relative;
      }
      .submenu{
        position: absolute;
        top:0px;
        left: 66px;
        z-index: 999;
        height: auto;
        border-radius: 4px;
        display: none;
        animation: scaleBox .3s ease;
        background-color: #545c64;
        .el-menu-item{
          color: #fff;
          position: relative;
          &:after{//解决鼠标经过空白间隙时弹出层不显示
            position: absolute;
            content: "";
            left: -6px;
            top:0;
            bottom:0;
            width: 6px;
            height: 100%;
            background-color: transparent;
          }
          &.is-active{
            color: #ffd04b;
          }
        }
      }
    }
  }
</style>
