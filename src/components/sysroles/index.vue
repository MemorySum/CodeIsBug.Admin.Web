<template>
<div>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div>
        <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <el-button type="primary" @click="dialogAddFormVisible = true">新增角色</el-button>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%; height: 100%" border row-key="RoleId" default-expand-all :tree-props="{ children: 'Children', hasChildren: 'hasChildren' }">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="Name" label="角色名称" min-width="120"></el-table-column>
                    <el-table-column prop="Sort" label="角色排序" min-width="120"></el-table-column>
                    <el-table-column prop="Remark" label="备注" min-width="120"></el-table-column>
                    <el-table-column prop="AddTime" label="添加时间" min-width="120"></el-table-column>
                    <el-table-column prop="ModifyTime" label="修改时间" min-width="120"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="info" size="mini" @click="edit(scope.row.RoleId)">编辑</el-button>
                                <el-button type="danger" size="mini" @click="del(scope.row.RoleId)">删除</el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
    <div>
        <el-dialog title="新增角色" :visible="dialogAddFormVisible" center width="30%">
            <div style="padding:0 20px">
                <el-form :model="addRoleform" :label-width="formLabelWidth" ref="addFormRef" :rules="Rule">
                    <el-form-item label="角色名称" :label-width="formLabelWidth" prop="Name">
                        <el-input v-model="addRoleform.Name" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="父级角色名称" :label-width="formLabelWidth" prop="ParentId">
                        <treeselect v-model="addRoleform.ParentId" :multiple="false" :options="this.menuOptions" :normalizer="normalizer" placeholder="请选择父级角色" noChildrenText="没有更多了" />
                    </el-form-item>
                    <el-form-item label="排序" :label-width="formLabelWidth" prop="Sort">
                        <el-input type="number" v-model="addRoleform.Sort" autocomplete="off" placeholder="请输入排序" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth" prop="Remark">
                        <el-input v-model="addRoleform.Remark" autocomplete="off" clearable></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddForm">取 消</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </div>
        </el-dialog>
    </div>

    <div>
        <el-dialog title="编辑角色" :visible="dialogEditFormVisible" center width="30%">
            <div style="padding:0 20px">
                <el-form :model="editRoleForm" :label-width="formLabelWidth" ref="editFormRef" :rules="Rule">
                    <el-form-item label="角色名称" :label-width="formLabelWidth" prop="Name">
                        <el-input v-model="editRoleForm.Name" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="父级角色名称" :label-width="formLabelWidth" prop="ParentId">
                        <treeselect v-model="editRoleForm.ParentId" :multiple="false" :options="this.menuOptions" isDefaultExpanded :normalizer="normalizer" placeholder="请选择父级角色" noChildrenText="没有更多了" />
                    </el-form-item>
                    <el-form-item label="排序" :label-width="formLabelWidth" prop="Sort">
                        <el-input type="number" v-model="editRoleForm.Sort" autocomplete="off" placeholder="请输入排序" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth" prop="Remark">
                        <el-input v-model="editRoleForm.Remark" autocomplete="off" clearable></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEditForm">取 消</el-button>
                <el-button type="primary" @click="editsubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>

</div>
</template>

