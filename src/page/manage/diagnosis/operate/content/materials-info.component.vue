<template>
  <el-form :model="specimenInfoForm" label-position="left">
    <el-row :gutter="0" class="info-container flex wrap" v-if="specimenInfoForm.hasImg">
      <div class="specimen-img-container"
              v-for="(img, index) in specimenInfoForm.imgs" :key="index">
        <el-form-item label-width="0">
          <img :src="img.image_url" width="140">
        </el-form-item>
      </div>
    </el-row>
  <el-row :gutter="0" style="margin-top: 20px;">
    <el-tabs v-model="activeTakespecimenName" type="border-card">
      <el-tab-pane :label="'标本'+(index+1)" :name="'标本'+(index+1)"
                   class="takespecimen-template"
                   v-for="(template,index) in specimenInfoForm.specimen.data" :key="index">
        <h4>标本名称：{{template.specimen_name}}</h4>

        <el-form-item label="巨检描述" label-width="80px">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}"
                    v-model="template.gigantic_inspection"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <hr style="border:1px dashed #f0f0f0">
        </el-form-item>
        <el-table
          :data="template.paraffinBlock.data"
          style="width: 100%">
          <el-table-column
            prop="serial_number"
            label="蜡块"
            align="center">
          </el-table-column>
          <el-table-column
            prop="sample_name"
            label="取材名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="sample_source"
            label="取材部位"
            align="center">
          </el-table-column>
          <el-table-column
            prop="sample_count"
            label="材块数量"
            align="center">
          </el-table-column>
          <el-table-column
            prop="summary"
            label="补充描述"
            align="center">
          </el-table-column>
        </el-table>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="附言" label-width="40px">
              <el-select v-model="template.postscript"
                         size="small"
                         placeholder="附言" disabled>
                <el-option label="用完" value="用完"></el-option>
                <el-option label="脱钙" value="脱钙"></el-option>
                <el-option label="保留" value="保留"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保存位置" label-width="80px">
              <el-input v-model="template.position" placeholder="保存位置" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-row>
<!--
    <el-row class="info-container" :gutter="0"
            v-for="(specimen, index) in specimenInfoForm.specimen.data"
            :key="index">
      <el-col>
        <el-form-item label-width="0">
          <span class="specimen-name">标本名称：{{specimen.specimen_name}} </span>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="巨检描述" label-width="80px">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}"
                    v-model="specimen.gigantic_inspection"
                    disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label-width="0">
          <hr style="border:1px dashed #f0f0f0">
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-table
          :data="specimen.paraffinBlock.data"
          style="width: 100%">
          <el-table-column
            prop="serial_number"
            label="蜡块"
            align="center">
          </el-table-column>
          <el-table-column
            prop="sample_name"
            label="取材名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="sample_source"
            label="取材部位"
            align="center">
          </el-table-column>
          <el-table-column
            prop="sample_count"
            label="材块数量"
            align="center">
          </el-table-column>
          <el-table-column
            prop="summary"
            label="补充描述"
            align="center">
          </el-table-column>
        </el-table>
      </el-col>
      <el-form-item label-width="0"></el-form-item>
    </el-row>-->
    <el-row class="info-container" :gutter="0">
      <el-col :span="8">
        <el-form-item label="取材医生" label-width="80px">
          <el-input v-model="specimenInfoForm.drawMaterial.draw_materialer"
                    disabled size="small" style="width: 200px"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="记录员" label-width="80px">
          <el-input v-model="specimenInfoForm.drawMaterial.recorder"
                    disabled size="small" style="width: 200px"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="记录时间" label-width="80px">
          <el-input v-model="specimenInfoForm.drawMaterial.draw_material_at"
                    disabled size="small" style="width: 200px"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
    export default {
      data() {
        return {
          activeTakespecimenName: '标本1',
        }
      },
      props: {
        specimenInfoForm: Object,
      },
    }
</script>

<style scoped>

</style>
