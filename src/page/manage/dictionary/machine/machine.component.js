import {machineService} from './machine.service';
import pisTitle from '../../../../common/components/pisTitle';
import {mapState} from 'vuex';

const normalMachine = ['dehydrationMachine', 'entrapmentMachine', 'sectionMachine', 'dyeingMachine', 'sealMachine'];
const cellMachine = ['sectionMachine', 'dyeingMachine', 'sealMachine'];

export default {
  components: {
    pisTitle
  },
  data() {
    return {
      loading: false,
      machineForm: {
        normal_dehydrationMachine: '',
        normal_entrapmentMachine: '',
        normal_sectionMachine: '',
        normal_dyeingMachine: '',
        normal_sealMachine: '',
        cell_sectionMachine: '',
        cell_dyeingMachine: '',
        cell_sealMachine: '',
      },
      dehydrationMachineList: [],
      entrapmentMachineList: [],
      sectionMachineList: [],
      dyeingMachineList: [],
      sealMachineList: [],
      self: false,
      selectDoctor: '默认',
    };
  },
  created() {
    console.log(this.user)
    this.getAssets();
    this.getMachine();
  },
  computed: mapState(['userList', 'user']),
  methods: {
    getMachine(userid) {
      this.loading = true;
      if (userid) {
        machineService.machineList({user_id: userid}).then((res) => {
          let privateArr = res.body.data.private;
          Object.keys(this.machineForm).forEach((item) => {
            let mac = privateArr.find((mac) => mac.machine_type === item);
            if (mac) {
              if (mac.organization_asset_id) {
                this.machineForm[item] = mac.organization_asset_id;
              }
            }
          })
        }).finally(() => {
          this.loading = false;
        })
      } else {
        machineService.machineList({user_id: userid}).then((res) => {
          let publicArr = res.body.data.public;
          Object.keys(this.machineForm).forEach((item) => {
            let mac = publicArr.find((mac) => mac.machine_type === item);
            if (mac) {
              if (mac.organization_asset_id) {
                this.machineForm[item] = mac.organization_asset_id;
              }
            }
          })
        }).finally(() => {
          this.loading = false;
        })
      }
    },
    saveMachine() {
      let machine = [];
      normalMachine.forEach((item) => {
        let normalMachineOption = this[`${item}List`].find((mac) => mac.value === this.machineForm[`normal_${item}`]);
        machine.push({
          machine_type: `normal_${item}`,
          organization_asset_id: this.machineForm[`normal_${item}`],
          machine_name: normalMachineOption ? normalMachineOption.label : ''
        });
      })
      cellMachine.forEach((item) => {
        let cellMachineOption = this[`${item}List`].find((mac) => mac.value === this.machineForm[`cell_${item}`]);
        machine.push({
          machine_type: `cell_${item}`,
          organization_asset_id: this.machineForm[`cell_${item}`],
          machine_name: cellMachineOption ? cellMachineOption.label : ''
        });
      })
      let params = {
        self: this.self,
        user_id: this.selectDoctor === '默认'?'':this.selectDoctor,
        machine: machine,
      }
      machineService.setMachine(params).then((res) => {
        this.$message.success('配置成功');
      }).catch((err) => {
        this.$message.error('配置失败');
      })
    },

    getAssets() {
      let assetsType = [{
        name: '脱水机器',
        tag: 'dehydration',
      }, {
        name: '包埋机器',
        tag: 'entrapment',
      }, {
        name: '切片机器',
        tag: 'section',
      }, {
        name: '染色机器',
        tag: 'dyeing',
      }, {
        name: '封片机器',
        tag: 'seal',
      },];
      assetsType.forEach((item) => {
        machineService.getAssets({assets_type: item.name, assets_status: '在用'}).then((res) => {
          this[`${item.tag}MachineList`] = res.body.data.map((item) => {
            return {
              label: item.assets_name,
              value: item.id,
            }
          })
        })
      })
    },
    selectDoctorChange(val) {
      if(val === '默认'){
        this.getMachine();
      }else{
        this.getMachine(val);
      }
    }
  }
}
