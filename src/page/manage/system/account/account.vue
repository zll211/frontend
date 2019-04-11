<template>
  <el-row>
    <div class="account-main flex column align-items-center">
      <img class="user-img" src="assets/img/default-avator.png">
      <span class="user-name">{{user.name}}</span>
      <el-form label-position="left" :model="userForm" label-width="100px" style="width: 100%" ref="userForm">
        <el-form-item label="联系方式">
          <span>{{user.phone}}</span>
        </el-form-item>
        <el-form-item label="邮 箱">
          <span>{{user.email}}</span>
        </el-form-item>
        <el-form-item label="所属机构">
          <span>{{user.organization.data.organization_name}}</span>
        </el-form-item>
        <el-form-item label="角 色">
          <el-tag
            :key="index"
            v-for="(role, index) in user.roles.data">
            {{role.name}}
          </el-tag>
        </el-form-item>
        <el-form-item label="密 码"></el-form-item>
        <div class="modify-password">
          <el-form-item label="当前密码" prop="current_password">
            <el-input
              :type="current.type"
              auto-complete="new-password"
              placeholder="当前密码"
              v-model="userForm.current_password"
              @focus="passwordFocus('current')">
              <img slot="suffix" class="el-input__icon el-icon-eye" :src="current.icon" @click="passwordEyeClick('current')">
            </el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_password">
            <el-input
              :type="newP.type"
              auto-complete="new-password"
              placeholder="新密码"
              v-model="userForm.new_password"
              @focus="passwordFocus('newP')">
              <img slot="suffix" class="el-input__icon el-icon-eye" :src="newP.icon" @click="passwordEyeClick('newP')">
            </el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="new_password_confirmation">
            <el-input
              :type="again.type"
              auto-complete="new-password"
              placeholder="确认新密码"
              v-model="userForm.new_password_confirmation"
              @focus="passwordFocus('again')">
              <img slot="suffix" class="el-input__icon el-icon-eye" :src="again.icon" @click="passwordEyeClick('again')">
            </el-input>
          </el-form-item>
          <el-form-item class="flex align-items-center">
            <el-button type="primary" size="mini" @click="savePassword">保存</el-button>
            <el-button type="default" size="mini">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </el-row>
</template>

<script src="./account.component.js"></script>

<style lang="scss" src="./account.scss"></style>
