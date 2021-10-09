<template>
    <div>
        <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-input v-model="queryInfo.query" placeholder="请输入用户名称或账号查询" clearable>
                                <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" @click="dialogFormVisible = true">新增用户</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div>
                    <el-table :data="tableData" style="width: 100%;height: 100%;" border row-key="UserId">
                        <el-table-column prop="Name" sortable label="用户昵称" min-width="120"></el-table-column>
                        <el-table-column prop="UserName" sortable label="用户账号" min-width="120"></el-table-column>

                        <el-table-column prop="Phone" label="手机号" min-width="120"></el-table-column>
                        <el-table-column prop="Email" label="邮箱" min-width="120"></el-table-column>

                        <el-table-column prop="AddTime" sortable label="添加时间" min-width="120"></el-table-column>
                        <el-table-column prop="ModifyTime" sortable label="最后修改时间" min-width="120"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button type="info" size="mini" @click="edit(scope.row.UserId)">编辑</el-button>
                                    <el-button type="danger" size="mini" @click="del(scope.row.UserId)">删除</el-button>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="limits" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
            </el-card>

            <el-dialog title="新增用户" :visible.sync="dialogFormVisible" center width="30%">
                <el-form :model="form" :rules="Rules" ref="addRuleForm">
                    <el-form-item label="用户昵称" :label-width="formLabelWidth" prop="Name">
                        <el-input v-model="form.Name" autocomplete="off" placeholder="请输入用户昵称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="用户账号" :label-width="formLabelWidth" prop="UserName">
                        <el-input v-model="form.UserName" autocomplete="off" placeholder="请输入用户账号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" :label-width="formLabelWidth" prop="Phone">
                        <el-input v-model="form.Phone" autocomplete="off" placeholder="请输入手机号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth" prop="Email">
                        <el-input v-model="form.Email" autocomplete="off" placeholder="请输入邮箱" clearable></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="编辑用户" :visible.sync="dialogFormEditVisible" center width="30%">
                <el-form :model="editForm" :rules="Rules" ref="editRuleForm">
                    <el-form-item label="用户昵称" :label-width="formLabelWidth" prop="Name">
                        <el-input v-model="editForm.Name" autocomplete="off" placeholder="请输入用户昵称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="用户账号" :label-width="formLabelWidth" prop="UserName">
                        <el-input v-model="editForm.UserName" autocomplete="off" placeholder="请输入用户账号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" :label-width="formLabelWidth" prop="Phone">
                        <el-input v-model="editForm.Phone" autocomplete="off" placeholder="请输入手机号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth" prop="Email">
                        <el-input v-model="editForm.Email" autocomplete="off" placeholder="请输入邮箱" clearable></el-input>
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
        var checkPhone = (rule, value, callback) => {
            const phoneReg = /^1[345789]\d{9}$/
            if (!Number.isInteger(+value)) {
                callback(new Error('请输入数字值'))
            } else {
                if (phoneReg.test(value) || value === '') {
                    callback()
                } else {
                    callback(new Error('电话号码格式不正确'))
                }
            }
        }
        var checkEmail = (rule, value, callback) => {
            const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/

            if (mailReg.test(value) || value === '') {
                callback()
            } else {
                callback(new Error('请输入正确的邮箱格式'))
            }
        }

        return {
            queryInfo: {
                query: '',
                pageIndex: 1,
                pageSize: 20
            },
            form: {
                Name: '',
                UserName: '',
                Phone: '',
                Email: ''
            },
            editForm: {
                UserId: '',
                Name: '',
                UserName: '',
                Phone: '',
                Email: ''
            },
            Rules: {
                Name: [{
                    required: true,
                    message: '请输入用户昵称',
                    trigger: 'blur'
                }],
                UserName: [{
                    required: true,
                    message: '请输入用户账号',
                    trigger: 'blur'
                }],
                Phone: [{
                    validator: checkPhone,
                    trigger: 'blur'
                }],
                Email: [{
                    validator: checkEmail,
                    trigger: 'blur'
                }]
            },
            tableData: [],
            total: 0,
            showColumn: false,
            limits: [2, 5, 10, 20],
            dialogFormVisible: false,
            dialogFormEditVisible: false,
            formLabelWidth: '120px',
            menuOptions: []
        }
    },

    created() {
        this.loadData()
    },

    methods: {
        handleSizeChange(val) {
            this.queryInfo.pageSize = val
            this.queryInfo.pageIndex = 1
            this.loadData()
        },
        handleCurrentChange(val) {
            this.queryInfo.pageIndex = val
            this.loadData()
        },
        search() {
            this.loadData()
        },
        loadData() {
            this.$http
                .get('/api/SysUser/GetUserList', {
                    params: this.queryInfo
                })
                .then((res) => {
                    if (!res) {
                        return this.$message.error('获取用户列表出错')
                    }
                    this.tableData = res.data.Object.data
                    this.total = res.data.Object.count
                })
                .catch((err) => {})
        },
        submit() {
            this.$refs.addRuleForm.validate((isvalid) => {
                if (!isvalid) {
                    return false
                } else {
                    this.$http
                        .post('/api/SysUser/AddUser', this.form)
                        .then((res) => {
                            if (!res) {
                                return this.$message.error('添加用户发生异常!')
                            }
                            var rtnData = res.data
                            if (rtnData.Code !== 1) {
                                return this.$message.error(rtnData.Message)
                            } else {
                                this.loadData()
                                this.dialogFormVisible = false
                                this.$refs.addRuleForm.resetFields()
                                return this.$message.success('用户添加成功!')
                            }
                        })
                        .catch((error) => {
                            var rtnData = error.data
                            this.$message.error(rtnData.Message)
                        })
                }
            })
        },
        del(UserId) {
            if (!UserId) {
                return
            }
            this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                })
                .then(() => {
                    this.$http
                        .delete('/api/SysUser/DelUser', {
                            params: {
                                UserId: UserId
                            }
                        })
                        .then((res) => {
                            if (!res) {
                                return this.$message.error('删除用户发生异常!')
                            }
                            var rtnData = res.data
                            if (rtnData.Code !== 1) {
                                return this.$message.error(rtnData.Message)
                            } else {
                                this.loadData()
                                return this.$message.success('用户删除成功')
                            }
                        })
                        .catch((error) => {
                            return this.$message.error(error.data.Message)
                        })
                })
                .catch(() => {})
        },
        edit(UserId) {
            if (!UserId) {
                return this.$message.error('参数错误')
            }
            this.$http
                .get('/api/SysUser/GetUserInfo', {
                    params: {
                        UserId: UserId
                    }
                })
                .then((res) => {
                    if (!res) {
                        return this.$message.error('获取用户信息发生异常!')
                    }
                    var rtnData = res.data
                    if (rtnData.Code !== 1) {
                        return this.$message.error(rtnData.Message)
                    } else {
                        this.editForm = rtnData.Object
                        this.dialogFormEditVisible = true
                    }
                })
                .catch((err) => {})
        },
        editSubmit() {
            this.$refs.editRuleForm.validate((isvalid) => {
                if (!isvalid) {
                    return false
                } else {
                    this.$http
                        .put('/api/SysUser/UpdateUserInfo', this.editForm)
                        .then((res) => {
                            if (!res) {
                                return this.$message.error('修改用户发生异常!')
                            }
                            var rtnData = res.data
                            if (rtnData.Code !== 1) {
                                return this.$message.error(rtnData.Message)
                            } else {
                                this.loadData()
                                this.dialogFormEditVisible = false
                                this.$refs.editRuleForm.resetFields()
                                return this.$message.success('用户修改成功!')
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                            var rtnData = error.data
                            this.$message.error(rtnData.Message)
                        })
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
</style>
