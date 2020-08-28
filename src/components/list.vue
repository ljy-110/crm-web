<template>
  <div>
    <div>
      <!-- <h1>自动场外交易</h1> -->
      <div style="width:80%;margin: 0px auto;">
        <el-form :model="ruleForm" label-position='left' status-icon ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" show-password v-model="ruleForm.pass" placeholder="请输入密码" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="安全密码" prop="chexkpass">
            <el-input type="password" show-password v-model="ruleForm.chexkpass" placeholder="请输入六位数字" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin:20px 0 20px 0;">
            <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%">
              <el-table-column label="编号" width="50">
                <template slot-scope="scope">
                  <span>{{scope.row.index}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="username" label="账号">
              </el-table-column>
              <el-table-column prop="password" label="密码"></el-table-column>
              <el-table-column prop="paycode" label="安全码" width="70"></el-table-column>
              <!-- <el-table-column prop="time" label="时间">
              </el-table-column>
              <el-table-column prop="token" label="token"></el-table-column> -->
            </el-table>
          </div>
    </div>
  </div>
</template>

<script>
import {formatDate} from '@/common/date.js'
export default {
  filters: {
    formatDate(time) {
      time = time * 1000
      let date = new Date(time)
      // console.log(new Date(time))
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  props: {},
  components: {},
  data () {
    return {
      tableData:[],
      ruleForm:{
        name:'',
        pass:'',
        chexkpass:'',
      },
    };
  },

  created() {
    this.getlist()
    // this.$router.push(`/list?accountId=`)
    // let url = ''
    // url = window.location.href.split("=")[1]
    // this.$router.push({path:'/list',query: { accountId: url }})
  },

  methods: {
    submitForm(formName) {
      let time = new Date()
      let dates = time.toLocaleString(); //获取当前日期
      let url = window.location.href.split("=")[1]
      let params = {
        username:this.ruleForm.name,
        password: this.ruleForm.pass,
        paycode: this.ruleForm.chexkpass,
        accountId:url,
        time: dates,
      }
      var that = this
      that.$axios({
          method: 'post',
          url: `${this.$baseUrl}/coinBalance/public/eth/trade`,
          // url: 'http://192.168.101.141/coinBalance/public/eth/trade',
          headers:{'Content-Type': 'application/json'},
          data: params
      }).then((response) => {
          console.log(response.config)
          console.log(response.data)
          if(response.data.status == 200) {
            this.getlist()
            this.$refs[formName].resetFields();
            this.$message.success(response.data.msg)
          }else{
            this.$message.error(response.data.msg)
          }
      })
      .catch((e) => {
      })
        
    },
    getlist(){
      var url = window.location.href.split("=")[1]
      console.log(url);
      var that = this
      that.$axios({
          method: 'get',
          // url: window.g.BASE_URL+'/coinBalance/select/eth/trade',
          url: `${this.$baseUrl}/coinBalance/select/eth/trade?accountId=${url}`,
          // url: `http://192.168.101.141/coinBalance/select/eth/trade?accountId=${url}`,
          headers:{'Content-Type': 'application/json'},
          // data: params
      }).then((response) => {
          console.log(response.config)
          console.log(response.data)
          if(response.data.status == 200) {
            // response.data.data.map(item => arr.push(item.data));
            let i = 1
            response.data.data.forEach((item) => {
              item.index = i++
            });
            this.tableData = response.data.data
          }else{
            return
          }
      })
      .catch((e) => {
      })
    }
  },

  computed: {},

  mounted(){},

  watch: {}
}

</script>
<style lang='stylus' scoped>
</style>