<template>
<div>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>全国省市信息</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" clearable style="width:25%">
        </el-input>

        <el-table :data="data.filter(data => !filterText || data.CityName.toLowerCase().includes(filterText.toLowerCase()))"
        v-loading="loading" style="width: 100%;overflow: hidden;" border row-key="CodeId"
        ref="tree" :default-expand-all="false" :tree-props="{children: 'Children', hasChildren: 'hasChildren'}"
         max-height="700">
            <el-table-column prop="CityName" sortable label="地区名称" >
                <template slot-scope="scope">
                    <span style="margin-left: 5px;">{{ scope.row.CityName}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
export default {

    data() {
        return {
            filterText: '',
            loading: true,
            data: [],
            defaultProps: {
                children: 'Children',
                label: 'CityName'
            }
        };
    },
    created() {
        this.loadTreeData()
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.CityName.indexOf(value) !== -1;
        },
        loadTreeData() {

            this.$http.get('/api/CityInfo/GetAllCity')
                .then((res) => {
                    if (!res) {
                        return this.$message.error('获取全国省市信息出错')
                    }
                    this.loading = false
                    this.data = res.data.Object
                })
                .catch((err) => {})
        }
    }

};
</script>

<style lang="less" scoped>

</style>
