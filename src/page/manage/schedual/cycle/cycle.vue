<template>
  <main class="main-container schedual-cycle-page">
    <pis-search-head
      ref="searchHead"
      :placeholder="placeholder"
      :form-id-list='[]'
      @refresh-page="cycleList"
      @search-list="cycleList($event)">
      <div class="operate-methods flex justify-content-end">
        <pis-icon style="margin-right: 15px"
                  class="add-btn"
                  :is-button="true"
                  icon-name="el-icon-plus"
                  @icon-click="createCycle"
                  icon-text='新增排班周期'></pis-icon>
      </div>
    </pis-search-head>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      :data="cycles"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="120"
        min-width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="cycle_name"
        label="周期名称"
        min-width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="work_day"
        label="工作天数"
        min-width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="rest_day"
        label="休息天数"
        min-width="120"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <div class="flex justify-content-center table-operate-methods">
            <pis-icon
              class="edit-table-icon-btn"
              icon-name="el-icon-edit"
              @icon-click="editCycle(scope.row.id)"
              icon-text='编辑'>
            </pis-icon>
            <pis-icon
              class="delete-table-icon-btn"
              icon-name="el-icon-delete"
              @icon-click="deleteCycle(scope.row.id)"
              icon-text='删除'>
            </pis-icon>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog width="600px" :title="title" :visible.sync="schedualViewDialog"
               center
               @close="closeDialog">
      <el-form>
        <el-row>
          <el-col class="flex align-items-center">
            <span>周期名称</span>
            <el-input style="width: 300px;margin-left: 50px" type="text"
                      size="small" v-model="cycleName"></el-input>
          </el-col>
          <el-col style="margin: 10px 0">
            <p>工作天数</p>
          </el-col>
          <el-col style="margin: 10px 0" :push="1" :span="23"
                  class="flex align-items-center justify-content-between"
                  v-for="(work,index) in workList" :key="index">
            <span>{{work.name}}</span>
            <el-time-picker
              size="small"
              is-range
              v-model="work.range"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
            <el-button size="small" type="danger" @click="deleteWork(index)">
              删除
            </el-button>
          </el-col>
          <el-col class="flex justify-content-end">
            <el-button size="small" type="primary" @click="addWork">新增
            </el-button>
          </el-col>
          <el-col class="flex align-items-center">
            <span>休息天数</span>
            <el-input style="width: 300px;margin-left: 50px" type="number"
                      size="small" v-model="restDay"></el-input>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer flex row justify-content-end">
        <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmSchedual()" size="small">确 定
        </el-button>
      </div>
    </el-dialog>
  </main>
</template>

<script src="./cycle.component.js"></script>

<style lang="scss">
  @import "../../../../style/variables";

  .schedual-cycle-page {
  }

</style>
