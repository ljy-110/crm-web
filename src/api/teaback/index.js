/*
 * @Descripttion:
 * @version:
 * @Author: hengzi
 * @Date: 2019-12-12 14:58:07
 * @LastEditors  : hengzi
 * @LastEditTime : 2020-01-14 10:44:55
 */
import api from '../index'
import urls from './url'
let config = {
    headers: {
        'Content-Type':'multipart/form-data'
    }
       
  };

let uinfoLocks = {}; 
let user_keepalive_funcs = [];
let user_keepalive =0;
let websock = null;
let newMsgObjFunc = {};

function notice_user_ws_status(status)
{
    user_keepalive = status;
    for(let i=0;i<user_keepalive_funcs.length;i++)
    {
        // console.log('user_keepalive_funcs:'+user_keepalive_funcs[i])
        user_keepalive_funcs[i](user_keepalive)
    }
}

const restart_time = 1000;
async function initWebSocket(){
    // console.log('into initWebSocket function')
    if(websock)
	{
        notice_user_ws_status(user_keepalive)
        return ;
    }
    if(typeof(WebSocket) === "undefined"){
        console.error("您的浏览器不支持WebSocket")
        return false
    }

    try{
        let params = {user_id:localStorage.user_id,s_id:localStorage.s_id};
        let tokenRet = await api.post(urls.ws_user_listen,params,{'Content-Type': 'application/x-www-form-urlencoded'});//token
		// console.log(tokenRet)
        if(tokenRet && tokenRet.ret && tokenRet.listen_token)
        {
            let wsuri = urls.ws_host_path_0+'/userchatlist/ws/svr?token='+tokenRet.listen_token;
            websock = new WebSocket(wsuri)
            websock.onopen = websocketonopen
            websock.onmessage = websocketonmessage
            websock.onerror = websocketonerror
            websock.onclose = websocketclose
        }else{
            // console.log('initWebSocket-get-ws-token failed:'+JSON.stringify(tokenRet))
            websock  = null;
            setTimeout(initWebSocket,restart_time);
        }   
    }catch(ex){
        // console.log('start websocket-exception:'+ex)
        setTimeout(initWebSocket,restart_time);
    }
}
let keepalive_id = null;
function callKeepAlive()
{
    killKeepAlive();
    keepalive_id = setInterval(function(){
        if(websock) websock.send('keepalive')
    },9000)

    if(websock) websock.send('keepalive')
}
function killKeepAlive()
{
    if(keepalive_id) clearInterval(keepalive_id)
    keepalive_id = null;
}
//连接成功
function websocketonopen(){ 
    console.log('WebSocket连接成功')
    user_keepalive = 1;
    notice_user_ws_status(user_keepalive)
    callKeepAlive();

}
//接收后端返回的数据
function websocketonmessage(e){ 
    let data = e.data;
    // console.log('websocketonmessage:'+data)

    user_keepalive = 1;
    notice_user_ws_status(user_keepalive)

    let dataJson = null;
    try{
        dataJson = JSON.parse(data)
    }catch(ex){
        // console.log('dataJson parse failed:'+ex)
    }

    // console.log('dataJSON:'+JSON.stringify(dataJson))
    if(newMsgObjFunc) newMsgObjFunc(dataJson)

    // 在这里使用后端返回的数据，对数据进行处理渲染
}
//连接建立失败重连
function websocketonerror(e){
    console.log(`连接失败的信息：`, e)
    //this.initWebSocket() // 连接失败后尝试重新连接
    user_keepalive = 0;
    notice_user_ws_status(user_keepalive)
    websock  = null;
    setTimeout(initWebSocket,restart_time);
    killKeepAlive();
}
//关闭连接
function websocketclose(e){ 
    console.log('断开连接',e)
    websock  = null;
    user_keepalive = 0;
    notice_user_ws_status(user_keepalive)
    setTimeout(initWebSocket,restart_time);
    killKeepAlive();
}


let total_unread_num_func = null;
export default {
    setTotalUnreadNum(func)
    {
        total_unread_num_func = func;
    },
    updateTotalUnreadNum(){
        if(total_unread_num_func) total_unread_num_func();
    },
    addUserKeepAliveStatusFunc(func)
    {
        if(func) user_keepalive_funcs.push(func)
    },
    async startWebSocket(){
        initWebSocket();
    },
      setNewMsgObjFunc(func)
      {
        newMsgObjFunc = func;
      },
    //uinfoLocks为加锁操作
    async s_queryUserInfo(dst_user_id,callback)
    {
        // console.log('s_queryUserInfo:'+dst_user_id)

        // console.log('user_keepalive_funcs:'+user_keepalive_funcs)
    
        let userInfoStr = localStorage.getItem('userinfo_cache_'+dst_user_id);
        // console.log('userinfo_cache_'+dst_user_id+':'+userInfoStr)
        let userInfo = null;
        if(userInfoStr) {
            try{
                userInfo = JSON.parse(userInfoStr)   
                callback(userInfo)
                return userInfo;
            }catch(ex)
            {
                // console.log(JSON.stringify(ex))
            }
        }

        //使用网络请求拿到值
        console.log('uinfoLocks-'+dst_user_id+':'+uinfoLocks[dst_user_id])
        if(!uinfoLocks[dst_user_id])
        {
            uinfoLocks[dst_user_id] = true;
            let user_id = localStorage.user_id
            let param = {user_id,s_id:localStorage.s_id,random:Math.random(),dst_user_id}
            api.post(urls.UserInfoto,param,{'Content-Type': 'application/x-www-form-urlencoded'}).then(res=>
            {
                if(res && res.ret)
                {
                    userInfo = res;
                    localStorage.setItem('userinfo_cache_'+dst_user_id,JSON.stringify(res));
                }else{
                    userInfo = null;
                }

                uinfoLocks[dst_user_id] = false;

                //回调得到结果
                if(callback) callback(res)
            })
        }

        return null;
    },
    getChatRoomWebSocketListenToken(param) {
        return api.post(urls.ws_chatroom_listen,param,{'Content-Type': 'application/x-www-form-urlencoded'});//获取chatroom-ws-listen-token
    },
    createWSChatListenUrl(token)
    {
        return urls.ws_host_path_0+'/groupchat/ws/svr?token='+token;
    },
    OTCorder(params) {
        return api.get(urls.OTCorder,params,"");//
    },
    getTest(params){
        return api.get(urls.sendTest,params,"");
    },
    sendSms(params){
        return api.post(urls.sendSms,params,{'Content-Type': 'application/x-www-form-urlencoded'});//获取验证码
    },
    changePassword(params){
        return api.post(urls.changePassword,params,{'Content-Type': 'application/x-www-form-urlencoded'});
    },
    addAccount(params){
        return api.get(urls.addAccount,params,"");//登录
    },
    getTaskList(params){
        return api.get(urls.getTaskList,params,"");//任务列表
    },
    getTaskInfoList(params){
        return api.get(urls.getTaskInfoList,params,"");//用户任务列表
    },
    refuseTask(params){
        return api.get(urls.refuseTask,params,"");//拒绝
    },
    passTask(params){
        return api.get(urls.passTask,params,"");//通过
    },
    printExcel(params){
        return api.get(urls.printExcel,params,"");//导出
    },
    fastRead(params){
        return api.get(urls.fastRead,params,"");//导出
    },
}


