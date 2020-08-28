/*
 * @Descripttion:
 * @version:
 * @Author: hengzi
 * @Date: 2019-12-12 14:58:13
 * @LastEditors  : hengzi
 * @LastEditTime : 2020-01-14 10:44:04
 */
import config from '../../../vue.config';
const defaultServerIP = '119.29.19.74';
// const defaultServerIP = '192.168.150.154';
// const url = process.env.NODE_ENV === "production" ? "http://18.221.26.116":'/';
// const url = process.env.NODE_ENV === "production" ? "http://192.168.150.154:9000" : "api";
// const baseUrl = config.publicPath + url;
// const baseUrl = config.publicPath

const  baseUrl = 'http://18.221.26.116'
export default {
    baseUrl: baseUrl,
    //用户消息列表websocket
    ws_host_path_0:'ws://'+defaultServerIP+':63333',
    ws_user_listen:baseUrl+'/chat/ws/user/listen',
    //聊到室监听websocket
    ws_chatroom_listen:baseUrl+'/chat/ws/listen',
    // 图片列表
    photos: baseUrl + '/image/view?img_kind=open&filename=',//图片的地址
    getTaskList: baseUrl + '/admin/getTaskList',//任务列表
    getTaskInfo: baseUrl + '/admin/getTaskInfo',//获取任务信息
    getTaskInfoList: baseUrl + '/admin/getTaskInfoList',//获取用户任务信息列表
    addAccount: baseUrl + '/user/login_user_pwd',//登录
    passTask: baseUrl + '/admin/passTask',//通过
    refuseTask: baseUrl + '/admin/refuseTask',//拒绝
    printExcel: baseUrl + '/admin/printExcel',//导出
    fastRead: baseUrl + '/admin/fastRead',//导出
}
