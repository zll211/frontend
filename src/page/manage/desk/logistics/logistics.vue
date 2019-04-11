<template>
  <div class="logistics-page main-container">
    <pis-search-head
      placeholder="快递单号"
      ref="searchHead"
      @refresh-page="refreshPage"
      @search-list="searchList"
      @select-change="selectChange"
      :form-id-list="[]"
      :searchFormList="searchFormList">
      <div class="flex align-items-center pointer" @click="logisticsDialog = true" style="margin-right: 30px">
        <i class="el-icon-circle-plus func-btn-icon"></i>
        <span class="refresh-text">发送物流</span>
      </div>
    </pis-search-head>
    <div class="logistics-table">
      <pis-tab
        v-model="logisticsTab"
        :tab-list="[{label:'派发中',name:'派发中',number:countList.distributed},{label:'已签收',name:'已签收',number:countList.signed}]"
        @tab-click="logisticsTabHandleClick">
      </pis-tab>
          <pis-page-size
            :total-count="pagination.total"
            :page-size="tablePageSize"
            @page-size-change="handleSizeChange">
          </pis-page-size>
          <el-table
            v-loading="loading"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              v-for="(item,index) in columnList"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :type="item.type"
              :fixed="item.fixed"
              :width="item.width"
              align="center"
            >
            </el-table-column>
            <el-table-column label="操作" align="center" width="190" v-if=" this.tableStatus === '已派发' ">
              <template slot-scope="scope">
                <div class="flex">
                  <el-button type="primary" size="mini" @click="viewLogistics(scope.row,scope.row.id)">查看详情</el-button>
                  <el-button type="primary" size="mini" @click="ensureReceive(scope.row.id)">确认收货</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100" v-if=" this.tableStatus !== '已派发' ">
              <template slot-scope="scope">
                <div class="flex">
                  <el-button type="primary" size="mini" @click="viewLogistics(scope.row,scope.row.id)">查看详情</el-button>
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
    <el-dialog title="发送物流" :visible.sync="logisticsDialog" center @close="closeLogisticsDialog" width="40%">
      <el-form :model="sendLogisticsForm" :rules="sendLogisticsFormRules" ref="sendLogisticsForm" label-width="100px" label-position="right" class="send-logistics-form">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="物流公司" filterable>
              <el-select v-model="sendLogisticsForm.logistics_company" filterable clearable size="small">
                <el-option label="申通快递" value="申通快递"></el-option>
                <el-option label="韵达快递" value="韵达快递"></el-option>
                <el-option label="圆通快递" value="圆通快递"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流单号">
              <el-input v-model="sendLogisticsForm.logistics_number" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
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
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="sendLogisticsForm.receiver_phone" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="接收方地址">
              <el-input v-model="sendLogisticsForm.receiver_address" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="发送内容">
          <el-row :gutter="10" v-for="(item,index) in sendLogisticsForm.send_content" :key="index">
            <el-col :span="2">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelLogisticsDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="submitLogisticsDialog" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="物流详情" :visible.sync="logisticsDetailDialog" center width="800px" class="logistics-detail-dialog">
      <div style="padding: 0 35px">
        <el-row :gutter="10" class="logistics-detail">
          <el-col :span="8">物流单号：{{logisticDetail.logistics_number}}</el-col>
          <el-col :span="8">承运公司：{{logisticDetail.logistics_company}}</el-col>
          <el-col :span="8">派发日期：{{logisticDetail.send_at}}</el-col>
        </el-row>
        <el-row :gutter="10" class="logistics-detail">
          <el-col :span="8">物流状态：{{logisticDetail.status}}</el-col>
          <el-col :span="8">发送方：{{logisticDetail.sender}}</el-col>
          <el-col :span="8">接收方：{{logisticDetail.receiver}}</el-col>
        </el-row>
        <el-row :gutter="10" v-if="logisticDetail.signer?true:false" class="logistics-detail">
          <el-col :span="8">签收人：{{logisticDetail.signer}}</el-col>
          <el-col :span="8">签收日期：{{logisticDetail.sign_at}}</el-col>
        </el-row>
        <el-row :gutter="10" class="logistics-detail">
          <el-col :span="24">物流状态：{{logisticDetail.send_content}}</el-col>
        </el-row>
        <hr style="border-top: 1px solid rgba(233,233,233,1);border-bottom: none;">
        <div class="logistics-route">
          <div class="left logistics-route-block">
            <p class="logistics-route-top" :style="{left: senderLeft}">{{logisticDetail.sender}}</p>
            <div class="dot"></div>
            <p class="logistics-route-bottom">已发货</p>
          </div>
          <div class="row-line left"></div>
          <div class="left logistics-route-block" :class="{active: logisticDetail.status === '已派发'}">
            <div class="dot"></div>
            <p class="logistics-route-bottom">运输中</p>
          </div>
          <div class="row-line left"></div>
          <div class="left logistics-route-block" :class="{active: logisticDetail.status === '已签收'}">
            <p class="logistics-route-top" :style="{left: receiverLeft}">{{logisticDetail.receiver}}</p>
            <div class="dot"></div>
            <p class="logistics-route-bottom">已签收</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./logistics.component.js"></script>
<style src="./logistics.scss"></style>
