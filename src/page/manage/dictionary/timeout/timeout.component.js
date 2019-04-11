import {timeoutService} from './timeout.service';
import pisTitle from '../../../../common/components/pisTitle';
import Vue from 'vue';

export default {
  components: {
    pisTitle
  },
  data() {
    return {
      timeoutForm:{
        small_specimen_timeout: '',
        big_specimen_timeout: '',
        cell_timeout: '',
        frozen_timeout: '',
        block_timeout: '',
        slide_timeout: '',
        small_specimen_timeout_unit: 'days',
        big_specimen_timeout_unit: 'days',
        routine_timeout_unit: 'hours',
        cell_timeout_unit: 'hours',
        frozen_timeout_unit: 'minutes',
        block_timeout_unit: 'hours',
        slide_timeout_unit: 'hours',
      },
    };
  },
  created() {
    this.getTimeout();
  },
  methods:{
    getTimeout() {
      timeoutService.timeoutList({settings_key: Object.keys(this.timeoutForm)}).then((res)=>{
        for (let prop in res.body.data) {
          this.timeoutForm[prop] = res.body.data[prop].split(' ')[0];
          this.timeoutForm[prop+'_unit'] = res.body.data[prop].split(' ')[1];
        }
      })
    },
    saveTimeout() {
      let settings = {
        small_specimen_timeout: this.timeoutForm.small_specimen_timeout+' '+this.timeoutForm.small_specimen_timeout_unit,
        big_specimen_timeout: this.timeoutForm.big_specimen_timeout+' '+this.timeoutForm.big_specimen_timeout_unit,
        /*routine_timeout: this.timeoutForm.routine_timeout+' '+this.timeoutForm.routine_timeout_unit,*/
        cell_timeout: this.timeoutForm.cell_timeout+' '+this.timeoutForm.cell_timeout_unit,
        frozen_timeout: this.timeoutForm.frozen_timeout+' '+this.timeoutForm.frozen_timeout_unit,
        block_timeout: this.timeoutForm.block_timeout+' '+this.timeoutForm.block_timeout_unit,
        slide_timeout: this.timeoutForm.slide_timeout+' '+this.timeoutForm.slide_timeout_unit,
      }
      timeoutService.setTimeout({settings}).then((res) => {
        this.$message.success('配置成功');
      }).catch((err) => {
        this.$message.error('配置失败');
      })
    },
  }
}
