<template>
    <f-menu active-name="1" :on-menu-item-click="handleMenuItemClick">
      <template #before>
      </template>
        <f-menu-item name="1" :icon="FIconApps">首页</f-menu-item>
        <f-menu-item name="2" :icon="FIconApps">部署</f-menu-item>
        <f-menu-item name="3" :icon="FIconApps">连接</f-menu-item>
      <template #after>
        <div v-if="login==false">
            <f-avatar round size="mini" src="https://avatars.githubusercontent.com/u/73180970?v=4" />
            <f-text>1234</f-text>
        </div>
        <f-dropdown>
          <f-button>用户设置</f-button>
          <template #content>
            <div v-if="login==false">
              <f-dropdown-item>使用fanbook登录</f-dropdown-item>
            </div>
            <div v-if="login==true">
              <f-dropdown-item>退出登录</f-dropdown-item>
            </div>
          </template>
        </f-dropdown>
      </template>
    </f-menu>
    <div v-if="page == '1'">
    <f-alert :alert-list="alertList" title="操作流程：" type="primary" :duration="duration" />
    <!-- <f-box width="auto" height="200px" padding="100px"> -->
      <f-card title="提示">{{ tishi }}</f-card>
    <!-- </f-box> -->
    <!-- {{ ruleForm3 }} -->
    <f-box width=5% height="1px" padding="10px"></f-box>
    <f-alert type="primary">发送反馈</f-alert>
    <f-form :model="ruleForm3" label-width="60px" :on-submit="handelSubmit3">
      <f-form-item
        label="fanbook 短id"
        name="admin.info.username"
        :rules="[
          { required: true, message: '请输入你的fanbook 短id' },
        ]"
      >
        <f-input
          v-model="ruleForm3.admin.info.username"
          type="text"
          placeholder="请输入fanbook短id"
        />
      </f-form-item>

      <f-form-item
        label="反馈信息"
        name="password"
        :rules="[
          { required: true, message: '请输入反馈信息' },
        ]"
      >
        <f-input v-model="ruleForm3.password" type="text" placeholder="请输入反馈信息" />
      </f-form-item>

      <f-form-item>
        <f-button type="primary" native-type="submit" block>提交表单</f-button>
      </f-form-item>
    </f-form>
</div>
<div v-if="page == '2'">
  <f-alert type="default">在云服务器上一键部署你的机器人</f-alert>
  <f-card title="选择bot进行部署">
    <f-text type="primary" bold>AI BOT</f-text>
    <f-box width=40% height="1px" padding="10px"></f-box>
    <f-text>4.6-c1</f-text>
    <f-box width=5% height="1px" padding="10px"></f-box>
    <f-button type="primary" :on-click="aibot">部署</f-button>
    <br>
    <br>
    <f-text type="primary" bold>批量发送私信</f-text>
    <f-box width=27.4% height="1px" padding="10px"></f-box>
    <f-text>批量发送私信1.1快速单线程</f-text>
    <f-box width=5% height="1px" padding="10px"></f-box>
    <f-button disabled type="default">部署（敬请期待）</f-button>
  </f-card>
</div>
<div v-if="page == '3'">
  <f-alert type="default">自己部署指定版本的bot后，在此连接bot以进行基本操作[该项目还在开发，敬请期待]</f-alert>
  <f-card title="连接到自部署的bot">
    <f-text type="primary" bold>AI BOT</f-text>
    <f-box width=40% height="1px" padding="10px"></f-box>
    <f-text type="warning">需要bot版本>=4.6-c1或者>=5.0</f-text>
    <f-box width=5% height="1px" padding="10px"></f-box>
    <f-button disabled type="default">连接（敬请期待）</f-button>
  </f-card>
</div>

