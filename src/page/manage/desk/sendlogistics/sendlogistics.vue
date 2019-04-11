<template>
  <div class="send-logistics-page">
    <el-tabs v-model="activeInputWay" @tab-click="handleClick">
      <el-tab-pane label="手动输入" name="手动输入">
        <el-row :gutter="20">
          <el-col :span="10" class="left-area">
            <div class="grid-content">
              <el-form :model="sendLogisticsForm" :rules="rules" ref="sendLogisticsForm" label-width="100px" label-position="right" class="send-logistics-form">
                <el-row :gutter="10">
                  <el-col :span="10">
                    <el-form-item label="物流公司" filterable>
                      <el-select v-model="sendLogisticsForm.logistics_company" filterable clearable size="small">
                        <el-option label="申通快递" value="申通快递"></el-option>
                        <el-option label="韵达快递" value="韵达快递"></el-option>
                        <el-option label="圆通快递" value="圆通快递"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="物流单号">
                      <el-input v-model="sendLogisticsForm.logistics_number" size="small"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="10">
                    <el-form-item label="接收方"  prop="receive_name">
                      <el-select v-model="sendLogisticsForm.receiver" filterable clearable placeholder="接收方" size="small">
                        <el-option
                          v-for="item in receiverList"
                          :key="item.id"
                          :label="item.organization_name"
                          :value="item.organization_name">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="联系电话">
                      <el-input v-model="sendLogisticsForm.receiver_phone" size="small"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20">
                    <el-form-item label="接收方地址">
                      <el-input v-model="sendLogisticsForm.receiver_address" size="small"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="发送内容">
                  <el-row :gutter="10" v-for="(item,index) in sendLogisticsForm.send_content" :key="index">
                    <el-col :span="1">
                      <div class="grid-content">
                        <span>{{index+1}}.</span>
                      </div>
                    </el-col>
                    <el-col :span="7">
                      <div class="grid-content">
                        <el-input placeholder="内容" v-model="item.content" size="small"></el-input>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="grid-content">
                        <el-input placeholder="数量" v-model="item.number" size="small"></el-input>
                      </div>
                    </el-col>
                    <el-col :span="7">
                      <div class="grid-content">
                        <el-input placeholder="备注" v-model="item.remark" size="small"></el-input>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="grid-content">
                        <el-button type="danger" @click="delSendItem(index)" size="small">删除</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-form-item>
                <div  @click="addSendItem" class="add-btn"><el-button size="mini" type="primary"><i class="el-icon-plus"></i></el-button><span class="add_text">新增一行</span></div>


                <!--<el-form-item label="发送日期">
                  <el-date-picker
                    v-model="sendLogisticsForm.send_at"
                    align="right"
                    type="date"
                    placeholder="选择发送日期"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>-->
                <div class="handle-btn flex justify-content-center">
                  <el-button @click="submitForm('sendLogisticsForm')">保存</el-button>
                  <el-button type="primary" @click="sendLogiscticsForm('sendLogisticsForm')">派发</el-button>
                </div>
              </el-form>

            </div>
          </el-col>
          <el-col :span="14" class="right-area">
            <div class="grid-content">
              <div class="send-logistics-table">
                <pis-page-size
                  :total-count="pagination.total"
                  :page-size="tablePageSize"
                  @page-size-change="handleSizeChange">
                </pis-page-size>
                <el-table
                  v-loading="loading"
                  :data="sendTableData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                  highlight-current-row
                  @row-click = "rowClick"
                >
                  <el-table-column
                    type="selection"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="logistics_company"
                    label="物流公司"
                    align="center"
                    fixed>
                  </el-table-column>
                  <el-table-column
                    prop="logistics_number"
                    label="物流单号"
                    align="center"
                    fixed>
                  </el-table-column>
                  <el-table-column
                    prop="receiver"
                    label="接收方"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="sender"
                    label="发送方"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="send_content"
                    label="关联材料"
                    align="center">
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                      <div class="flex">
                        <div class="send" @click="send(scope.row.id)">
                          <i class="el-icon-edit"></i>
                          <span>派发</span>
                        </div>
                        <div class="delete" @click="deleteLogistics(scope.row.id)">
                          <i class="el-icon-close"></i>
                          <span>删除</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  class="flex justify-content-center"
                  @current-change="handleCurrentChange"
                  background
                  :page-size="pagination.per_page"
                  :current-page="pagination.current_page"
                  layout="prev, pager, next"
                  :total="pagination.total">
                </el-pagination>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="快速选择" name="快速选择" disabled>
        <div style="text-align: center">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="sendValue"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="['待派发', '打包发送']"
            :button-texts="['到左边', '到右边']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            @change="handleChange"
            :data="sendData">
            <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
            <el-select v-model="sendLogisticsForm.receive_name" placeholder="送检医院" class="transfer-footer" slot="left-footer" size="mini">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <el-button class="transfer-footer" slot="right-footer" size="small" @click="logisticsDialogVisible = true">操作</el-button>
          </el-transfer>
        </div>
      </el-tab-pane>
    </el-tabs>
    <router-link to="/desk/logistics"><el-button class="return-btn" type="primary" size="small">返回</el-button></router-link>
    <el-dialog
      title="物流单"
      :visible.sync="logisticsDialogVisible"
      width="30%"
      center
      class="logistics-dialog">
      <el-form :model="sendLogisticsForm" :rules="rules" ref="sendLogisticsForm" label-width="100px">
        <el-form-item label="接收方">
          <el-select v-model="sendLogisticsForm.receive_name" placeholder="请选择接收方" size="small">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接收方地址">
          <el-input v-model="sendLogisticsForm.receive_address" size="small" class="short-input"></el-input>
        </el-form-item>
        <el-form-item label="物流公司">
          <el-select v-model="sendLogisticsForm.logistics_company" placeholder="请选择接快递公司" size="small">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="sendLogisticsForm.tracking_number" size="small" class="short-input"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="sendLogisticsForm.remark" type="textarea" size="small" class="short-input"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logisticsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="logisticsDialogVisible = false">派 发</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./sendlogistics.component.js"></script>
<style src="./sendlogistics.scss"></style>
