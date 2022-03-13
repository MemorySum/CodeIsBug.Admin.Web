<template>
<div>
    <el-container class="home-container">
        <el-header>
            <div class="logo">
                <span>CodeIsBug.Admin 后台管理系统</span>
            </div>
            <el-dropdown @command="IndexHeaderEnvent">
                <span class="el-dropdown-link">
                    <span>{{this.userName }}</span><span>,拥有角色：{{this.userRoleName}}</span><i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <el-link href="http://localhost:8099/swagger" target="_blank" :underline="false">
                            Api文档
                        </el-link>
                    </el-dropdown-item>
                    <el-dropdown-item command="logOut">退出系统</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container>
            <el-aside :width="IsCospace ? '60px' : '200px'">
                <div class="meun_toggle" @click="toggleCospace">
                    <i :class="IsCospace ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
                </div>

                <el-menu width="200px" background-color="#393D49" text-color="#fff" active-text-color="#409eff" :collapse-transition="true" :collapse="IsCospace" unique-opened router :default-active="this.$route.path">
                    <el-menu-item slot="index">
                        <template>
                            <i class="el-icon-house"></i>
                            <span>首页</span>
                        </template>
                    </el-menu-item>
                    <el-submenu :index="item.MenuId" v-for="item in menuIndex" :key="item.MenuId">
                        <template slot="title">
                            <i :class="item.Icon"></i>
                            <span>{{ item.Name }}</span>
                        </template>
                        <el-menu-item :index="Children.Url" v-for="Children in item.Children" :key="Children.Url">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ Children.Name }}</span>
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
            IsCospace: false,
            menuIndex: [],
            userName: '',
            userRoleName: ''
        }
    },
    created() {
        this.loadIndexInfo()
        // this.getIndexMenu();
    },
    methods: {
        IndexHeaderEnvent(command) {
          switch (command) {
            case 'logOut':
              sessionStorage.removeItem('user_access_Token')
              sessionStorage.removeItem('userInfo')
              this.$router.push('/login')
              break
          }
        },
        toggleCospace() {
          this.IsCospace = !this.IsCospace
        },
        loadIndexInfo() {
          const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            if (userInfo != null) {
                this.userName = userInfo.UserName
                this.menuIndex = userInfo.UserMenus
                this.userRoleName = userInfo.UserRoleName
            }
        },
        getIndexMenu() {
          this.$http
            .get('/api/Menu/GetAllMenuForIndex')
                .then((res) => {
                  if (!res) {
                    return this.$message.error('获取左侧菜单发生异常!')
                  }
                  var rtnData = res.data
                  if (rtnData.Code !== 1) {
                    return this.$message.error(rtnData.Message)
                  } else {
                    this.menuIndex = JSON.parse(rtnData.Object)
                  }
                })
            .catch((error) => {
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
    background-color: #23262e;
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
    background-color: #393d49;

    .el-menu {
        border-right: none;
    }
}

.el-main {
    display: flex;
    flex-direction: column;
}

.meun_toggle {
    background-color: #4a5064;
    text-align: center;
    line-height: 24px;
    color: #fff;
}

.el-submenu i {
    margin-right: 5px;
}
</style>
