<template>
  <div class="home-page main-container">
    <div class="top-selection">
      <el-row :gutter="0" class="flex align-items-center" v-loading="loading">
        <el-col :span="!this.hasPermission && !this.collectShow?24:this.screenWidth>1200?5:!this.collectShow?24:12">
          <div class="doctor-info flex column align-items-center" :style="(!this.hasPermission && !this.collectShow)||(this.screenWidth<1200 && !this.collectShow)?'border-right:none':''">
            <img src="../../../assets/img/default-avator.png" height="60" width="60" />
            <p class="doctor-name">{{this.userInfo.realname}}，欢迎您</p>
            <p class="doctor-organization">{{this.userInfo.organization_name}}</p>
            <p class="doctor-role">{{this.userInfo.role}}</p>
            <p class="login-time">上次登陆时间：{{loginTime}}</p>
          </div>
        </el-col>
        <!--管理员 展示内容-->
        <el-col :span="15" v-if="this.screenWidth>1200 && this.isManager && this.hasPermission">
          <el-row class="todo-list" type="flex" justify="space-between">
            <el-dropdown placement="top">
              <div class="todo-item flex column align-items-center" @click="to('/specimen/normal')">
                <img src="../../../assets/img/specimen-icon.png" height="66" width="66"/>
                <p class="todo-list-text">取材</p>
                <p class="todo-list-number">{{specimenNumber}}</p>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="to('/specimen/normal')">常规取材</el-dropdown-item>
                <el-dropdown-item @click.native="to('/specimen/frozen')">冰冻取材</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown placement="top">
              <div class="todo-item flex column align-items-center" @click="to('/production/normal')">
                <img src="../../../assets/img/production-icon.png" height="66" width="66"/>
                <p class="todo-list-text">制片</p>
                <p class="todo-list-number">{{productionNumber}}</p>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="to('/production/normal')">常规制片</el-dropdown-item>
                <el-dropdown-item @click.native="to('/production/frozen')">冰冻制片</el-dropdown-item>
                <el-dropdown-item @click.native="to('/production/cell')">细胞制片</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown placement="top">
              <div class="todo-item flex column align-items-center" @click="to('/diagnosis/normal')">
                <img src="../../../assets/img/diagnosis-icon.png" height="66" width="66"/>
                <p class="todo-list-text">诊断</p>
                <p class="todo-list-number">{{diagnosisNumber}}</p>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="to('/diagnosis/normal')">常规诊断</el-dropdown-item>
                <el-dropdown-item @click.native="to('/diagnosis/frozen')">术中冰冻</el-dropdown-item>
                <el-dropdown-item @click.native="to('/diagnosis/cell')">细胞诊断</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="todo-item flex column align-items-center" @click="to('/desk/report')">
              <img src="../../../assets/img/report-icon.png" height="66" width="66"/>
              <p class="todo-list-text">报告</p>
              <p class="todo-list-number">{{reportNumber}}</p>
            </div>
            <el-dropdown placement="top">
              <div class="todo-item flex column align-items-center">
                <img src="../../../assets/img/special-icon.png" height="66" width="66"/>
                <p class="todo-list-text">特检医嘱</p>
                <p class="todo-list-number">{{special_inspection_advice_count}}</p>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="to('/immunohistochemical/normal')">免疫组化</el-dropdown-item>
                <el-dropdown-item @click.native="to('/dye/normal')">特殊染色</el-dropdown-item>
                <el-dropdown-item @click.native="to('/molecular/normal')">分子病理</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-row>
        </el-col>
        <!--非管理员 动态展示内容-->
        <el-col :span="15" v-if="this.screenWidth>1200 && !this.isManager && this.hasPermission">
          <el-row class="todo-list justify-content-center" type="flex">
            <div class="todo-item flex column align-items-center" style="margin: 0 20px" v-for="(item,index) in displayList" :key="index" @click="to(`${item.path}`)">
              <img :src="item.imgSrc" height="66" width="66">
              <p class="todo-list-text">{{item.name}}</p>
              <p class="todo-list-number">{{item.number}}</p>
            </div>
          </el-row>
        </el-col>
        <el-col :span="this.screenWidth>1200?5:12" v-if="this.collectShow">
          <div class="collect flex column align-items-center" @click="to('/desk/collect')">
            <img src="../../../assets/img/collect-icon.png" height="45" width="57"/>
            <p class="collect-text">病例收藏</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--屏幕分辨率小于1200 待处理事项单独显示-->
    <!--管理员-->
    <div v-if="this.screenWidth<1200 && this.isManager">
      <pis-title label="待处理事项" style="margin: 30px 0 15px 0;"></pis-title>
      <div class="top-selection" v-loading="loading">
        <el-row class="todo-list" type="flex" justify="space-between">
          <el-dropdown placement="top">
            <div class="todo-item flex column align-items-center" @click="to('/specimen/normal')">
              <img src="../../../assets/img/specimen-icon.png" height="66" width="66"/>
              <p class="todo-list-text">取材</p>
              <p class="todo-list-number">{{specimenNumber}}</p>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="to('/specimen/normal')">常规取材</el-dropdown-item>
              <el-dropdown-item @click.native="to('/specimen/frozen')">冰冻取材</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown placement="top">
            <div class="todo-item flex column align-items-center" @click="to('/production/normal')">
              <img src="../../../assets/img/production-icon.png" height="66" width="66"/>
              <p class="todo-list-text">制片</p>
              <p class="todo-list-number">{{productionNumber}}</p>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="to('/production/normal')">常规制片</el-dropdown-item>
              <el-dropdown-item @click.native="to('/production/frozen')">冰冻制片</el-dropdown-item>
              <el-dropdown-item @click.native="to('/production/cell')">细胞制片</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown placement="top">
            <div class="todo-item flex column align-items-center" @click="to('/diagnosis/normal')">
              <img src="../../../assets/img/diagnosis-icon.png" height="66" width="66"/>
              <p class="todo-list-text">诊断</p>
              <p class="todo-list-number">{{diagnosisNumber}}</p>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="to('/diagnosis/normal')">常规诊断</el-dropdown-item>
              <el-dropdown-item @click.native="to('/diagnosis/frozen')">术中冰冻</el-dropdown-item>
              <el-dropdown-item @click.native="to('/diagnosis/cell')">细胞诊断</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="todo-item flex column align-items-center" @click="to('/desk/report')">
            <img src="../../../assets/img/report-icon.png" height="66" width="66"/>
            <p class="todo-list-text">报告</p>
            <p class="todo-list-number">{{reportNumber}}</p>
          </div>
          <el-dropdown placement="top">
            <div class="todo-item flex column align-items-center">
              <img src="../../../assets/img/special-icon.png" height="66" width="66"/>
              <p class="todo-list-text">特检医嘱</p>
              <p class="todo-list-number">{{special_inspection_advice_count}}</p>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="to('/immunohistochemical/normal')">免疫组化</el-dropdown-item>
              <el-dropdown-item @click.native="to('/dye/normal')">特殊染色</el-dropdown-item>
              <el-dropdown-item @click.native="to('/molecular/normal')">分子病理</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-row>
      </div>
    </div>
    <!--非管理员-->
    <div v-if="this.screenWidth<1200 && !this.isManager">
      <pis-title label="待处理事项" style="margin: 30px 0 15px 0;"></pis-title>
      <div class="top-selection" v-loading="loading">
        <el-row class="todo-list justify-content-center" type="flex">
          <div class="todo-item flex column align-items-center" style="margin: 0 20px" v-for="(item,index) in displayList" :key="index" @click="to(`${item.path}`)">
            <img :src="item.imgSrc" height="66" width="66">
            <p class="todo-list-text">{{item.name}}</p>
            <p class="todo-list-number">{{item.number}}</p>
          </div>
        </el-row>
      </div>
    </div>
    <div v-if="this.timeoutShow">
      <pis-title label="超时状态" style="margin: 30px 0 15px 0;"></pis-title>
      <div  class="timeout-list justify-content-between flex wrap" v-loading="loading">
        <div class="timeout-item flex align-items-center justify-content-between" @click="to('/desk/timeout?small_specimen_timeout')">
          <img src="../../../assets/img/normal-icon.png" height="59" width="59" class="flex timeout-item-content" />
          <div class="flex column timeout-item-content" @click="to('/desk/timeout')">
            <p class="routine-timeout-number flex justify-content-end">{{routine_timeout_count}}</p>
            <p class="timeout-type">常规病理</p>
          </div>
        </div>
        <div class="timeout-item flex align-items-center justify-content-between" @click="to('/desk/timeout?frozen_timeout')">
          <img src="../../../assets/img/frozen-icon.png" height="59" width="52" class="flex timeout-item-content" />
          <div class="flex column timeout-item-content">
            <p class="frozen-timeout-number flex justify-content-end">{{frozen_timeout_count}}</p>
            <p class="timeout-type">冰冻病理</p>
          </div>
        </div>
        <div class="timeout-item flex align-items-center justify-content-between" @click="to('/desk/timeout?cell_timeout')">
          <img src="../../../assets/img/cell-icon.png" height="58" width="58" class="flex timeout-item-content" />
          <div class="flex column timeout-item-content">
            <p class="cell-timeout-number flex justify-content-end">{{cell_timeout_count}}</p>
            <p class="timeout-type">细胞病理</p>
          </div>
        </div>
        <div class="timeout-item flex align-items-center justify-content-between" @click="to('/desk/timeout?slide_timeout')">
          <img src="../../../assets/img/otherHospital-icon.png" height="55" width="55" class="flex timeout-item-content" />
          <div class="flex column timeout-item-content">
            <p class="other-timeout-number flex justify-content-end">{{other_hospital_count}}</p>
            <p class="timeout-type">外院</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-content-between align-items-center">
      <pis-title label="工作量统计" style="margin: 30px 0 15px 0"></pis-title>
      <el-date-picker
        v-model="workDate"
        @change="workDateChange"
        type="month"
        placeholder="请选择统计月份"
        size="mini"
        style="width: 173px">
      </el-date-picker>
    </div>
    <div class="chart-main" v-loading="loading">
      <div class="myChart1" style="width: 100%;height: 300px"></div>
    </div>
  </div>
</template>

<script src="./home.component.js"></script>
<style src="./home.scss"></style>
