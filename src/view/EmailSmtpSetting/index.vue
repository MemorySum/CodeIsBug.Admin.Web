<template>
    <div>
        <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>邮件服务管理</el-breadcrumb-item>
                <el-breadcrumb-item>邮件服务设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-form :model="emailSettingModel" :rules="Rules" ref="emailSettingForm" label-width="120px" style="width: 600px" status-icon>
                <el-form-item label="SMTP服务器" prop="SendServer">
                    <el-input v-model="emailSettingModel.SendServer" autocomplete="off" placeholder="请输入SMTP服务器地址" clearable></el-input>
                </el-form-item>
                <el-form-item label="SMTP端口号" prop="SendPort">
                    <el-input v-model.number="emailSettingModel.SendPort" autocomplete="off" placeholder="请输入SMTP端口号" clearable></el-input>
                </el-form-item>
                <el-form-item label="发件人邮箱" prop="SendEmail">
                    <el-input v-model="emailSettingModel.SendEmail" autocomplete="off" placeholder="请输入发件人邮箱" clearable></el-input>
                </el-form-item>
                <el-form-item label="发件人昵称" prop="SendNickname">
                    <el-input v-model="emailSettingModel.SendNickname" autocomplete="off" placeholder="请输入发件人昵称" clearable></el-input>
                </el-form-item>
                <el-form-item label="邮箱登入密码" prop="SendPassword">
                    <el-input type="password" v-model="emailSettingModel.SendPassword" autocomplete="off" show-password placeholder="请输入邮箱登入密码" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('emailSettingForm')">保存配置</el-button>
                    <el-button @click="resetForm('emailSettingForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        var checkServer = (rule, value, callback) => {
            const ServerReg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*/
            if (value === '') {
                callback(new Error('请输入SMTP服务器地址'))
            }
            if (ServerReg.test(value) || value === '') {
                callback()
            } else {
                callback(new Error('请输入准确的SMTP服务器地址'))
            }

        }
        var checkEmail = (rule, value, callback) => {
            const mailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            if (value === '') {
                callback(new Error('请输入发件人邮箱'))
            }
            if (mailReg.test(value) || value === '') {
                callback()
            } else {
                callback(new Error('请输入正确的发件人邮箱'))
            }
        }
        var checkPort = (rule, value, callback) => {
            const PortlReg = /^\d{1,3}$/

            if (!Number.isInteger(+value)) {
                callback(new Error('请输入数字'))
            } else {
                if (!PortlReg.test(value)) {
                    callback(new Error('请输入1-3位数字'))
                } else {
                    callback()
                }

            }
        }
        return {
            formLabelWidth: "120px",
            emailSettingModel: {
                SendServer: "",
                SendPort: null,
                SendEmail: "",
                SendNickname: "",
                SendPassword: "",
            },
            Rules: {
                SendServer: [{

                    validator: checkServer,
                    trigger: 'blur'
                }],
                SendPort: [{

                    validator: checkPort,
                    trigger: 'blur',
                }],
                SendEmail: [{

                    validator: checkEmail,
                    trigger: 'blur'
                }],
                SendNickname: [{
                    required: true,
                    message: '请输入发件人昵称',
                    trigger: 'blur'
                }],
                SendPassword: [{
                    required: true,
                    message: '请输入邮箱登入密码',
                    trigger: 'blur'
                }],
            },
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((isvalid) => {
                if (!isvalid) {
                    return false
                }

            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        loadDefaultData(){
           this.$http
                .get('/api/EmailSmtp/GetConfig')
                .then(res => {
                    if (!res) {
                        return this.$message.error('获取邮件SMTP配置出错')
                    }
                    this.emailSettingModel = res.data.Object
                })
                .catch(err => {})
        }
    },
    created(){
        this.loadDefaultData()
    }
};
</script>

<style lang="less" scoped>
</style>
