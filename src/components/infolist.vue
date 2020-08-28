<template>
  <div>
    <div class="flex-cont top">
            <el-row style="padding-right:40px;">
                <el-button type="primary" @click="revFinish" size="mini" style="width:100px;">导出列表</el-button>
            </el-row>
            <el-row style="padding-right:40px;">
                <el-button type="primary" @click="fastRead" size="mini" style="width:100px;">快速审核</el-button>
            </el-row>
            <el-row style="padding-right:40px;">
                <el-button type="primary" @click="getList" size="mini" style="width:100px;">返回任务列表</el-button>
            </el-row>
            <el-row style="padding-right:40px;">
                <el-button type="primary" @click="getData" size="mini" style="width:100px;">刷新数据</el-button>
            </el-row>
        </div>
    <div class="table-aa">
            <el-table ref="multipleTable" :data="list" tooltip-effect="dark" border style="width: 100%" @selection-change="handleSelectionChange" @row-click="openDetails">
          <!-- <el-table-column type="selection" width="40"></el-table-column> -->
          <el-table-column prop="time" label="时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="token_y" label="区块ID" show-overflow-tooltip></el-table-column>
          <el-table-column prop="recommender" label="用户上级号码" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.recommender == 'undefined'"></span>
              <span v-else>{{scope.row.recommender}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="user_phone" label="用户号码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="adviser" label="六度销售经理" show-overflow-tooltip></el-table-column>
          <el-table-column prop="adviser_phone" label="销售经理号码" show-overflow-tooltip></el-table-column>
    <el-table-column prop="company_name" label="企业名称" show-overflow-tooltip></el-table-column>
    
    <el-table-column prop="boss_name" label="企业老板" show-overflow-tooltip></el-table-column>
    <el-table-column prop="phone" label="企业号码" show-overflow-tooltip></el-table-column>
    <el-table-column prop="content" label="企业信息" show-overflow-tooltip></el-table-column>
    
    <el-table-column prop="status" label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
            <span v-if="scope.row.status == 1">待审核</span>
            <span v-else-if="scope.row.status == 2">已通过</span>
            <span v-else>已拒绝</span>
              </template>
          </el-table-column>
    <el-table-column label="操作" show-overflow-tooltip width="200">
      <template slot-scope="scope">
        <el-button v-if="scope.row.status == 2" disabled type="success" size="small">已通过</el-button>
        <el-button @click="passTask(scope.row.token_y)" v-else type="success" size="small">通过</el-button>
        
        <el-button v-if="scope.row.status == 2" type="danger" disabled size="small">拒绝</el-button>
        <el-button v-else-if="scope.row.status == 3" type="danger" disabled size="small">已拒绝</el-button>
        <el-button v-else @click="refuseTask(scope.row.token_y)" type="danger" size="small">拒绝</el-button>
      </template>
    </el-table-column>
  </el-table>
        </div>
        <div class="footer">
            <div class="block">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage1"
                :page-sizes="[10,15,20,50]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
        </div>
        <div class="pagebox">
                <el-dialog title="审核企业信息" :visible.sync="addDialog" width="30%"
                :before-close="handleClose" class="userNew">
                    <span class="tips" v-show="flag1">信息不能为空!</span>
                    <form class="pageform">
                        <label>企业名称</label>
                        <el-input v-model="userinfo.company_name" disabled></el-input>
                        <label>企业老板</label>
                        <el-input maxlength="8" v-model="userinfo.boss_name" disabled></el-input>
                        <label>企业电话</label>
                        <el-input v-model="userinfo.phone" disabled></el-input>
                        <label>企业信息</label>
                        <el-input v-model="userinfo.content" disabled></el-input>
                        <label>六度销售经理</label>
                        <el-input v-model="userinfo.adviser" disabled></el-input>
                        <label>销售经理号码</label>
                        <el-input v-model="userinfo.adviser_phone" disabled></el-input>
                    </form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="passTask(userinfo.token_y)" :loading='load' class="btn1">通过</el-button>
                        <el-button type="primary" @click="refuseTask(userinfo.token_y)" :loading='load' class="btn1">拒绝</el-button>
                    </span>
                </el-dialog>
            </div>
  </div>
</template>

<script>
import fileDownload from 'js-file-download'
export default {
  data(){
    return {
      data:[],
      list:[],
      currentPage1: 1,
      limit:10,//每页数据条数
      total: null,
      page: 1,//当前页
      taskid:'',
      addDialog:false,
      flag1:false,
      load:false,
      userinfo:{},
      timer: null,
    }
  },
  created(){
    this.getTaskList()
  },
  methods: {
     handleClick(row) {
        console.log(row);
      },
        handleSizeChange(val) {// 当每页数量改变
            this.limit = val
            this.getinfoList()
        },
        openDetails(row, event, column){
            this.accountid = row.account_id
            // console.log(this.accountid)
        },
        handleCurrentChange(val) {// 当当前页改变
            this.page = val
            console.log(this.page);
            this.getinfoList()
        },
        handleSelectionChange(val) {
            this.accountInfo = val;
            // console.log(this.accountInfo)
        },
        getinfoList(){
          let fyData = this.data
          this.list = fyData.filter((item, index) =>
              index < this.page * this.limit && index >= this.limit * (this.page - 1)
          )
          this.page = 1
        },
        async getTaskList(){//用户信息列表
              let taskid = this.$route.params.taskid
              let params = {
                task_id:taskid,
                begin: 0,
                len: 1000
              }
              let ress = await this.$api.teaback.getTaskInfoList(params)
              console.log(ress)
              if(ress.ret){
                this.data = ress.taskStatusList
                this.total = ress.taskStatusList.length
                this.getinfoList()
              }else{}
        },
        // async revFinish(){
        //   // window.location.href=`${this.$baseUrl}/admin/printExcel`
        //   let that = this;
        //     that.$axios({
        //         method: 'get',
        //         url: `${this.$baseUrl}/admin/printExcel`, 
        //         // url: 'http://192.168.101.153:9000/admin/uploadTxt',
        //         // headers:{'Content-Type': 'application/json'},
        //         responseType: 'arraybuffer',
        //     }).then((res) => {
        //       console.log(res)
        //         let ress = res.data.buffer.data
        //         console.log(ress)
        //         // let ress = JSON.parse(res.data.buffer.data)
        //         // console.log(ress)
        //         console.log(res.data)
        //         // fileDownload(ress,'res.xls')
        //         var blob = new Blob([ress], {type: 'application/vnd.ms-excel;'}); //type这里表示xlsx类型
        //     　　var downloadElement = document.createElement('a');
        //     　　var href = window.URL.createObjectURL(blob); //创建下载的链接
        //     　　downloadElement.href = href;
        //     　　downloadElement.download = 'result.xlsx'; //下载后文件名
        //     　　document.body.appendChild(downloadElement);
        //     　　downloadElement.click(); //点击下载
        //     　　document.body.removeChild(downloadElement); //下载完成移除元素
        //     　　window.URL.revokeObjectURL(href); //释放掉blob对象 
        //         this.$message({message: '下载数据成功',type: 'success'});
        //     })
        //     .catch((e) => {
        //         this.$message({
        //             message:'下载失败！',
        //             type:'error',
        //             showClose:true
        //         })
                
        //     })
        //   // let res = await this.$api.teaback.printExcel()
        //   // 此处res为bolb类文件对象 Blob(4412) {size: 4412, type: "application/octet-stream"}   
   
           
           
                
        // },
        revFinish(){
          let datas = this.data
          let that = this;
        //  if (!datas|| datas.length<=0) {
        //    that.$message('请先选择要导出的数据！')
        //    return
        //  }
        let times = new Date()
        let name = times.toLocaleString( )
        console.log(name)
         import('@/vendor/Export2Excel').then(excel => {
           const tHeader = ['时间','区块ID','用户号码', '六度销售经理','销售经理号码',  '企业名称', '企业老板'
             , '企业号码','企业信息','状态'];
           const filterVal = ['time','token_y','user_phone', 'adviser', 'adviser_phone', 'company_name', 'boss_name','phone'
             , 'content', 'status'];
           const fileName = '6DGS客户管理系统信息'+ name;
           const data = this.formatJson(filterVal, datas)
           excel.export_json_to_excel({
             header: tHeader,
             data,
             filename: fileName
           })
         })
       },
       formatJson(filterVal, jsonData) {
         return jsonData.map(v => filterVal.map(j => {
           if (j === 'customsClearDate'|| j === 'listDate') {
             return parseTime(v[j])
           }else if(j === 'status'){
            //  debugger
             if (v[j]==1) {
               v[j]="待审核";
             }else if(v[j]==2){
               v[j]="已通过";
             }else {
               v[j]="已拒绝";
             }
             return v[j]
           } else {
             return v[j]
           }
         }))
       
        },
        getData(){
          this.currentPage1 = 1
            this.page1 = 1
            this.getTaskList();
            this.$message({message: '获取数据成功',type: 'success'});
        },
        getList(){
          this.$router.go(-1)
        },
        async refuseTask(token_y){
          let params = {
                info_id:token_y
            }
            let res = await this.$api.teaback.refuseTask(params)
            console.log(res)
            if(res.ret){
              this.getTaskList()
              this.addDialog = false
              this.$message({message: '拒绝成功',type: 'success'});
            }else{
              this.$message({message: '拒绝失败',type: 'error'});
            }
        },
        async passTask(token_y){
          let params = {
                info_id:token_y
            }
            let res = await this.$api.teaback.passTask(params)
            console.log(res)
            if(res.ret){
              this.getTaskList()
              this.addDialog = false
              this.$message({message: '通过成功',type: 'success'});
            }else{
              this.$message({message: '通过失败',type: 'error'});
            }
        },
        async fastRead(){
          let params = {
            user_id:localStorage.user_id,
            task_id:this.$route.params.taskid
          }
          let res = await this.$api.teaback.fastRead(params)
          console.log(res)
          if(res.ret){
            this.addDialog = true
            this.getTaskList()
            this.userinfo = res.info
          }else  if(res.msg == 'no find'){
            this.$message({message: '没有可以审核的企业',type: 'error'});
            this.addDialog = false
          }
        },
        handleClose(done) {
            done();
            this.flag=false;
            this.flag1=false;
            this.userinfo={}
        },
        clearTime(){
          clearInterval(this.time);
        },
        setTimer() {
    　　　　this.time = setInterval( () => {
              this.getTaskList()
    　　　　}, 3000);
    　　},
  },
  mounted() {
    // 每隔3秒钟获取接口数据，定时刷新页面来达到效果
    this.getTaskList()
    this.timer = setInterval(() => {
      setTimeout(this.getTaskList, 0);
    }, 120000);
  },
   beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
}
</script>

<style lang="stylus" scoped>
.top{
    height 60px
}
/deep/ .el-dialog__body{
    display flex
    width 100%
    justify-content flex-start
    padding 0
}
.flex-cont{
    display flex
    width 100%
    align-items center
    justify-content flex-start
}
.table-aa{
    margin 0px 0 20px 0;
}
.footer{
    display flex
    width 100%
    justify-content space-between
}
.user-box{
    display flex
    width 100%
    justify-content space-between
    text-align center
}
table{
    border: 1px solid #E4E7ED;
    border-collapse: collapse; 
}
.user-box th,.user-box td{
    border: 1px solid #E4E7ED;
    padding: 5px;
}
.tips {
    position: absolute;
    left: 20px;
    top: 50px;
    color: red;
}
.pageform{
    display flex
    height 450px
    width 100%
    flex-direction column
    padding 0px 20px 0px 20px;
}
.pageform label {
    margin 10px 0
}
.pageform input{
    margin 10px 0 10px 0
    height 30px
    border:1px solid #E4E7ED;
	outline:none;
}
.pageform input:focus{
    border:1px solid #3879d9;
}
.seeCode:hover{
    text-decoration:underline
}
.pageform input::-webkit-input-placeholder{
    color:#ccc;
}
.messageBox{
    width 50%
    margin 0 auto
}
.block{
  display flex
  width 100%
  justify-content center
}
/deep/ .el-dialog__header{
    text-align center
    font-weight 800
}
.userNew >>> .el-dialog__footer{
    margin-top 50px
}
/deep/ .el-button--success{
  width 70px
}
/deep/ .el-button--danger{
  width 70px
}
</style>