<div v-if="page == '4'">
  <f-box width=40% height="1px" padding="10px"></f-box>
  <f-alert type="primary">1.输入bot token</f-alert>
  <f-input v-model="bottoken" type="text" clear placeholder="请输入bot token" />
  <f-box width=40% height="1px" padding="1px"></f-box>
  <f-alert type="primary">2.输入服务器id</f-alert>
  <f-input v-model="fwqid" type="text" search :on-search="onsearch" placeholder="请输入服务器id" />
  <f-box width=40% height="1px" padding="1px"></f-box>
  <f-alert type="primary">3.点击搜索，选择频道</f-alert>
  <f-select v-model="selectedChannel" :v-loading="startLoading" placeholder="请选择……">
    <!-- 动态生成的f-option组件 -->
    <f-option v-for="channel in channels" :key="channel.id" :value="channel.id">{{ channel.name }}</f-option>
  </f-select>
</div>
</template>

<script lang="ts" setup>
  import {
    FIconApps,
    FIconBlock,
    FIconCameraVideoSlash,
    FIconClock,
  } from '@fighting-design/fighting-icon';
  import { FNotification } from 'fighting-design'
  import { reactive,ref,watch } from 'vue'
  import { FMessage,MenuItemClick } from 'fighting-design'
  import type { FormSubmit } from 'fighting-design'
  import VConsole from 'vconsole';
  const vConsole = new VConsole();
  console.warn('该面板用于调试，勿在这里执行未知命令')
  let page = ref('1');
  let bottoken = ref('');
  let fwqid = ref('');
  let selectedChannel = ref('');
  const startLoading = ref(false)
  let login=false
  let tishi = "你还未登录，点击用户设置->登录，使用fanbook账号登录"
  const alertList = [
    "1.点击用户设置，使用fanbook账号登录",
    "2.点击部署，按照提示，部署机器人",
    "如遇Bug，填写下方表单反馈"
  ]
  FNotification({
      title: '警告',
      message: '项目目前在测试阶段，可能会有较多Bug',
      type: 'warning',
      close: true,
      closeBtn: '关闭',
      duration: 0
    })
    const ruleForm3 = reactive({
    admin: {
      info: {
        username: ''
      }
    },
    password: ''
  })
  import axios from 'axios';
  const duration = 4000
  const handelSubmit3: FormSubmit = (ok, model, res, evt): void => {
    
    console.log(model.admin.info.username)
    console.log(model.password)
    if (!ok) return
    FMessage.primary(`ok: ${ok} model:${model} res: ${res} evt: ${evt} 开始提交表单`)
  }
  const handleMenuItemClick: MenuItemClick = (target,evt): void => {
    console.log('Clicked menu item:', target);
    page.value = target;
  }
  let channels=null
  const aibot: MenuItemClick = (evt): void => {
    console.log(evt)
    page.value = '4'
    }
    const onsearch: MenuItemClick = (evt): void => {
  // Assigning new data directly to the existing channels variable
  var data = JSON.stringify({
    "user_id": "10001",
    "guild_id": fwqid.value
  });
  var jsonData;
  startLoading.value = true
  var config = {
    method: 'post',
    url: 'https://a1.fanbook.mobi/api/bot/0f2de7ac66727cd9fcec1ee43559c561f6abf3f1e202c5a06c2ae4a3f6cf94ab795fbfbe39ad311a18ad1ff314388d1c/channel/list',
    headers: {  
        'Content-Type': 'application/json'
    },
    data : data
  };
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    jsonData=response.data
    //如果返回中的ok=false
    if(jsonData.ok==false){
      FNotification.danger('请求失败，检查服务器id和bot token')
    }
    //如果返回中的ok=true
    if(jsonData.ok==true){
      FNotification.success('获取成功')
    }
    if(jsonData.ok==true){
      channels = jsonData.result.map(channel => ({
      id: channel.channel_id,
      name: channel.name
  }))}
  });
  // channels = jsonData.result.map(channel => ({
  //   id: channel.channel_id,
  //   name: channel.name
  // }));

  // Optionally, you can also update the selectedChannel value to prevent any issues
  //selectedChannel.value = ''; // Reset selected channel
  console.log(selectedChannel.value)
}

</script>
