<template>
  <el-table
    :data="adviceData">
    <el-table-column
      prop="pathology_id"
      label="病理号"
      align="center">
    </el-table-column>
    <el-table-column
      prop="specimen_type"
      label="标本类型"
      align="center" v-if="caseType==='细胞'">
    </el-table-column>
    <el-table-column
      prop="specimen_name"
      label="标本名称"
      align="center">
    </el-table-column>
    <el-table-column
      prop="paraffin_block_id"
      label="蜡块号"
      align="center" v-if="caseType!=='细胞'">
    </el-table-column>
    <el-table-column
      prop="status"
      label="当前所处状态"
      align="center" v-if="type!=='technical'">
    </el-table-column>
    <el-table-column
      prop="special_type"
      label="医嘱类型"
      align="center" v-if="type!=='technical'">
    </el-table-column>
    <el-table-column
      prop="advice"
      label="医嘱内容"
      align="center">
    </el-table-column>
    <el-table-column
      prop="excute_at"
      label="执行时间"
      align="center" v-if="type==='technical'">
    </el-table-column>
    <el-table-column
      prop="excute_status"
      label="执行状态"
      align="center" v-if="type==='technical'">
    </el-table-column>

    <el-table-column
      prop="dye_result"
      label="染色质量"
      align="center" v-if="type!=='technical'">
      <template slot-scope="scope">
        <el-select v-model="scope.row.dyeing_estimate" @change="dyeResult(scope.row, $event)" clearable size="small">
          <el-option value="优" label="优"></el-option>
          <el-option value="良好" label="良好"></el-option>
          <el-option value="一般" label="一般"></el-option>
          <el-option value="差" label="差"></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column
      prop="result"
      label="结果"
      align="center" v-if="type!=='technical'">
      <template slot-scope="scope">
        <el-select v-model="scope.row.result" clearable size="small" @change="changeResult(scope.row, $event)">
          <el-option v-for="(item, index) in specialResultList" :key="index" :value="item" :label="item"></el-option>
        </el-select>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {specialService} from '../../../special/special.service';
  import {specialResultService} from "../../../dictionary/specialresult/special.service";
  export default {
    props: {
      adviceData: Array,
      type: '',
      caseType: '',
    },
    data() {
      return {
        specialResultList: []
      }
    },
    created() {
      this.getSpecialResult();
    },
    methods: {
      getSpecialResult() {
        specialResultService.getSpecialResult({settings_key: ['specialResult']}).then((res) => {
          this.specialResultList = res.body.data.specialResult ? res.body.data.specialResult : [];
        })
      },
      changeResult(row, result) {
        let type = 'routine';
        if (this.caseType === '常规') {
          type = 'routine';
        }
        if (this.caseType === '细胞') {
          type = 'cell';
        }
        specialService.changeSocialResult(type, {
          id: [row.id],
          result: result,
        }).then((res) => {
          this.$message.success('保存成功');
        }).catch(() => {
          this.$message.success('保存失败');
        });
      },
      dyeResult(row, result) {
        let params = {
          id: row.id,
          case_type: this.caseType,
          estimate: result,
        }
        specialService.specialDyeingResult(params).then((res) => {
          this.$message.success('保存成功');
        }).catch(() => {
          this.$message.success('保存失败');
        });
      },
    },
  };
</script>

<style scoped>

</style>
