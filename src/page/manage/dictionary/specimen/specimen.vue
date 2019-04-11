<template>
  <main class="dic-specimen-page main-container">
    <el-tabs v-model="activeTabName" type="card" @tab-click="handleClick">
      <el-tab-pane label="常规标本信息" name="1">
        <el-row type="flex">
          <div class="flex-1" style="margin-right: 42px">
            <pis-title label="标本管理"></pis-title>
            <el-row class="specimen-container">
              <div class="operate-methods">
                <el-button type="primary" size="mini"
                           @click="addContent('system')">新增系统
                </el-button>
                <el-button type="primary" size="mini"
                           @click="addContent('organ')">新增器官
                </el-button>
                <el-button type="primary" size="mini"
                           @click="addContent('specimen')">新增标本
                </el-button>
                <el-button type="danger" size="mini"
                           @click="deleteSpecimenTemplate">删除
                </el-button>
              </div>
              <el-input
                size="small"
                class="filter-text"
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
              <el-row type="flex" style="width: 350px">
                <h3 class="flex-1 text-center">系统</h3>
                <h3 class="flex-1 text-center">器官</h3>
                <h3 class="flex-1 text-center">标本</h3>
              </el-row>
              <el-tree
                v-loading="loading"
                class="filter-tree"
                :data="normalSpecimenTemplateList"
                node-key="id"
                :indent="100"
                show-checkbox
                :check-strictly="true"
                :default-expanded-keys="defaultExpandedKeys"
                :highlight-current="true"
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
                :filter-node-method="filterNode"
                ref="tree">
              </el-tree>
            </el-row>
          </div>
          <div class="flex-1">
            <pis-title label="基本信息"></pis-title>
            <el-row class="specimen-container">
              <el-form
                size="small" v-show="type === 'system'" label-position="top"
                       label-width="80px" :model="systemForm"
                       :rules="systemRules" ref="systemForm">
                <el-form-item label="系统名称" prop="label">
                  <el-input v-model="systemForm.label"
                            placeholder="请输入系统名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="createTemplate('system')">
                    确定
                  </el-button>
                </el-form-item>
              </el-form>
              <el-form
                size="small" v-show="type === 'organ'" label-position="top"
                       label-width="80px" :model="organForm" :rules="organRules"
                       ref="organForm">
                <el-form-item label="器官名称" prop="label">
                  <el-input v-model="organForm.label"
                            placeholder="请输入器官名称"></el-input>
                </el-form-item>
                <el-form-item label="所属系统" prop="parentId">
                  <el-select v-model="organForm.parentId" placeholder="请选择所属系统">
                    <el-option
                      v-for="item in systemList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="巨检信息">
                  <el-row>
                    <el-col>
                      <el-button type="primary" size="mini"
                                 @click="addGiganticInspection()">新增巨检信息
                      </el-button>
                    </el-col>
                    <el-col
                      class="flex align-items-center justify-content-between"
                      style="margin-bottom: 10px; max-width: 600px"
                      v-for="(gigantic, index) in organForm.dictGiganticInspection"
                      :key="index">
                      <span>{{index+1}}</span>
                      <el-input
                        style="padding: 0 10px"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 4}"
                        placeholder="请输入巨检信息"
                        v-model="gigantic.gigantic_inspection_info">
                      </el-input>
                      <el-button type="danger" size="mini"
                                 @click="removeGiganticInspection(index)">删除
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="createTemplate('organ')">
                    确定
                  </el-button>
                </el-form-item>
              </el-form>
              <el-form
                size="small" v-show="type === 'specimen'" label-position="top"
                       label-width="80px" :model="specimenForm"
                       :rules="specimenRules" ref="specimenForm">
                <el-form-item label="标本名称" prop="label">
                  <el-input v-model="specimenForm.label"
                            placeholder="请输入标本名称"></el-input>
                </el-form-item>
                <el-form-item label="所属器官" prop="parentId">
                  <el-cascader
                    :options="organList"
                    v-model="specimenForm.parentId"
                    clearable
                    placeholder="请选择所属器官">
                  </el-cascader>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="createTemplate('specimen')">
                    确定
                  </el-button>
                </el-form-item>
              </el-form>
            </el-row>
          </div>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="细胞标本信息" name="2">
        <el-row type="flex">
          <div class="flex-1" style="margin-right: 42px">
            <pis-title label="标本管理"></pis-title>
            <el-row class="specimen-container">
              <div class="operate-methods">
                <el-button type="primary" size="mini"
                           @click="addContent('cellType')">新增标本类型
                </el-button>
                <el-button type="primary" size="mini"
                           @click="addContent('cell')">新增标本
                </el-button>
                <el-button type="danger" size="mini"
                           @click="deleteCellTemplate">删除
                </el-button>
              </div>
              <el-input
                class="filter-text"
                placeholder="输入关键字进行过滤"
                v-model="filterCellText">
              </el-input>
              <el-row type="flex" style="width: 220px">
                <h3 class="flex-1 text-center">标本类型</h3>
                <h3 class="flex-1 text-center">标本</h3>
              </el-row>
              <el-tree
                v-loading="loading"
                class="filter-tree"
                :data="cellSpecimenTemplateList"
                node-key="id"
                :indent="100"
                show-checkbox
                :check-strictly="true"
                :default-expanded-keys="defaultExpandedKeys"
                :highlight-current="true"
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
                :filter-node-method="filterNode"
                ref="cellTree">
              </el-tree>
            </el-row>
          </div>
          <div class="flex-1">
            <pis-title label="基本信息"></pis-title>
            <el-row class="specimen-container">
              <el-form v-show="type === 'cellType'" label-position="top"
                       label-width="80px" :model="cellTypeForm"
                       :rules="cellTypeRules" ref="cellTypeForm">
                <el-form-item label="标本类型" prop="label">
                  <el-input v-model="cellTypeForm.label"
                            placeholder="请输入细胞标本类型名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary"
                             @click="createCellTemplate('cellType')">确定
                  </el-button>
                </el-form-item>
              </el-form>
              <el-form v-show="type === 'cell'" label-position="top"
                       label-width="80px" :model="cellForm" :rules="cellRules"
                       ref="cellForm">
                <el-form-item label="细胞标本" prop="label">
                  <el-input v-model="cellForm.label"
                            placeholder="请输入细胞标本名称"></el-input>
                </el-form-item>
                <el-form-item label="所属标本类型" prop="parentId">
                  <el-select v-model="cellForm.parentId"
                             placeholder="请选择所属标本类型">
                    <el-option
                      v-for="item in cellTypeList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="createCellTemplate('cell')">
                    确定
                  </el-button>
                </el-form-item>
              </el-form>
            </el-row>
          </div>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="诊断模板信息" name="3">
        <el-row type="flex">
          <div class="flex-1" style="margin-right: 42px">
            <pis-title label="模板管理"></pis-title>
            <el-row class="specimen-container">
              <div class="operate-methods">
                <el-button type="primary" size="mini"
                           @click="addContent('diagnosis')">新增模板
                </el-button>
                <el-button type="danger" size="mini"
                           @click="deleteDiagnosisTemplate">删除模板
                </el-button>
              </div>
              <el-input
                class="filter-text"
                placeholder="输入关键字进行过滤"
                v-model="filterDiagnosisText">
              </el-input>
              <el-tree
                v-loading="loading"
                class="filter-tree"
                :data="diagnosisTemplateList"
                node-key="id"
                :indent="100"
                show-checkbox
                :check-strictly="true"
                :default-expanded-keys="defaultExpandedKeys"
                :highlight-current="true"
                :expand-on-click-node="false"
                @node-click="handleDiagnosisNodeClick"
                :filter-node-method="filterNode"
                ref="diagnosisTree">
              </el-tree>
            </el-row>
          </div>
          <div class="flex-1">
            <pis-title label="基本信息"></pis-title>
            <el-row class="specimen-container">
              <el-form label-position="top" v-show="type === 'diagnosis'"
                       label-width="80px" :model="diagnosisForm"
                       :rules="diagnosisRules" ref="diagnosisForm">
                <el-form-item label="诊断术语名称" prop="label">
                  <el-input v-model="diagnosisForm.label"
                            placeholder="请输入诊断术语名称"></el-input>
                </el-form-item>
                <el-form-item label="模板类型" prop="specimen_type">
                  <el-select v-model="diagnosisForm.specimen_type" filterable
                             clearable placeholder="请选择模板类型"
                             @change="changeSpecimenType">
                    <el-option label="常规" value="routine"></el-option>
                    <el-option label="细胞" value="cell"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属器官" prop="dict_specimen_id" v-show="diagnosisForm.specimen_type === 'routine'">
                  <el-select v-model="diagnosisForm.dict_specimen_id" filterable
                             clearable placeholder="请选择所属器官"
                             @change="changeDiagnosisOrgan">
                    <el-option
                      v-for="item in totalOrganList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                  <el-form-item label="所属标本类型" prop="dict_specimen_id"  v-show="diagnosisForm.specimen_type === 'cell'">
                    <el-select v-model="diagnosisForm.dict_specimen_id" filterable
                               clearable placeholder="请选择所属标本类型"
                               @change="changeDiagnosisOrgan">
                      <el-option
                        v-for="item in cellTypeList"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                <el-form-item label="上级诊断术语" prop="parentId">
                  <el-cascader
                    :options="diagnosisPreviousList"
                    v-model="diagnosisForm.parentId"
                    clearable
                    change-on-select
                    placeholder="请选择上级术语">
                  </el-cascader>
                </el-form-item>
                <el-form-item label="镜下所见内容" prop="mirrorContent">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 4}"
                    placeholder="请输入镜下所见内容"
                    v-model="diagnosisForm.mirrorContent">
                  </el-input>
                </el-form-item>
                <el-form-item label="诊断内容" prop="diagnosisContent">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 4}"
                    placeholder="请输入诊断内容"
                    v-model="diagnosisForm.diagnosisContent">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary"
                             @click="createDiagnosisTemplate('diagnosis')">
                    确定
                  </el-button>
                </el-form-item>
              </el-form>
            </el-row>
          </div>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </main>
</template>

<script src="./specimen.component.js"></script>
<style lang="scss" src="./specimen.scss"></style>
