<template>
  <main class="production-page main-container">
    <production-list
      :loading="loading"
      :prods="prods"
      :tab-name="tabList[0].name"
      :tab-list="tabList"
      :table-header-data="tableHeaderData"
      :normal-count-list="normalCountList"
      :pagination="pagination"
      @confirm-operate='confirmOperate'
      @prod-list="prodList"
      @back-operate="backOperate"
      @print-label="printLabel"
      @print-section="printSection">
    </production-list>

    <iframe :src="printPdf" style="width: 100%;height: 100%;display: none" frameborder="0"
            marginheight="0" marginwidth="0" class="printIfr">
    </iframe>
    <el-dialog width="400px" title="制片操作"
               :visible.sync="productionFormVisible">
      <el-form size="small" :model="productionForm" label-width="120px"
               ref="productionForm"
               :rules="productionFormRules">
        <el-form-item label="制片开始时间" prop="startTime">
          <el-date-picker
            style="width: 100%"
            v-model="productionForm.startTime"
            type="datetime"
            placeholder="选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="制片结束时间" prop="endTime">
          <el-date-picker
            style="width: 100%"
            v-model="productionForm.endTime"
            type="datetime"
            placeholder="选择时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelStatus">取 消</el-button>
        <el-button size="small" type="primary" @click="updateStatus">确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog size="small" width="400px" title="染色操作" :visible.sync="dyeingFormVisible">
      <el-form :model="dyeingForm" label-width="80px" ref="dyeingForm"
               :rules="dyeingFormRules">
        <el-form-item label="操作机器" prop="name">
          <el-select v-model="dyeingForm.name" placeholder="请选择封片机型号"
                     style="width: 100%"
                     filterablenum
                     allow-create>
            <el-option :label="asset.label" :value="asset.label" v-for="(asset, index) in dyeingMachineList"
                       :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="染色时间" prop="time">
          <el-date-picker
            style="width: 100%"
            v-model="dyeingForm.time"
            type="datetime"
            placeholder="选择染色时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="染色试剂" prop="reagent">
          <el-select v-model="dyeingForm.reagent" placeholder="请选择染色试剂"
                     style="width: 100%"
                     filterable
                     allow-create>
            <el-option label="HE" value="HE"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelStatus">取 消</el-button>
        <el-button size="small" type="primary" @click="updateStatus">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="400px" title="封片操作" :visible.sync="sealFormVisible">
      <el-form size="small" :model="sealForm" label-width="120px" ref="sealForm"
               :rules="sealFormRules">
        <el-form-item label="封片机型号" prop="name">
          <el-select v-model="sealForm.name" placeholder="请选择封片机型号"
                     style="width: 100%"
                     filterablenum
                     allow-create>
            <el-option :label="asset.label" :value="asset.label" v-for="(asset, index) in sealMachineList"
                       :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封片开始时间" prop="startTime">
          <el-date-picker
            style="width: 100%"
            v-model="sealForm.startTime"
            type="datetime"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="封片完成时间" prop="endTime">
          <el-date-picker
            style="width: 100%"
            v-model="sealForm.endTime"
            type="datetime"
            placeholder="选择完成时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelStatus">取 消</el-button>
        <el-button size="small" type="primary" @click="updateStatus">确 定</el-button>
      </div>
    </el-dialog>
  </main>
</template>

<script src="./cell.component.js"></script>

<style lang="scss" src="./cell.scss"></style>
