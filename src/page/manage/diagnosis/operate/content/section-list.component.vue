<template>
  <div class="diagnosis-section-list">
    <el-table
      v-if="sectionList&&sectionList.length>0"
      :data="sectionList">
      <el-table-column
        prop="pathology_id"
        label="病理号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="section_number"
        label="切片号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        min-width="250"
        align="center">
      </el-table-column>
      <el-table-column
        prop="estimate"
        label="切片质量评价"
        align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.section_estimate" clearable size="small"
                     @change="changeResult(scope.row, $event)">
            <el-option value="优" label="优"></el-option>
            <el-option value="良" label="良"></el-option>
            <el-option value="一般" label="一般"></el-option>
            <el-option value="差" label="差"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="file"
        label="阅片"
        align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="readFile(scope.$index)">阅片</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-content-center" style="width: 100%" v-if="!sectionList||sectionList.length===0">
      <el-button type="text" size="small">暂无绑定切片</el-button>
      <el-button size="small" type="primary" @click="$emit('bind')">前往绑定</el-button>
    </div>
    <el-dialog :fullscreen="true" :visible.sync="showFile" title="阅片">
      <pis-slide-view v-if="showFile" :file-name-list="fileNameList" :file-index.sync="fileIndex"
                      @screen-shot="screenShot"></pis-slide-view>
    </el-dialog>
  </div>
</template>

<script>
  import pisSlideView from '../../../../../common/components/pisSlideView/pisSlideView';
  import {dNormalService} from '../../normal/normal.service';

  export default {
    data() {
      return {
        showFile: false,
        fileIndex: 0,
      };
    },
    props: {
      sectionList: {
        type: Array,
        default: () => [],
      },
    },
    components: {
      pisSlideView,
    },
    computed: {
      fileNameList() {
        return this.sectionList.map((item) => item.path);
      },
    },
    methods: {
      readFile(index) {
        this.fileIndex = index;
        this.showFile = true;
      },
      screenShot(dataUrl) {
        this.$emit('screen-shot', dataUrl);
      },
      changeResult(row) {
        dNormalService.sectionAssess({id: row.id, estimate: row.section_estimate})
          .then((res) => {
            this.$message.success('保存成功');
          }).catch(() => {
          this.$message.success('保存失败');
        });
      },
    },
  };
</script>

<style lang="scss">
  .diagnosis-section-list {
    & > .el-dialog__wrapper {
      & > .el-dialog {
        display: flex;
        flex-direction: column;
        .el-dialog__header {
          padding: 10px 20px;
        }
        .el-dialog__body {
          flex: 1;
          padding: 0;
        }
      }
    }
  }
</style>
