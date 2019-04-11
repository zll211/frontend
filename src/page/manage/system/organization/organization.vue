<template>
  <el-row class="organization-page main-container" type="flex">
    <div class="flex-1" style="margin-right: 42px">
      <pis-title label="组织管理"></pis-title>
      <el-row class="tree-page">
        <div class="operate-methods flex">
          <pis-icon
            class="add-btn"
            :is-button="true"
            icon-name="el-icon-plus"
            @icon-click="createOrganization"
            icon-text='新增组织'>
          </pis-icon>
          <pis-icon
            class="delete-btn"
            :is-button="true"
            icon-name="el-icon-close"
            @icon-click="deleteOrganization"
            icon-text='删除组织'>
          </pis-icon>
        </div>
        <el-input
          size="small"
          class="filter-text"
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree
          v-loading="loading"
          class="filter-tree"
          :data="organizations"
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
          size="small" label-position="top" label-width="80px" :model="organizationForm" :rules="organizationRules" ref="organizationForm">
          <el-form-item label="组织架构名称" prop="label">
            <el-input v-model="organizationForm.label" placeholder="请输入组织架构名称"></el-input>
          </el-form-item>
          <el-form-item label="上级组织架构名称" prop="previousOrganization">
            <el-cascader
              v-model="organizationForm.previousOrganization"
              placeholder="请选择上级入组织架构"
              :options="organizations"
              filterable
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="组织架构描述" prop="desc">
            <el-input type="textarea" v-model="organizationForm.desc" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveOrganization">确定</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </el-row>
</template>

<script src="./organization.component.js"></script>

<style lang="scss" src="./organization.scss"></style>
