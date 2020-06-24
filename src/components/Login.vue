<template>
  <div class="login_container">
    <div class="login_box">
      <el-form :model="login_form" class="login_form" :rules="rules" ref="login_form_Ref">
        <div class="tx_box">
          <img src="../assets/logo.png" alt="" />
        </div>
        <el-form-item prop="username">
          <el-input auto-complete="off" v-model="login_form.username" placeholder="请输入账号" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input show-password placeholder="请输入密码" v-model="login_form.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
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
          username: '',
          password: ''
        },
        rules: {
          username: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'
            }
          ]
        }
      }
    },
    methods:{
      resetLoginInfo(){
        this.$refs.login_form_Ref.resetFields()
      },
      login(){
        this.$refs.login_form_Ref.validate((isvalid)=>{
          
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
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
