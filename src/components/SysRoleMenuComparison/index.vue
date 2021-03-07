<template>
    <div>
        <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>角色授权</el-breadcrumb-item>
                <el-breadcrumb-item>角色授权列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card style="float: left; width: 49%; heigth: 100%">
            <div slot="header" class="clearfix">
                <span>角色列表</span>
            </div>
            <div>
                <el-tree ref="roleTree" :data="this.RoleTreeData" node-key="RoleId" :props="this.defaultProps" default-expand-all check-strictly highlight-current @node-click="GetMenuInfoByRoleId">
                </el-tree>
            </div>
        </el-card>

        <el-card style="float: right; width: 50%; heigth: 100%">
            <div slot="header" class="clearfix">
                <span>菜单列表</span>
                <el-button style="float: right" type="primary" size="small" @click="saveRoleMenuSubmit">保存授权</el-button>
            </div>
            <div>
                <el-tree ref="menuTree" :data="this.MenuTreeData" node-key="MenuId" show-checkbox :props="this.defaultProps" default-expand-all>
                </el-tree>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            RoleTreeData: [],
            MenuTreeData: [],
            defaultProps: {
                children: "Children",
                label: "Name",
            },
            saveRoleMenuInfo: {
                RoleId: null,
                selectMenuIds: [],
            },
        };
    },
    created() {
        this.loadRoleTreeData();
        this.loadMenuTreeData();
    },
    methods: {
        loadRoleTreeData() {
            this.$http
                .get("/api/Roles/GetRoles")
                .then((res) => {
                    if (!res) {
                        return this.$message.error("获取角色列表出错");
                    }

                    this.RoleTreeData = res.data.Object;
                })
                .catch((err) => {});
        },
        loadMenuTreeData() {
            this.$http
                .get("/api/Menu/GetMenus", {
                    params: this.queryInfo,
                })
                .then((res) => {
                    if (!res) {
                        return this.$message.error("获取菜单列表出错");
                    }
                    this.MenuTreeData = res.data.Object.data;
                })
                .catch((err) => {});
        },
        GetMenuInfoByRoleId(data) {
            if (!data.RoleId) {
                return this.$message.error("请选择一条角色信息");
            }
            this.$http
                .get("/api/RoleMenuMap/GetMenuListByRoleId", {
                    params: {
                        roleGuid: data.RoleId,
                    },
                })
                .then((res) => {
                    if (!res) {
                        return this.$message.error("获取菜单列表出错");
                    }
                    var rtnData = res.data;
                    if (rtnData.Code < 0) {
                        return this.$message.error(rtnData.Message);
                    } else {
                        this.saveRoleMenuInfo.RoleId=data.RoleId
                        this.$refs.menuTree.setCheckedKeys(rtnData.Object);
                    }
                })
                .catch((err) => {});

        },

        saveRoleMenuSubmit() {

          if (!this.saveRoleMenuInfo.RoleId) {
                return this.$message.error("请先选择一条角色信息");
            }
            var CheckedNodes = this.$refs.menuTree.getCheckedKeys(false);

            if (CheckedNodes.length === 0) {
                return this.$message.error("请至少分配一个菜单权限以保证首页加载正常");
            }
            this.saveRoleMenuInfo.selectMenuIds = CheckedNodes; //获取所有选中的菜单
            this.$confirm('是否确认分配菜单权限?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                })
                .then(() => {
                    this.$http
                        .post("/api/RoleMenuMap/SaveRoleMenuInfo", this.saveRoleMenuInfo)
                        .then((res) => {
                            if (!res) {
                                return this.$message.error("保存菜单权限发生异常!");
                            }
                            var rtnData = res.data;
                            if (rtnData.Code !== 1) {
                                return this.$message.error(rtnData.Message);
                            } else {
                                return this.$message.success("菜单权限保存成功!");
                            }
                        })
                        .catch((error) => {});
                });
        },
    },
};
</script>

<style lang="less" scoped>
</style>