<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    components: {
        Treeselect
    },
    data() {
        return {
            tableData: [], //列表数据
            menuOptions: [], //下拉框数据
            formLabelWidth: "120px", //form表单元素的默认宽度
            dialogAddFormVisible: false, //是否显示添加界面
            dialogEditFormVisible: false, //是否显示修改界面
            ParentItemName: '',
            ParentItemId: '00000000-0000-0000-0000-000000000000',
            addRoleform: {
                Name: "",
                Sort: "",
                Remark: "",
                ParentId: '00000000-0000-0000-0000-000000000000',
            },
            editRoleForm: {
                RoleId: '00000000-0000-0000-0000-000000000000',
                Name: "",
                Sort: "",
                Remark: "",
                ParentId: '00000000-0000-0000-0000-000000000000',
            },
            defaultProps: {
                children: 'Children',
                label: 'Name'
            },
            Rule: {
                Name: [{
                    required: true,
                    message: '请输入角色名称',
                    trigger: 'blur'
                }],
                Sort: [{
                    required: true,
                    message: '请输入角色排序',
                    trigger: 'blur'
                }],
                ParentId: [{
                    required: true,
                    message: '请选择父级角色名称',
                    trigger: 'blur'
                }]

            },
            isClearable: true, // 可清空（可选）
            isAccordion: false, // 可收起（可选）

            normalizer(node) {
                if (node.children && !node.children.length) {
                    delete node.children;
                }
                return {
                    id: node.RoleId,
                    label: node.Name,
                    children: node.Children,
                }
            }
        };

    },
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            this.$http
                .get("/api/Roles/GetRoles")
                .then((res) => {
                    if (!res) {
                        return this.$message.error("获取角色列表出错");
                    }

                    this.tableData = res.data.Object;
                    //深层拷贝对象
                    let obj = JSON.parse(JSON.stringify(res.data.Object))
                    this.menuOptions = obj;
                    let nothing = {
                        RoleId: '00000000-0000-0000-0000-000000000000',
                        Name: '无'
                    }
                    this.menuOptions.unshift(nothing)

                })
                .catch((err) => {});
        },
        //打开编辑页面 请求后端数据
        edit(roleId) {
            if (!roleId) {
                return
            }
            this.$http
                .get('/api/Roles/GetRoleInfo', {
                    params: {
                        roleGuid: roleId
                    }
                })
                .then(res => {
                    if (!res) {
                        return this.$message.error('获取角色信息异常')
                    }
                    var rtnData = res.data
                    if (rtnData.Code !== 1) {
                        return this.$message.error(rtnData.Message)
                    } else {

                        this.dialogEditFormVisible = true
                        this.editRoleForm = rtnData.Object
                    }
                })
                .catch(error => {})

        },
        del(roleId) {
            if (!roleId) {
                return
            }
            this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                })
                .then(() => {
                    this.$http
                        .get('/api/Roles/DelRole', {
                            params: {
                                roleGuid: roleId
                            }
                        })
                        .then(res => {
                            if (!res) {
                                return this.$message.error('删除角色发生异常!')
                            }
                            var rtnData = res.data
                            if (rtnData.Code !== 1) {
                                return this.$message.error(rtnData.Message)
                            } else {
                                this.loadData()
                                return this.$message.success('角色删除成功')
                            }
                        })
                        .catch(error => {})
                })
                .catch(() => {})
        },
        //取消按钮关闭抽屉
        cancelAddForm() {
            this.$refs.addFormRef.resetFields();
            this.dialogAddFormVisible = false;
        },
        cancelEditForm() {
            this.$refs.editFormRef.resetFields();
            this.dialogEditFormVisible = false;
        },
        //新增保存
        submit() {
            this.$refs.addFormRef.validate((isvalid) => {
                if (!isvalid) {
                    return false
                } else {
                    this.$http
                        .post('/api/Roles/AddRole', this.addRoleform)
                        .then((res) => {
                            if (!res) {
                                return this.$message.error('添加角色发生异常!')
                            }

                            var rtnData = res.data
                            if (rtnData.Code !== 1) {
                                return this.$message.error(rtnData.Message)
                            } else {
                                this.loadData()
                                this.dialogAddFormVisible = false
                                this.$refs.addFormRef.resetFields()
                                return this.$message.success('角色添加成功!')
                            }
                        })
                        .catch(error => {})
                }
            })
        },
        editsubmit() {
            this.$refs.editFormRef.validate((isvalid) => {
                if (!isvalid) {
                    return false
                } else {
                    this.$http
                        .post('/api/Roles/EditRoleInfo', this.editRoleForm)
                        .then((res) => {
                            if (!res) {
                                return this.$message.error('修改角色发生异常!')
                            }

                            var rtnData = res.data
                            if (rtnData.Code !== 1) {
                                return this.$message.error(rtnData.Message)
                            } else {
                                this.loadData()
                                this.dialogEditFormVisible = false
                                this.$refs.editFormRef.resetFields()
                                return this.$message.success('角色修改成功!')
                            }
                        })
                        .catch(error => {})
                }
            })
        }
    },
};
</script>

<style lang="less" scoped>
</style>
