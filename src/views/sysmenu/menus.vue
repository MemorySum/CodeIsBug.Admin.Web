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
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input v-model="queryInfo.query" placeholder="请输入菜单名称查询" clearable>
                <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="dialogFormVisible = true">新增菜单</el-button>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-table
            :data="tableData"
            style="width: 100%;height: 100%;"
            border
            row-key="MenuId"
            default-expand-all
            :tree-props="{children: 'children'}"
          >
            <el-table-column prop="Name" sortable label="菜单名称" min-width="120"></el-table-column>

            <el-table-column prop="Icon" label="图标" min-width="60" center>
              <template slot-scope="scope">
                <i :class="scope.row.Icon"></i>
              </template>
            </el-table-column>
            <el-table-column prop="Url" label="地址" min-width="120"></el-table-column>

            <el-table-column prop="Level" sortable label="层级" min-width="60"></el-table-column>
            <el-table-column prop="Sort" sortable label="排序" min-width="60"></el-table-column>
            <el-table-column prop="AddTime" sortable label="添加时间" min-width="120"></el-table-column>
            <el-table-column prop="ModifyTime" sortable label="最后修改时间" min-width="120"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button type="info" size="mini" @click="edit(scope.row.MenuId)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="del(scope.row.MenuId)">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="limits"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :background="true"
          ></el-pagination>
        </div>
      </el-card>

      <el-dialog
        title="新增菜单"
        :visible.sync="dialogFormVisible"
        center
        width="30%"
        @open="loadingData"
      >
        <el-form :model="form" :rules="Rules" ref="addRuleForm">
          <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="Name">
            <el-input v-model="form.Name" autocomplete="off" placeholder="请输入菜单名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="父级菜单名称" :label-width="formLabelWidth" prop="ParentId">
            <el-select v-model="form.ParentId" placeholder="请选择父级菜单" clearabl size="medium">
              <el-option label="无" value="0"></el-option>
              <el-option
               v-for="item in menuOptions"
                :key="String(item.MenuId)"
                :label="item.Name"
                :value="String(item.MenuId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图标" :label-width="formLabelWidth">
            <el-input v-model="form.Icon" autocomplete="off" placeholder="请填入图标 Class 名"></el-input>
          </el-form-item>
          <el-form-item label="地址" :label-width="formLabelWidth">
            <el-input v-model="form.Url" autocomplete="off" placeholder="请填入菜单地址"></el-input>
          </el-form-item>

          <el-form-item label="层级" :label-width="formLabelWidth">
            <el-select v-model="form.Level" placeholder="请选择层级" clearabl size="medium">
              <el-option label="一级菜单" value="0"></el-option>
              <el-option label="二级菜单" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth">
            <el-input type="number" v-model="form.Sort" autocomplete="off" placeholder="请输入排序"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="编辑菜单"
        :visible.sync="dialogFormEditVisible"
        center
        width="30%"
        @open="loadingEditData"
      >
        <el-form :model="editForm" :rules="Rules" ref="editRuleFormRef">
          <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="Name">
            <el-input v-model="editForm.Name" autocomplete="off" placeholder="请输入菜单名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="父级菜单名称" :label-width="formLabelWidth" prop="ParentId">
            <el-select v-model="editForm.ParentId" placeholder="请选择父级菜单" clearabl size="medium">
              <el-option label="无" value="0"></el-option>
              <el-option
                v-for="item in menuOptions"
                :key="String(item.MenuId)"
                :label="item.Name"
                :value="String(item.MenuId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图标" :label-width="formLabelWidth">
            <el-input v-model="editForm.Icon" autocomplete="off" placeholder="请填入图标 Class 名"></el-input>
          </el-form-item>
          <el-form-item label="地址" :label-width="formLabelWidth">
            <el-input v-model="editForm.Url" autocomplete="off" placeholder="请填入菜单地址"></el-input>
          </el-form-item>

          <el-form-item label="层级" :label-width="formLabelWidth">
            <el-select v-model="editForm.Level" placeholder="请选择层级" clearabl size="medium">
              <el-option label="一级菜单" value="0"></el-option>
              <el-option label="二级菜单" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth">
            <el-input type="number" v-model="editForm.Sort" autocomplete="off" placeholder="请输入排序"></el-input>
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
      queryInfo: {
        query: "",
        pageIndex: 1,
        pageSize: 20
      },
      tableData: [],
      total: 0,
      showColumn: false,
      limits: [2, 5, 10, 20],
      form: {
        MenuId: "0",
        Name: "",
        Icon: "",
        Url: "",
        Level: "0",
        Sort: "",
        ParentId: "0"
      },
      editForm: {
        MenuId: "0",
        Name: "",
        Icon: "",
        Url: "",
        Level: "0",
        Sort: "",
        ParentId: "0"
      },
      loading: false,
      dialogFormVisible: false,
      dialogFormEditVisible: false,
      formLabelWidth: "120px",
      timer: null,
      Rules: {
        Name: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur"
          }
        ],
        ParentId: [
          {
            required: true,
            message: "请选择二级菜单",
            trigger: "blur"
          }
        ]
      },

      menuOptions: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$http
        .get("/api/Menu/GetMenus", {
          params: this.queryInfo
        })
        .then(res => {
          if (!res) {
            return this.$message.error("获取菜单列表出错");
          }
          this.tableData = res.data.Object.data;
          this.total = res.data.Object.count;
        })
        .catch(err => {});
    },
    search() {
      this.loadData();
    },
    handleSizeChange(val) {
      this.queryInfo.pageSize = val;
      this.queryInfo.pageIndex = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.queryInfo.pageIndex = val;
      this.loadData();
    },
    cancelForm() {
      clearTimeout(this.timer);
    },
    handleChange() {},
    submit() {
      this.$refs.addRuleForm.validate(isvalid => {
        if (!isvalid) {
          return false;
        } else {
          this.$http
            .post("/api/Menu/AddMenu", this.form)
            .then(res => {
              if (!res) {
                return this.$message.error("添加菜单发生异常!");
              }
              var rtnData = res.data;
              if (rtnData.Code !== 1) {
                return this.$message.error(rtnData.Message);
              } else {
                this.loadData();
                this.$refs.form.resetFields();
                this.dialogFormVisible = false;
                return this.$message.success("菜单添加成功!");
              }
            })
            .catch(error => {
              var rtnData = error.data;
              this.$message.error(rtnData.Message);
            });
        }
      });
    },
    editSubmit() {
      this.$refs.editRuleFormRef.validate(isvalid => {
        if (!isvalid) {
          return false;
        } else {
          this.$http
            .post("/api/Menu/UpdateMenu", this.editForm)
            .then(res => {
              if (!res) {
                return this.$message.error("修改菜单发生异常!");
              }
              var rtnData = res.data;
              if (rtnData.Code !== 1) {
                return this.$message.error(rtnData.Message);
              } else {
                this.loadData();
                
                this.$refs.editForm.resetFields();
                this.dialogFormEditVisible = false;
                return this.$message.success("菜单修改成功!");
              }
            })
            .catch(error => {
              var rtnData = error.data;
              return this.$message.error(rtnData.Message);
            });
        }
      });
    },
    loadingData() {
      if (!this.dialogFormVisible) {
        return false;
      }
      this.getAllFirstLevelMenu();
    },
    loadingEditData() {
      if (!this.dialogFormEditVisible) {
        return false;
      }
    },
    getAllFirstLevelMenu() {
      this.$http
        .get("/api/Menu/GetAllFirstLevelMenu")
        .then(res => {
          if (!res) {
            return this.$message.error("获取一级菜单发生异常!");
          }
          var rtnData = res.data;
          if (rtnData.Code !== 1) {
            return this.$message.error(rtnData.Message);
          } else {
            this.menuOptions = rtnData.Object;
          }
        })
        .catch(error => {
          return this.$message.error(error.data.Message);
        });
    },
    edit(id) {
      if (!id) {
        return;
      }
      this.getAllFirstLevelMenu();
      this.$http
        .get("/api/Menu/GetMenuInfo", {
          params: {
            menuId: id
          }
        })
        .then(res => {
          if (!res) {
            return this.$message.error("获取一级菜单发生异常!");
          }
          var rtnData = res.data;
          if (rtnData.Code !== 1) {
            return this.$message.error(rtnData.Message);
          } else {
            rtnData.Object.Level = rtnData.Object.Level.toString();
            rtnData.Object.ParentId = rtnData.Object.ParentId.toString();
            this.editForm = rtnData.Object;
            this.dialogFormEditVisible = true;
          }
        })
        .catch(error => {
          var rtnData = error.data;
          return this.$message.error(rtnData.Message);
        });
    },
    del(id) {
      if (!id) {
        return;
      }
      this.$confirm("此操作将删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$http
            .get("/api/Menu/DelMenu", {
              params: {
                menuId: id
              }
            })
            .then(res => {
              if (!res) {
                return this.$message.error("删除菜单发生异常!");
              }
              var rtnData = res.data;
              if (rtnData.Code !== 1) {
                return this.$message.error(rtnData.Message);
              } else {
                this.loadData();
                return this.$message.success("菜单删除成功");
              }
            })
            .catch(error => {
              return this.$message.error(error.data.Message);
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped="scoped">
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
