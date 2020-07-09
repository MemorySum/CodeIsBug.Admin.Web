<template>
  <div>
    <el-container class="home-container">
      <el-header>
        <div class="logo">
          <img src="../assets/bg.png" />
          <span>CodeIsBug.Admin 后台管理系统</span>
        </div>
        <el-dropdown @command="IndexHeaderEnvent">
          <span class="el-dropdown-link">
            Admin<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logOut">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside :width="IsCospace? '60px':'200px'">
          <div class="meun_toggle" @click="toggleCospace">
            <i :class="IsCospace?'el-icon-s-unfold':'el-icon-s-fold'"></i>
          </div>
          <el-menu width="200px" background-color="#393D49" text-color="#fff" active-text-color="#ffd04b"
            :collapse-transition="false" :collapse="IsCospace" router unique-opened>
            <el-submenu :index="item.id" v-for="item in menuIndex" :key="item.id">
              <template slot="title">
               <i :class="item.icon"></i>
                <span>{{item.menuName}}</span>
              </template >
              <el-menu-item :index="child.path" v-if="item.children !=null" v-for="child in item.children" :key="child.id">
                <template slot="title">
                  <i :class="child.icon"></i>
                  <span>{{child.menuName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        IsCospace:false,
        menuIndex:[]
      }
    },
    created() {
      this.getIndexMenu()
    },
    methods: {
      IndexHeaderEnvent(command) {
        switch (command) {
          case "logOut":
            sessionStorage.removeItem('user_access_Token')
            this.$router.push('/login')
            break;
        }
      },
      toggleCospace() {
        this.IsCospace = !this.IsCospace
      },
      getIndexMenu(){
        this.$http.get('/api/Menu/GetAllMenuForIndex').then(res=>{
          if (!res) {
            return this.$message.error('获取左侧菜单发生异常!')
          }
          var rtnData = res.data;
          if (rtnData.Code !== 1) {
            return this.$message.error(rtnData.Message)
          } else {
            this.menuIndex =JSON.parse(rtnData.Object)
            console.log(this.menuIndex)
          }
        }).catch(error=>{

        })
      }

    }
  }
</script>

<style lang="less">
  .home-container {
    height: 100vh;
  }

  .el-header {
    background-color: #23262E;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    padding-left: 0;

    >.logo {
      display: flex;
      align-items: center;
      margin-left: 15px;
    }

    img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      border-radius: 50%;
    }

  }

  .el-aside {
    background-color: #393D49;
  }

  .el-main{
    display: flex;
    flex-direction: column;
  }

  .meun_toggle {
    background-color: #4a5064;
    text-align: center;
    line-height: 24px;
    color: #fff;
  }
  .el-submenu i{
    margin-right: 5px;
  }
</style>
