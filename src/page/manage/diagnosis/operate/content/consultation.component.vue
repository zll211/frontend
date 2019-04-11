<template>
    <div class="flex column" style="background-color: #ffffff;border-radius: 5px">
      <ul class="diagnosisList">
        <li v-for="item in consultations">
          <p>会诊医生：{{item.realname}}</p>
          <p>会诊时间：{{item.opinion_time}}</p>
          <p>会诊意见：{{item.opinion ===''?'暂未提交会诊意见':item.opinion}}</p>
        </li>

      </ul>
      <div class="flex justify-content-center column align-items-end consultationContent">
        <el-input v-model="consultationContent" type="textarea" placeholder="请输入会诊意见"></el-input>
        <el-button size="small" style="width: 100px;margin-top: 15px" @click="confirmConsultation">提交会诊意见</el-button>
      </div>

    </div>
</template>

<script>
    export default {
      data() {
        return {
          consultationContent: '',
        }
      },
      props: {
        consultations: Array,
      },
      methods: {
        confirmConsultation() {
          this.$emit('confirmConsultation',this.consultationContent);
        },
      }
    }
</script>

<style scoped lang="scss">
  .diagnosisList {
    padding: 10px 20px;
  }
  .diagnosisList li{
    border: 1px dashed #cccccc;
    border-radius: 5px;
    padding: 5px;
    margin: 10px 0;
    p{
      font-size: 14px;
      line-height: 24px;
    }
  }
  .consultationContent{
    padding: 10px 20px;
  }
</style>
