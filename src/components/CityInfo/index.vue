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

            <el-tree class="filter-tree" :data="data" v-loading="loading" :props="defaultProps" accordion :filter-node-method="filterNode" ref="tree" style="width:25%;overflow: hidden;">
            </el-tree>
        </div>
    </div>
</template>

<script>
export default {
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },

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

            this.$http.get('/api/CityInfo/GetCityInfo')
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
