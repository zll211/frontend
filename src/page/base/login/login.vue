<template>
  <div class="loginWrapper">
    <div class="loginContainer">
      <header>
        <h3 class="left">江丰生物病理信息管理系统</h3>
        <p class="right"><a href="#">U盾软件下载</a><a href="../../../browser/" target="_blank">浏览器下载</a></p>
        <p class="clear"></p>
      </header>
      <div class="content">
        <div class="carousel">
          <el-carousel :interval="2000" arrow="never" indicator-position="outside">
            <el-carousel-item >
              <img src="../../../assets/img/carousel_1.png" alt="">
            </el-carousel-item>
            <el-carousel-item >
              <img src="../../../assets/img/carousel_2.png" alt="">
            </el-carousel-item>
            <el-carousel-item >
              <img src="../../../assets/img/carousel_3.png" alt="">
            </el-carousel-item>
            <el-carousel-item >
              <img src="../../../assets/img/carousel_4.png" alt="">
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="loginBox">
          <div class="hospitalLogo"><img :src="setting.hospital_logo||hospitalLogo" alt="" width="72"></div>
          <h3 class="hospitalName">{{setting.hospital_name||hospitalName}}</h3>
          <el-form label-position="top" label-width="80px" :model="loginForm" ref="loginForm" :rules="loginRules" >
            <el-form-item label="用户名" prop="username" >
              <el-input v-model="loginForm.username" :auto-complete="rememberPassChecked ? 'on' : 'off'"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="loginForm.password" :auto-complete="rememberPassChecked ? 'on' : 'off'" v-on:keyup.enter.native="login('loginForm')"></el-input>
            </el-form-item>
            <el-row type="flex" justify="space-between">
              <el-checkbox label="记住密码" name="rememberPass" v-model="rememberPassChecked"></el-checkbox>
              <!--<a class="forget-password">忘记密码？</a>-->
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="login('loginForm')" plain>登录</el-button>
              <!--<el-button @click="ukey()" type="primary" plain>Ukey</el-button>-->
            </el-form-item>
          </el-form>
        </div>
      </div>
      <footer>
        <p>{{setting.version}}</p>
        <p>售后服务联系人:{{setting.linkman}} 联系电话:<a>{{setting.contact_number}}</a></p>
        <p>版权 江丰生物©2018</p>
      </footer>
    </div>
  </div>
</template>

<script src="./login.component.js"></script>
<style lang="scss" src="./login.scss"></style>
