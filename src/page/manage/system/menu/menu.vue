<template>
  <el-row class="main-container menu-page" type="flex">
    <div class="flex-1" style="margin-right: 42px">
      <pis-title label="菜单管理"></pis-title>
      <el-row class="tree-page">
        <div class="operate-methods flex">
          <pis-icon
            class="add-btn"
            :is-button="true"
            icon-name="el-icon-plus"
            @icon-click="createMenu"
            icon-text='新增菜单'>
          </pis-icon>
          <pis-icon
            class="delete-btn"
            :is-button="true"
            icon-name="el-icon-close"
            @icon-click="deleteMenu"
            icon-text='删除菜单'>
          </pis-icon>
        </div>
        <el-input
          size="small"
          class="filter-text"
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <div class="flex">
          <el-button size="mini" @click="upMenu"><i class="el-icon-upload2"></i> 菜单上移</el-button>
          <el-button size="mini" @click="downMenu"><i class="el-icon-download"></i> 菜单下移</el-button>
        </div>
        <el-tree
          v-loading="loading"
          class="filter-tree"
          :data="menus"
          node-key="id"
          show-checkbox
          :check-strictly="true"
          :default-expanded-keys="defaultExpandedKeys"
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
          ref="tree">
        </el-tree>
      </el-row>
    </div>
    <div class="flex-1">
      <pis-title label="基本信息"></pis-title>
      <el-row class="tree-page">
        <el-form
          size="small" label-position="left" label-width="100px" :model="menuForm"
          :rules="menuRules" ref="menuForm">
          <el-form-item label="菜单名称" prop="label">
            <el-input v-model="menuForm.label" placeholder="请输入菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="菜单别名" prop="alias">
            <el-input v-model="menuForm.alias" placeholder="请输入菜单别名"></el-input>
          </el-form-item>
          <el-form-item label="上级菜单名称" prop="previousMenu">
            <el-cascader
              v-model="menuForm.previousMenu"
              placeholder="请选择上级菜单名称"
              :options="previousMenus"
              filterable
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="路由地址" prop="uri">
            <el-input v-model="menuForm.uri" placeholder="请输入路由地址"></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="permission">
            <el-input v-model="menuForm.permission" placeholder="请输入权限标识"></el-input>
          </el-form-item>
          <el-form-item label="菜单显示" prop="type">
            <el-checkbox-group v-model="menuForm.isShow">
              <el-checkbox label="显示" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="菜单Icon" prop="icon">
            <el-upload
              class="upload-demo"
              ref="uploadIcon"
              action="/api/image"
              name="icon"
              :limit="limit"
              :data="uploadIconData"
              :headers="uploadImgHeader"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="true"
              :on-success="uploadImgSuccess"
              accept="image/*">
              <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="菜单描述" prop="description">
            <el-input type="textarea" v-model="menuForm.description"
                      :autosize="{ minRows: 4, maxRows: 4}" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="saveMenu">保存</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </el-row>
</template>

<script src="./menu.component.js"></script>

<style lang="scss" src="./menu.scss"></style>
