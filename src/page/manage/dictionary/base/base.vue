<template>
  <main class="main-container dic-base-page">
    <el-tabs v-model="activeTabName" type="card" @tab-click="handleClick">
      <el-tab-pane label="送检信息管理" name="1">
        <el-row :gutter="20">
          <el-col :span="8" class="text-right"
                  v-for="(inspectionType,index) in inspectionTypeList"
                  :key="index">
            <el-button type="primary" size="mini"
                       @click="addInspection(inspectionType.type)">
              新增{{getTypeValue(inspectionType.type)}}
            </el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="8" v-for="(inspectionType,index) in inspectionTypeList"
                  :key="index">
            <el-table
              v-loading="inspectionType.loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.5)"
              border
              :data="inspectionType.list">
              <el-table-column
                prop="name"
                :label="getTypeValue(inspectionType.type)"
                align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini"
                             @click="editInspection(inspectionType.type , scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="mini"
                             @click="deleteInspection(inspectionType.type , scope.row.id)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="染色试剂配置" name="2">
        <reagent v-if="activeTabName==='2'" type="dye"></reagent>
      </el-tab-pane>
      <el-tab-pane label="免疫组化试剂" name="3">
        <reagent v-if="activeTabName==='3'" type="immunohistochemical"></reagent>
      </el-tab-pane>

      <el-tab-pane label="分子病理" name="4">
        <reagent v-if="activeTabName==='4'" type="molecular"></reagent>
      </el-tab-pane>
    </el-tabs>
  </main>
</template>

<script src="./base.component.js"></script>

<style lang="scss" src="./base.scss"></style>
