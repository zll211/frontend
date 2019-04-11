<template>
  <div class="materials-page main-container">
    <el-row :gutter='10'>
      <el-col :span="6">
        <pis-title label="物料分类"></pis-title>
        <div class="group side">
          <el-button-group>
            <el-button type="primary" size="small" @click="addGroup">增加</el-button>
            <el-button type="primary" size="small" @click="delGroup">删除</el-button>
            <el-button type="primary" size="small" @click="editGroup">编辑</el-button>
            <el-button type="primary" size="small" @click="refreshGroupData">刷新</el-button>
          </el-button-group>
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText"
            size="small">
          </el-input>
          <el-tree
            v-loading="treeLoading"
            class="filter-tree"
            node-key="id"
            show-checkbox
            :check-strictly="true"
            :data="groupData"
            :props="defaultProps"
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            :default-expanded-keys="defaultExpandedKeys"
            ref="groupTree">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="17">
        <pis-title label="物品列表"></pis-title>
        <div class="materials side">
          <div class="flex justify-content-end">
            <pis-icon
              icon-name="el-icon-plus"
              icon-text="新增物品"
              @icon-click="materialsFormDialog = true"
              class="flex justify-content-end"></pis-icon>
            <pis-icon
              icon-name="el-icon-refresh"
              icon-text="刷新"
              @icon-click="refreshPage"
              class="flex justify-content-end"></pis-icon>
          </div>
          <pis-page-size
            :total-count="pagination.total"
            :page-size="tablePageSize"
            @page-size-change="handleSizeChange">
          </pis-page-size>
          <el-table
            ref="chooseAssets"
            v-loading="loading"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            highlight-current-row>
            <el-table-column
              type="selection"
              align="center">
            </el-table-column>
            <el-table-column
              label="耗材编码"
              prop="consumables_id"
              width="100px"
              align="center"
              fixed>
              <template slot-scope="scope">
                <a @click="viewMaterials(scope.row, scope.row.id)" style="color: #01cfb1;text-decoration:underline;cursor: pointer">{{scope.row.consumables_id}}</a>
              </template>
            </el-table-column>
            <el-table-column
              label="物料名称"
              prop="consumables_name"
              align="center"
              fixed>
            </el-table-column>
            <el-table-column
              label="规格型号"
              prop="model_specification"
              align="center">
            </el-table-column>
            <el-table-column
              label="计量单位"
              prop="unit"
              align="center">
            </el-table-column>
            <el-table-column
              label="库存上限"
              prop="inventory_upper_limit"
              align="center">
            </el-table-column>
            <el-table-column
              label="库存下限"
              prop="inventory_lower_limit"
              align="center">
            </el-table-column>
            <el-table-column
              label="品牌"
              prop="brand"
              align="center">
            </el-table-column>
            <el-table-column
              label="供应商"
              prop="supplier"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="130px"
              fixed="right">
              <template slot-scope="scope">
                <div class="flex justify-content-center">
                  <el-button type="primary" @click="editMaterialsBtn(scope.row,scope.row.id)" size="mini">修改</el-button>
                  <el-button type="danger" @click="deleteMaterialsBtn(scope.row,scope.row.id)" size="mini">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="flex justify-content-center"
                         @current-change="handleCurrentChange"
                         background
                         :page-size="pagination.per_page"
                         :current-page="pagination.current_page"
                         layout="prev, pager, next"
                         :total="pagination.total"
                         style="padding-top: 20px;">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <!--物品分类增改dialog-->
    <el-dialog :title="this.groupAction+'分类'" :visible.sync="groupDialog" center @close="closeGroupDialog" class="groupDialog" width="380px">
      <el-form label-position="left" label-width="80px">
        <el-form-item label="分类名称">
          <el-input size="small" v-model="groupName" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelGroupDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="submitGroupDialog" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!--物品详情增改dialog-->
    <el-dialog title="物品详情" :visible.sync="materialsFormDialog" center @close="closeMaterialsFormDialog" width="40%">
      <el-form :model="materialsForm" :rules="materialsFormRules" ref="materialsForm" label-position="right" label-width="80px" size="small" class="materials-form" :disabled="materialsFormAbled">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="物料名称" prop="consumables_name">
              <el-input v-model="materialsForm.consumables_name" placeholder="物料名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号" prop="model_specification">
              <el-input v-model="materialsForm.model_specification" placeholder="规格型号" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="物料分类" prop="category_id">
              <el-cascader
                v-model="materialsForm.category_id"
                placeholder="请选择物料分类"
                :options="materialsData"
                filterable
                clearable
                change-on-select
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计量单位" prop="unit">
              <el-input v-model="materialsForm.unit" placeholder="计量单位" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="库存上限" prop="inventory_upper_limit">
              <el-input type="text" v-model="materialsForm.inventory_upper_limit" clearable placeholder="库存上限"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存下限" prop="inventory_lower_limit">
              <el-input type="text" v-model="materialsForm.inventory_lower_limit" clearable placeholder="库存下限"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="materialsForm.brand" placeholder="品牌" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplier">
              <el-input type="text" v-model="materialsForm.supplier" clearable placeholder="供应商"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="materialsForm.remark" clearable placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelMaterialsFormDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('materialsForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./materials.component.js"></script>
<style lang="scss" src="./materials.scss"></style>
