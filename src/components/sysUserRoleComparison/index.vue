<template>
    <div>
        <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户角色对照</el-breadcrumb-item>
                <el-breadcrumb-item>用户角色对照列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card style="float: left; width: 49%; heigth: 100%">
            <div slot="header" class="clearfix">
                <span>用户列表</span>
            </div>
            <div>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-input v-model="queryInfo.query" placeholder="请输入用户名称或账号查询" clearable>
                            <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
                <div>
                    <el-table :data="tableData" style="width: 100%; height: 100%" border row-key="UserId" highlight-current-row @current-change="getRoleByUserId">
                        <el-table-column prop="Name" sortable label="用户昵称" min-width="120"></el-table-column>
                        <el-table-column prop="UserName" sortable label="用户账号" min-width="120"></el-table-column>
                    </el-table>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="limits" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
            </div>
        </el-card>
        <el-card style="float: right; width: 50%; heigth: 100%">
            <div slot="header" class="clearfix">
                <span>角色列表</span>
                <el-button style="float: right" type="primary" size="small" @click="saveRoleInfoEvent">保存角色</el-button>
            </div>
            <div>
                <el-tree ref="roleTree" :data="this.treeData" node-key="RoleId" show-checkbox :props="this.defaultProps" default-expand-all check-strictly>
                </el-tree>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            treeData: [],
            total: 0,
            showColumn: false,
            limits: [2, 5, 10, 20],
            queryInfo: {
                query: "",
                pageIndex: 1,
                pageSize: 20,
            },
            defaultProps: {
                children: "Children",
                label: "Name",
            },
            saveRoleInfo: {
                UserId: null,
                selectRoleIds: [],
            },
        };
    },
    created() {
        this.loadUserData();
        this.loadRoleTreeData();
    },
    methods: {
        handleSizeChange(val) {
            this.queryInfo.pageSize = val;
            this.queryInfo.pageIndex = 1;
            this.loadData();
        },
        handleCurrentChange(val) {
            this.queryInfo.pageIndex = val;
            this.loadData();
        },
        search() {
            this.loadUserData();
        },
        loadUserData() {
            this.$http
                .get("/api/SysUser/GetUserList", {
                    params: this.queryInfo,
                })
                .then((res) => {
                    if (!res) {
                        return this.$message.error("获取用户列表出错");
                    }
                    this.tableData = res.data.Object.data;
                    this.total = res.data.Object.count;
                })
                .catch((err) => {});
        },
        loadRoleTreeData() {
            this.$http
                .get("/api/Roles/GetRoles")
                .then((res) => {
                    if (!res) {
                        return this.$message.error("获取角色列表出错");
                    }

                    this.treeData = res.data.Object;
                })
                .catch((err) => {});
        },
        getRoleByUserId(row) {
            if (!row.UserId) {
                return this.$message.error("请选择一条用户信息");
            }
            this.$http
                .get("/api/EmpRoleMap/GetUserRolesByUserId", {
                    params: {
                        userGuid: row.UserId,
                    },
                })
                .then((res) => {
                    if (!res) {
                        return this.$message.error("获取角色列表出错");
                    }
                    var rtnData = res.data;
                    if (rtnData.Code < 0) {
                        return this.$message.error(rtnData.Message);
                    } else {
                        this.saveRoleInfo.UserId = row.UserId;
                        this.$refs.roleTree.setCheckedKeys(rtnData.Object);
                    }
                })
                .catch((err) => {});
        },
        saveRoleInfoEvent() {
            if (!this.saveRoleInfo.UserId) {
                return this.$message.error("请先选择一条用户信息");
            }
            var CheckedNodes = this.$refs.roleTree.getCheckedKeys(false);

            if (CheckedNodes.length === 0) {
                return this.$message.error("请至少分配一个角色以保证首页加载正常");
            }
            this.saveRoleInfo.selectRoleIds = CheckedNodes; //获取所有选中的角色
            this.$confirm('是否确认分配角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                })
                .then(() => {
                    this.$http
                        .post("/api/EmpRoleMap/SaveRoleId", this.saveRoleInfo)
                        .then((res) => {
                            if (!res) {
                                return this.$message.error("保存角色发生异常!");
                            }
                            var rtnData = res.data;
                            if (rtnData.Code !== 1) {
                                return this.$message.error(rtnData.Message);
                            } else {
                                return this.$message.success("角色保存成功!");
                            }
                        })
                        .catch((error) => {});
                });
        },
    },
};
</script>
