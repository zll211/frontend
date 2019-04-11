<template>
  <el-row class="slice-bind main-container">
    <pis-search-head
      ref="searchHead"
      :keyword="searchParams.search"
      @refresh-page="refreshPage"
      @search-list="searchList"
      @select-change="selectChange">
    </pis-search-head>
    <pis-tab
      v-model="activeTabName"
      :tab-list="tabList"
      @tab-click="handleTab">
      <!--<el-row>
        <el-button type="primary" size="small" v-if="activeTabName==='binded'" @click="unPatchBind">
          解绑
        </el-button>
      </el-row>-->
    </pis-tab>
    <pis-page-size
      :total-count="pagination.total"
      :page-size="pagination.per_page"
      @page-size-change="pageSizeChange">
    </pis-page-size>
    <el-table
      v-loading="loading"
      :data="scans"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" v-if="activeTabName==='binded'">
      </el-table-column>
      <el-table-column fixed="left" prop="pathological_id" align="center" label="病理号" min-width="130">
        <template slot-scope="scope">
          <a @click="viewCollect(scope.row.id)" class="pathology-id">{{scope.row.id}}</a>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in tableHeaderList"
                       :key="index" :prop="item.prop"
                       :label="item.label" :align="item.align"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"
                     v-if="scope.row.section_status==='未扫描'"
                     @click="scanParafinSection(scope.row)">扫描
          </el-button>
          <el-button type="primary" size="mini"
                     v-if="scope.row.section_status==='未绑定'"
                     @click="bindParafinSection(scope.row)">绑定
          </el-button>
          <!-- <el-button type="primary" size="mini"
                      v-if="scope.row.section_status==='已绑定'"
                      @click="upBindParafinSection(scope.row.id)">解绑
           </el-button>-->
          <el-button type="primary" size="mini"
                     v-if="scope.row.section_status==='已绑定'"
                     @click="lookParafinSection(scope.row)">查看
          </el-button>
          <el-button type="primary" size="mini"
                     :disabled="!scope.row.sectionPath
                     ||scope.row.sectionPath.data.length===0"
                     v-if="scope.row.section_status==='已绑定'"
                     @click="lookKfb(scope.row)">阅片
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="flex justify-content-center"
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.per_page"
      :current-page="pagination.current_page"
      @current-change="currentChange">
    </el-pagination>

    <el-dialog class="bind-dialog" title="绑定切片" width="600px" :visible.sync="bindDialogVisible">
      <div class="flex align-items-center">
        <el-button type="text" size="small" style="margin-right: 10px">当前病理号：{{scan.id}}</el-button>
        <el-select v-model="section" size="small" clearable placeholder="请选择切片编号">
          <el-option v-for="(item,index) in sectionList" :key="index" :label="item.section_number"
                     :value="item.id"></el-option>
        </el-select>
      </div>
      <el-table
        :data="imageList"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          align="center">
        </el-table-column>
        <el-table-column label="图片" align="center" prop="path">
          <template slot-scope="scope">
            <img :src="scope.row.labelSrc" style="height: 50px">
          </template>
        </el-table-column>
        <el-table-column label="条形码" align="center" prop="barcode">
        </el-table-column>
        <el-table-column label="设备编号" align="center" prop="dev_id">
        </el-table-column>
        <el-table-column label="扫描时间" align="center" prop="record_at">
        </el-table-column>
      </el-table>
      <el-pagination
        class="flex justify-content-center"
        background
        layout="prev, pager, next"
        :total="pathPagination.total"
        :page-size="pathPagination.per_page"
        :current-page="pathPagination.current_page"
        @current-change="pathCurrentChange">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="bindDialogVisible = false">关 闭</el-button>
        <el-button size="small" type="primary"
                   @click="confirmBind">确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog class="bind-dialog" title="绑定详情" width="600px" :visible.sync="bindDetailDialogVisible">
      <el-table
        :data="imageList" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          align="center">
        </el-table-column>
        <el-table-column label="图片" align="center" prop="path">
          <template slot-scope="scope">
            <img :src="scope.row.labelSrc" style="height: 50px">
          </template>
        </el-table-column>
        <el-table-column label="扫描时间" align="center" prop="record_at">
        </el-table-column>
        <el-table-column label="绑定时间" align="center" prop="bind_at">
        </el-table-column>
        <el-table-column label="绑定操作人" align="center" prop="binder">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="bindDetailDialogVisible = false">关 闭</el-button>
        <el-button size="small" type="primary"
                   @click="unPatchBind">解绑
        </el-button>
      </div>
    </el-dialog>

    <el-dialog class="bind-kfb-view" :fullscreen="true" :visible.sync="showFile" title="阅片">
      <pis-slide-view v-if="showFile" :file-name-list="fileNameList" :file-index.sync="fileIndex"></pis-slide-view>
    </el-dialog>
  </el-row>
</template>

<script src="./bind.components.js"></script>

<style lang="scss" src="./bind.scss"></style>
