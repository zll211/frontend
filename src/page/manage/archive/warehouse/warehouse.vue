<template>
  <div class="warehouse-page main-container">
    <pis-search-head
      ref="searchHead"
      @refresh-page="refreshPage"
      :show-search-input="false"
      :form-id-list="[]">
      <div class="flex">
        <pis-icon
          class="add-btn"
          :is-button="true"
          icon-name="el-icon-plus"
          @icon-click="createWarehouse"
          icon-text='新增仓库'>
        </pis-icon>
      </div>
    </pis-search-head>
    <pis-page-size
      :total-count="pagination.total"
      :page-size="pagination.per_page"
      @page-size-change="pageSizeChange">
    </pis-page-size>
    <el-table
      v-loading="loading"
      :data="data"
      tooltip-effect="dark"
      ref="reportTable"
      style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="仓库名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="volume"
        label="仓库容量"
        align="center">
      </el-table-column>
      <el-table-column
        prop="avail_volume"
        label="剩余余量"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" fixed="right">
        <template slot-scope="scope">
          <div class="flex justify-content-center">
            <el-button type="primary" @click="editWarehouse(scope.row)" size="mini">修改</el-button>
            <el-button type="danger" @click="deleteWarehouse(scope.row.id)" size="mini">删除</el-button>
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

    <el-dialog title="仓库信息" :visible.sync="dialogWarehouse" center width="400px">
      <el-form
        size="small" :model="warehouseForm" label-width="80px" label-position="left" ref="warehouseForm" :rules="warehouseRules">
        <el-form-item label="仓库名称" prop="name">
          <el-input v-model="warehouseForm.name" auto-complete="off" placeholder="请输入仓库名称"></el-input>
        </el-form-item>
        <el-form-item label="仓库容量" prop="volume">
          <el-input v-model="warehouseForm.volume" auto-complete="off"  placeholder="请输入仓库容量"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveWarehouse">保 存</el-button>
        <el-button size="small" @click="dialogWarehouse=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./warehouse.component.js"></script>

<style lang="scss">
  @import "../../../../style/variables";

  .warehouse-page {

    .add-btn {
      cursor: pointer;
      margin-right: 20px;
      .el-button--mini {
        background: $_pm-base-color;
        border: none;
        border-radius: 4px;
        font-size: 17px;
        height: 29px;
        padding: 0;
        width: 29px;
        i {
          color: #fff;
        }
      }
    }
  }
</style>
