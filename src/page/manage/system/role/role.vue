<template>
  <el-row class="main-container role-page">
    <div class="operate-methods flex justify-content-end">
      <pis-icon
        class="add-btn"
        :is-button="true"
        icon-name="el-icon-plus"
        @icon-click="createRole"
        icon-text='新增角色'>
      </pis-icon>
      <pis-icon
        class="delete-btn"
        :is-button="true"
        icon-name="el-icon-close"
        @icon-click="batchDeleteRole"
        icon-text='批量删除'>
      </pis-icon>
    </div>
    <el-table
      ref="pTable"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      :data="roles"
      :height="tableHeight"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="right">
      </el-table-column>
      <el-table-column
        type="index"
        label="序列号"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        align="center">
      </el-table-column>
      <!--<el-table-column
        prop="number"
        label="人数"
        align="center">
      </el-table-column>-->
      <el-table-column
        prop="description"
        label="角色描述"
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
              @icon-click="editRole(scope.row)"
              icon-text='编辑'>
            </pis-icon>
            <pis-icon
              class="delete-table-icon-btn"
              icon-name="el-icon-delete"
              @icon-click="deleteRole(scope.row)"
              icon-text='删除'>
            </pis-icon>
            <pis-icon
              v-show="scope.row.switch==='on'"
              class="delete-table-icon-btn"
              icon-name="el-icon-remove"
              @icon-click="forbiddenRole(scope.row, 'off')"
              icon-text='禁用'>
            </pis-icon>
            <pis-icon
              style="margin-left: 35px"
              v-show="scope.row.switch==='off'"
              class="edit-table-icon-btn"
              icon-name="el-icon-circle-check"
              @icon-click="forbiddenRole(scope.row, 'on')"
              icon-text='启用'>
            </pis-icon>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增角色" :visible.sync="dialogRole" center width="60%">
      <el-form
        size="small" :model="roleForm" label-width="80px" label-position="left"
               class="edit-user-form" ref="roleForm" :rules="roleRules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
              <el-input type="textarea" v-model="roleForm.description"
                        :autosize="{ minRows: 4, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="dialogRole">
            <el-form-item label="菜单权限">
              <el-input
                class="filter-text"
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
              <el-tree
                class="filter-tree"
                :data="menus"
                :props="defaultProps"
                node-key="id"
                show-checkbox
                :check-on-click-node="true"
                :default-expanded-keys="defaultExpandedKeys"
                :default-checked-keys="defaultExpandedKeys"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                :check-strictly="true"
                ref="tree">
              </el-tree>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRole" round
                   class="messagebox-button">保 存
        </el-button>
        <el-button @click="cancelRole" round class="messagebox-button">取 消
        </el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script src="./role.component.js"></script>
<style src="./role.scss"></style>
