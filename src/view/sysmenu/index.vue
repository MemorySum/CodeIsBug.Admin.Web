<template>
<div>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
            <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleChangeTab">
            <el-tab-pane label="菜单列表" name="MenuList">
                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <el-button type="primary" @click="dialogFormVisible = true">新增菜单</el-button>
                    </div>
                    <div>
                        <el-table :data="tableData" style="width: 100%;height: 100%;" border row-key="MenuId" default-expand-all :tree-props="{children: 'Children', hasChildren: 'hasChildren'}">
                            <el-table-column prop="Name" sortable label="菜单名称" min-width="120">
                                <template slot-scope="scope">
                                    <i :class="scope.row.Icon"></i>
                                    <span style="margin-left: 5px;">{{ scope.row.Name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="Url" label="地址" min-width="120"></el-table-column>
                            <el-table-column prop="Level" sortable label="层级" min-width="60">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.Level===0">
                                        <el-tag type="success">一级菜单</el-tag>
                                    </div>
                                    <div v-else>
                                        <el-tag type="warning">二级菜单</el-tag>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="Sort" sortable label="排序" min-width="60"></el-table-column>
                            <el-table-column prop="AddTime" sortable label="添加时间" min-width="120"></el-table-column>
                            <el-table-column prop="ModifyTime" sortable label="最后修改时间" min-width="120"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button-group>
                                        <el-button type="info" size="mini" @click="edit(scope.row.MenuId)">编辑</el-button>
                                        <el-button type="danger" size="mini" :disabled="scope.row.Level===0" @click="del(scope.row.MenuId)">删除</el-button>
                                    </el-button-group>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-tab-pane>
            <el-tab-pane label="按钮配置" name="ButtonList"></el-tab-pane>
        </el-tabs>

        <el-dialog title="新增菜单" :visible.sync="dialogFormVisible" center width="30%" @open="loadingData">
            <el-form :model="form" :rules="Rules" ref="addRuleForm">
                <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="Name">
                    <el-input v-model="form.Name" autocomplete="off" placeholder="请输入菜单名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="父级菜单名称" :label-width="formLabelWidth" prop="ParentId">
                    <el-select v-model="form.ParentId" placeholder="请选择父级菜单" clearabl size="medium">
                        <el-option label="无" value="00000000-0000-0000-0000-000000000000"></el-option>
                        <el-option v-for="item in menuOptions" :key="String(item.MenuId)" :label="item.Name" :value="String(item.MenuId)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图标" :label-width="formLabelWidth">
                    <e-icon-picker v-model="form.Icon"></e-icon-picker>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input v-model="form.Url" autocomplete="off" placeholder="请填入菜单地址" clearabl></el-input>
                </el-form-item>

                <el-form-item label="层级" :label-width="formLabelWidth">
                    <el-select v-model="form.Level" placeholder="请选择层级" clearabl size="medium">
                        <el-option label="一级菜单" value="0"></el-option>
                        <el-option label="二级菜单" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input type="number" v-model="form.Sort" autocomplete="off" placeholder="请输入排序" clearabl></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑菜单" :visible.sync="dialogFormEditVisible" center width="30%" @open="loadingEditData">
            <el-form :model="editForm" :rules="Rules" ref="editRuleFormRef">
                <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="Name">
                    <el-input v-model="editForm.Name" autocomplete="off" placeholder="请输入菜单名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="父级菜单名称" :label-width="formLabelWidth" prop="ParentId">
                    <el-select v-model="editForm.ParentId" placeholder="请选择父级菜单" clearabl size="medium">
                        <el-option label="无" value="00000000-0000-0000-0000-000000000000"></el-option>
                        <el-option v-for="item in menuOptions" :key="String(item.MenuId)" :label="item.Name" :value="String(item.MenuId)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图标" :label-width="formLabelWidth">

                    <e-icon-picker v-model="editForm.Icon"></e-icon-picker>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input v-model="editForm.Url" autocomplete="off" placeholder="请填入菜单地址" clearable> </el-input>
                </el-form-item>

                <el-form-item label="层级" :label-width="formLabelWidth">
                    <el-select v-model="editForm.Level" placeholder="请选择层级" clearabl size="medium">
                        <el-option label="一级菜单" value="0"></el-option>
                        <el-option label="二级菜单" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input type="number" v-model="editForm.Sort" autocomplete="off" placeholder="请输入排序" clearable></el-input>
                    <el-input type="hidden" v-model="editForm.MenuId"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormEditVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            form: {
                Name: '',
                Icon: '',
                Url: '',
                Level: '0',
                Sort: '',
                ParentId: '00000000-0000-0000-0000-000000000000',
                Children: []
            },
            editForm: {
                MenuId: '0',
                Name: '',
                Icon: '',
                Url: '',
                Level: '0',
                Sort: '',
                ParentId: '00000000-0000-0000-0000-000000000000'
            },
            loading: false,
            dialogFormVisible: false,
            dialogFormEditVisible: false,
            formLabelWidth: '120px',
            activeName: 'MenuList',
            Rules: {
                Name: [{
                    required: true,
                    message: '请输入菜单名称',
                    trigger: 'blur'
                }],
                ParentId: [{
                    required: true,
                    message: '请选择二级菜单',
                    trigger: 'blur'
                }]
            },

            menuOptions: []
        }
    },
    created() {
        this.loadData()
    },
    methods: {
        loadData() {
            this.$http
                .get('/api/Menu/GetAllMenu', {
                    params: this.queryInfo
                })
                .then(res => {
                    if (!res) {
                        return this.$message.error('获取菜单列表出错')
                    }
                    this.tableData = res.data.Object.data
                    this.total = res.data.Object.count
                })
                .catch(err => {})
        },
        search() {
            this.loadData()
        },
        handleSizeChange(val) {
            this.queryInfo.pageSize = val
            this.queryInfo.pageIndex = 1
            this.loadData()
        },
        handleCurrentChange(val) {
            this.queryInfo.pageIndex = val
            this.loadData()
        },

        handleChange() {},
        submit() {
            this.$refs.addRuleForm.validate(isvalid => {
                if (!isvalid) {
                    return false
                } else {
                    this.$http
                        .post('/api/Menu/AddMenu', this.form)
                        .then(res => {
                            if (!res) {
                                return this.$message.error('添加菜单发生异常!')
                            }
                            var rtnData = res.data
                            if (rtnData.Code !== 1) {
                                return this.$message.error(rtnData.Message)
                            } else {
                                this.loadData()
                                this.$refs.addRuleForm.resetFields()
                                this.dialogFormVisible = false
                                return this.$message.success('菜单添加成功!')
                            }
                        })
                        .catch(error => {
                            var rtnData = error.data
                            this.$message.error(rtnData.Message)
                        })
                }
            })
        },
        editSubmit() {
            this.$refs.editRuleFormRef.validate(isvalid => {
                if (!isvalid) {
                    return false
                } else {
                    this.$http
                        .put('/api/Menu/UpdateMenu', this.editForm)
                        .then(res => {
                            if (!res) {
                                return this.$message.error('修改菜单发生异常!')
                            }
                            var rtnData = res.data
                            if (rtnData.Code !== 1) {
                                return this.$message.error(rtnData.Message)
                            } else {
                                this.loadData()

                                this.$refs.editRuleFormRef.resetFields()
                                this.dialogFormEditVisible = false
                                return this.$message.success('菜单修改成功!')
                            }
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
            })
        },
        loadingData() {
            if (!this.dialogFormVisible) {
                return false
            }
            this.getAllFirstLevelMenu()
        },
        loadingEditData() {
            if (!this.dialogFormEditVisible) {
                return false
            }
        },
        getAllFirstLevelMenu() {
            this.$http
                .get('/api/Menu/GetAllFirstLevelMenu')
                .then(res => {
                    if (!res) {
                        return this.$message.error('获取一级菜单发生异常!')
                    }
                    var rtnData = res.data
                    if (rtnData.Code !== 1) {
                        return this.$message.error(rtnData.Message)
                    } else {
                        this.menuOptions = rtnData.Object
                    }
                })
                .catch(error => {
                    return this.$message.error(error.data.Message)
                })
        },
        edit(id) {
            if (!id) {
                return
            }
            this.getAllFirstLevelMenu()
            this.$http
                .get('/api/Menu/GetMenuInfo', {
                    params: {
                        menuId: id
                    }
                })
                .then(res => {
                    if (!res) {
                        return this.$message.error('获取一级菜单发生异常!')
                    }
                    var rtnData = res.data
                    if (rtnData.Code !== 1) {
                        return this.$message.error(rtnData.Message)
                    } else {
                        rtnData.Object.Level = rtnData.Object.Level.toString()
                        rtnData.Object.ParentId = rtnData.Object.ParentId.toString()
                        this.editForm = rtnData.Object
                        this.dialogFormEditVisible = true
                    }
                })
                .catch(error => {
                    var rtnData = error.data
                    return this.$message.error(rtnData.Message)
                })
        },
        del(id) {
            if (!id) {
                return
            }
            this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                })
                .then(() => {
                    this.$http
                        .delete('/api/Menu/DelMenu', {
                            params: {
                                menuId: id
                            }
                        })
                        .then(res => {
                            if (!res) {
                                return this.$message.error('删除菜单发生异常!')
                            }
                            var rtnData = res.data
                            if (rtnData.Code !== 1) {
                                return this.$message.error(rtnData.Message)
                            } else {
                                this.loadData()
                                return this.$message.success('菜单删除成功')
                            }
                        })
                        .catch(error => {
                            return this.$message.error(error.data.Message)
                        })
                })
                .catch(() => {})
        },
        handleChangeTab(tab, event) {
            console.log(tab, event)
        }

    }
}
</script>

<style lang="less" scoped>
.el-row {
    margin-right: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-card {
    display: flexbox;
    height: 100%;
}

.card-table {
    display: block;
    height: 100%;
}
</style>
