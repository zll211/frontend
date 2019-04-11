<template>

  <el-row class="main-container users-page">
    <div class="flex justify-content-between align-items-center operate-methods">
      <el-input v-model="userSearchInput" placeholder="用户名/姓名" type="text" size="small"
                class="user-search-input"></el-input>
      <div class="flex">
        <pis-icon
          class="add-btn"
          :is-button="true"
          icon-name="el-icon-plus"
          @icon-click="createUser"
          icon-text='新增用户'>
        </pis-icon>
        <pis-icon
          class="delete-btn"
          :is-button="true"
          icon-name="el-icon-close"
          @icon-click="batchDeleteUser"
          icon-text='批量删除'>
        </pis-icon>
      </div>
    </div>
    <pis-page-size
      :total-count="pagination.total"
      :page-size="tablePageSize"
      @page-size-change="handleSizeChange">
    </pis-page-size>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      :data="users"
      tooltip-effect="dark"
      style="width: 100%"
      ref="pTable"
      :height="tableHeight"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="realname"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        align="center">
        <template slot-scope="scope">
          <el-tag
            :key="index"
            v-for="(role, index) in scope.row.roles.data">
            {{role.name}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="organizationName"
        label="所属机构"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系方式"
        align="center">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        align="center">
      </el-table-column>
      <el-table-column
        prop="switch"
        label="状态"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="scope.row.switch==='on'">
            正常
          </el-button>
          <el-button style="color:#f56c6c;" type="text" size="small"
                     v-if="scope.row.switch==='off'">禁用
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" fixed="right">
        <template slot-scope="scope">
          <div class="flex align-items-center table-operate-methods">
            <pis-icon
              class="edit-table-icon-btn"
              icon-name="el-icon-edit"
              @icon-click="editUser(scope.row)"
              icon-text='编辑'>
            </pis-icon>
            <pis-icon
              class="delete-table-icon-btn"
              icon-name="el-icon-delete"
              @icon-click="deleteUser(scope.row)"
              icon-text='删除'>
            </pis-icon>
            <pis-icon
              v-show="scope.row.switch==='on'"
              class="delete-table-icon-btn"
              icon-name="el-icon-remove"
              @icon-click="forbiddenUser(scope.row, 'off')"
              icon-text='禁用'>
            </pis-icon>
            <pis-icon
              style="margin-left: 35px"
              v-show="scope.row.switch==='off'"
              class="edit-table-icon-btn"
              icon-name="el-icon-circle-check"
              @icon-click="forbiddenUser(scope.row, 'on')"
              icon-text='启用'>
            </pis-icon>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="flex justify-content-center "
                   @current-change="handleCurrentChange"
                   background
                   :page-size="pagination.per_page"
                   :current-page="pagination.current_page"
                   layout="prev, pager, next"
                   :total="pagination.total">
    </el-pagination>

    <el-dialog title="用户信息" :visible.sync="dialogUser" center width="40%">
      <el-form
        size="small" :model="userForm" label-width="80px" label-position="left"
               class="edit-user-form" ref="userForm" :rules="userRules">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="userForm.name" auto-complete="off" placeholder="用以登录系统"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="userForm.realname" auto-complete="off" placeholder="请输入您的姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="userForm.roleIds" multiple placeholder="请选择角色"
                     style="width: 100%">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构" prop="organizationIds">
          <el-cascader
            style="width: 100%"
            v-model="userForm.organizationIds"
            placeholder="请选择机构"
            :options="organizations"
            filterable
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userForm.password" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newpassword">
          <el-input type="password" v-model="userForm.newpassword" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="userForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveUser" round
                   class="messagebox-button">保 存
        </el-button>
        <el-button @click="cancelUser" round class="messagebox-button">取 消
        </el-button>
      </div>
    </el-dialog>
  </el-row>

</template>

<script src="./users.component.js"></script>
<style src="./users.scss"></style>
