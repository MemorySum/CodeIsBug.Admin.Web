<template>
<div class="login_container">
    <div class="login_box">
        <el-form :model="login_form" class="login_form" :rules="rules" ref="login_form_Ref">
            <el-row>
                <el-form-item prop="username">
                    <el-input auto-complete="off" v-model="login_form.username" placeholder="请输入账号" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item prop="password">
                    <el-input show-password placeholder="请输入密码" v-model="login_form.password" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="15">
                    <el-form-item prop="yzcode">
                        <el-input placeholder="请输入验证码" v-model="login_form.yzcode" prefix-icon="el-icon-lock"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item>
                        <img alt="点击切换验证码" @click="loadVerifyCode()" :src="this.codeimg" style="width: 120px; height: 40px" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item class="login_btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetLoginInfo">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            login_form: {
                username: "",
                password: "",
            },
            checkCodeInfo: {
                CheckGuid: "00000000-0000-0000-0000-000000000000",
                CheckCode: "",
            },
            codeimg: null,
            rules: {
                username: [{
                    required: true,
                    message: "请输入账号",
                    trigger: "blur",
                }, ],
                password: [{
                    required: true,
                    message: "请输入密码",
                    trigger: "blur",
                }, ],
                yzcode: [{
                    required: true,
                    message: "请输入验证码",
                    trigger: "blur",
                }, ],
            },
        };
    },
    created() {
        this.buildGuid();
        this.loadVerifyCode();
    },
    methods: {
        loadVerifyCode() {
            this.$http
                .get("/api/VerifyCode/GetCode", {
                    params: {
                        guid: this.checkCodeInfo.CheckGuid,
                    },
                    responseType: "blob",
                })
                .then((res) => {
                    if (!res) {
                        return this.$message.error("获取验证码失败");
                    }
                    this.codeimg = window.URL.createObjectURL(res.data);
                })
                .catch((err) => {});
        },
        S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        },
        buildGuid() {
            var guid =
                this.S4() +
                this.S4() +
                "-" +
                this.S4() +
                "-" +
                this.S4() +
                "-" +
                this.S4() +
                "-" +
                this.S4() +
                this.S4() +
                this.S4();
            this.checkCodeInfo.CheckGuid = guid;
            return guid;
        },
        resetLoginInfo() {
            this.$refs.login_form_Ref.resetFields();
        },

        login() {
            // 表单预验证
            this.$refs.login_form_Ref.validate((isvalid) => {
                if (!isvalid) {
                    return false;
                } else {
                    this.checkCodeInfo.CheckCode = this.login_form.yzcode;
                    this.$http
                        .post("api/VerifyCode/VerifyCode", this.checkCodeInfo)
                        .then((res) => {
                            if (!res) {
                                return false;
                            }
                            let rtn = res.data;
                            if (rtn.Code !== 1) {
                                this.$message.error(rtn.Message);
                                return false;
                            } else {
                                this.$http
                                    .post("api/Account/Login", this.login_form)
                                    .then((res) => {
                                        // 获取返回的result
                                        var rtnData = res.data;
                                        if (!rtnData) {
                                            return false;
                                        }
                                        if (rtnData.Code !== 1) {
                                            return this.$message.error(rtnData.Message);
                                        } else {
                                            this.$notify.success({
                                                title: '欢迎登陆，'+rtnData.Object.UserName,
                                                message: '当前拥有角色:'+rtnData.Object.UserRoleName
                                            });
                                            sessionStorage.setItem(
                                                "userInfo",
                                                JSON.stringify(rtnData.Object)
                                            );
                                            sessionStorage.setItem(
                                                "user_access_Token",
                                                rtnData.ExtendObject.Access_Token
                                            );
                                            this.$router.push("/home");
                                        }
                                    })
                                    .catch((err) => console.log(err));
                            }
                        })
                        .catch((err) => {});
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    width: 350px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 3px;

    .tx_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        top: -50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.login_form {
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.login_btns {
    display: flex;
    justify-content: center;
}
</style>
