<template>
  <div class="box">
    <div class="login-box">
      <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width:400px">
      <el-form-item label="账号" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" autocomplete="off" :show-password="true"></el-input>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即登录</el-button>
          <el-button @click="resetForm('ruleForm')">清空</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.box{
  display flex
  flex-direction column
  width 100%
}
.login-title{
  font-size 30px
  font-weight 800
  color #169BD5
  padding 30px 0 60px 0;
  text-align center
}
.login-form{
  padding 15px
}
.login-box{
  display flex
  justify-content center
}
</style>

<script>
export default {
  data () {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
    return {
      ruleForm:{
        name: '',
        password: ''
      },
      rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ]
      }
    }
  },
  methods: {
      submitForm (formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            let random = Math.random();
            let params = {
              phone:this.ruleForm.name,
              pwd: this.ruleForm.password,
              random: random
            }
            let res = await this.$api.teaback.addAccount(params)
            console.log(res)
            if(res.ret == true) {
              localStorage.setItem("s_id", res.s_id);
              localStorage.setItem("user_id", res.user_id);
              this.$message({message: '登录成功',type: 'success'});
              this.$router.push('/tasklist')
            }else {
              this.$message.error('账号或者密码错误，请重新输入');
            }
            
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
  }
}
</script>
