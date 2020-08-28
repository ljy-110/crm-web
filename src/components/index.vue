<template>
    <div class="box">
        <template>
            <el-tabs v-model="activeName" @tab-click="handleLoad">
                <el-tab-pane label="任务一" name='1'>
                    <list></list>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>
<script>
import list from '../components/infolist.vue'
export default {
  data () {
    return {
        activeName: '1',
    }
  },
  methods: {
    // handleClick (tab, event) {
    //     console.log(tab, event)
    // },
    handleLoad (data) {
        this.timer1 = new Date().getTime()
    }
  },
  components: {
       list:list
  }
}
</script>
<style lang="stylus" scoped>
.box{
    padding 10px
}
/deep/ .el-tabs__item{
    width 100px;
    text-align center
}
</style>
