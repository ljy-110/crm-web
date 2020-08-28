<template>
  <div>
    <h2>任务列表</h2>
    <div class="flex-center">
      <div class="ul">
        <div class="li" @click="getList(item.task_id)" v-for="(item,index) in taskList" :key="index">
          <div class='div-img'>
            <img class="img" src="../img/1.jpg" alt="任务">
          </div>
          <div class="text">{{item.task_content}}</div>
          <div class="title">{{item.task_name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      taskList:[]
    }
  },
  created(){
    this.getTaskList()
  },
  methods:{
    async getTaskList(){//用户信息列表
      let params = {
          user_id:localStorage.user_id,
          s_id:localStorage.s_id
      }
      let res = await this.$api.teaback.getTaskList(params)
      console.log(res)
      if(res.ret){
        this.taskList = res.taskList
      }else{

      }
    },
    getList(taskid){
      this.$router.push(`/infolist/${taskid}`)
    }
  }
}
</script>

<style lang="stylus" scoped>
.flex-center{
  display flex
  width 80%
  justify-content center
  padding-left 10%
}
.ul{
  display flex
  width 100%
  justify-content flex-start
}
.li{
  width 20%
  list-style-type none
  margin-right 15px;
  cursor pointer
  position relative
  border 1px solid #fff
  padding 5px
  border-radius 10px
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.li:hover{
  border 1px solid #ccc
}
.div-img{
  width 100%
  height 150px;
}
.img{
  width 100%
  height 100%
}
.text{
  font-size 16px
  text-align left
}
.title{
  position absolute
  top 20px
  left 20px
  font-size 20px
  font-weight 700
}
</style>