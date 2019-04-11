<template>
  <div class="timeout-page main-container">
    <pis-title label="角色配置"></pis-title>
    <div class="role-config-form"
         v-loading="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.5)">
      <el-form label-position="left"
               label-width="150px" size="small">
        <el-form-item :label="roleConfig.label" v-for="(roleConfig,index) in roleConfigs"
                      :key="index">
          <el-tag
            :key="tag.id"
            v-for="tag in roleConfig.tags"
            closable
            :disable-transitions="false"
            @close="handleClose(roleConfig, tag)">
            {{tag.name}}
          </el-tag>
          <el-button type="primary" size="small" @click="addRole(roleConfig)">+ 新增角色
          </el-button>
        </el-form-item>
      </el-form>
      <el-button class="align-self-start" type="primary" size="small"
                 @click="saveRoleConfig">保存
      </el-button>
    </div>
    <el-dialog title="选择角色" width="400px" :visible.sync="roleViewVisible">
      <el-select
        style="width: 100%"
        v-model="role"
        filterable
        reserve-keyword
        multiple
        placeholder="请选择相关角色">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer flex row justify-content-end">
        <el-button type="primary" size="mini" @click="confirmRole">确定
        </el-button>
        <el-button type="info" size="mini" plain
                   @click="roleViewVisible = false">取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./role.component.js"></script>

<style scoped lang="scss">
  .role-config-form {
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    padding: 20px;
    border-radius: 5px;
    background-color: #ffffff;
    .el-tag {
      margin-right: 10px;
    }
  }
</style>
