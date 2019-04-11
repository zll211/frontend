import {specialResultService} from './special.service';
import pisTitle from '../../../../common/components/pisTitle';

export default {
  components: {
    pisTitle
  },
  data() {
    return {
      specialList: [],
      loading: false,
    };
  },
  created() {
    this.getSpecialResult();
  },
  methods:{
    deleteSpecial(index) {
      this.specialList.splice(index,1);
    },
    addSpecial() {
      this.specialList.push('');
    },
    getSpecialResult() {
      this.loading = true;
      specialResultService.getSpecialResult({settings_key: ['specialResult']}).then((res)=>{
        this.specialList = res.body.data.specialResult?res.body.data.specialResult:[];
      }).finally(() => {
        this.loading = false;
      })
    },
    setSpecialResult() {
      let settings = {
        specialResult: this.specialList
      };
      specialResultService.setSpecialResult({settings}).then((res) => {
        this.$message.success('配置成功');
      }).catch((err) => {
        this.$message.error('配置失败');
      })
    },
  }
}
