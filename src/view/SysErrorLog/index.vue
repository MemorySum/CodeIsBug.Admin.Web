<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统日志</el-breadcrumb-item>
        <el-breadcrumb-item>异常日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%; height: 100%"
        border
        row-key="Id"
        default-expand-all
      >
        <el-table-column
          prop="LogTime"
          sortable
          label="记录时间"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="DisplayName"
          label="错误位置"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="LineNumber"
          sortable
          label="错误行号"
          min-width="60"
        >
        </el-table-column>
        <el-table-column
          prop="Message"
          sortable
          label="错误信息"
          min-width="60"
        ></el-table-column>
        <el-table-column
          prop="CreateTime"
          sortable
          label="创建时间"
          min-width="120"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData:[],
       loading: false
    }
  },
   created() {
     this.loadData()
     this.$message.success('dd')
    },
    methods:{
      loadData(){
        this.$http
                .get('/api/SysErrorLog/list')
                .then(res => {
                    if (!res) {
                        return this.$message.error('获取日志列表出错')
                    }
                    this.tableData = res.data.Object
                    this.total = res.data.Object.count
                })
                .catch(err => {
                  console.log(err)
                })
      }
    }
}
</script>
<style lang="less" scoped>
</style>
