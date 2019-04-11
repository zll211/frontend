import materialsInfo from './content/materials-info.component';
import registerInfo from './content/register-info.component';
import doctorAdvice from './content/doctor-advice.component';
import diagnosisContent from './content/diagnosis-content.component';
import tctContent from './content/tct-content.component';
import consultation from './content/consultation.component';
import remoteConsultation from './content/remote-consultation.component';
import sectionList from './content/section-list.component';
import pisStar from '../../../../common/components/pisStar';
import methods from './operate.component.methods';
import reagentDialog from './reagent/reagent.component';
import sectionDialog from './section/section.component';
import writeAdvice from './advice/write-advice';
import {mapState} from 'vuex';
export default {
  components: {
    materialsInfo,
    registerInfo,
    doctorAdvice,
    diagnosisContent,
    pisStar,
    reagentDialog,
    sectionDialog,
    remoteConsultation,
    writeAdvice,
    tctContent,
    consultation,
    sectionList,
  },
  props: ['id'],
  data() {
    return {
      loading: false,
      isCollect: false,
      templateLoading: false,
      followed: false,
      caseType: '',
      reviewDoctor: '',
      activeName: 'diagnosis',
      writeVisible: false,
      pdfViewVisible: false,
      reviewViewVisible: false,
      consultationDoctorDialog: false,
      selectedDoctorList: [],
      consultationDoctorList: [],
      suggestions: ['1'],
      pdf: '',
      changeTemplateForm: {},
      templateList: [],
      caseInfoForm: {
        ext: {},
        specimen: {},
        drawMaterial: {},
        technicalAdvice: {data: []},
        sectionPath: {data: []},
      },
      writeDiagnosisForm: {},
      specialInspectionAdvice: [],
      columnTecList: [{label: '补取', name: 'supplement'}, {
        label: '重切',
        name: 'reCut',
      }, {label: '深切', name: 'deepCut'}, {
        label: '薄切',
        name: 'thinCut',
      }],
      columnSpecList: [{label: '免疫组化', name: 'immunohistochemical'}, {
        label: '特殊染色',
        name: 'specificStain',
      }, {label: '分子病理', name: 'molecularPathology'}],
      tecProcess: ['补取', '重切', '深切', '薄切'],
      specProcess: ['免疫组化', '特殊染色', '分子病理'],
    };
  },
  watch: {
   async id(){
      await this.registerInfo();
      this.diagnosisInfo();
      this.getTemplateList();
      this.processConfigList();
      this.getDoctorById();
    }
  },
  computed: {
    ...mapState(['userList','area']),
    tabList: function() {
      let tabList = [];
      if ((this.caseType === '常规' || this.caseType === '冰冻')
        && this.caseInfoForm.outside_register_type !== '玻片' && this.caseInfoForm.outside_register_type !== '蜡块') {
        tabList = [{
          id: 1,
          label: '下诊断',
          name: 'diagnosis',
        }, {
          id: 2,
          label: '病例信息',
          name: 'register',
        }, {
          id: 3,
          label: '取材信息',
          name: 'materials',
        }];
      } else if (this.caseType === '细胞' || this.caseInfoForm.outside_register_type === '玻片' || this.caseInfoForm.outside_register_type === '蜡块') {
        tabList = [{
          id: 1,
          label: '下诊断',
          name: 'diagnosis',
        }, {
          id: 2,
          label: '病例信息',
          name: 'register',
        }];
      }
      tabList.push({
        id: 4,
        label: '阅片',
        name: 'film',
      });
      /*if (this.caseInfoForm.paraffinSection.data.length > 0) {
        if (this.caseInfoForm.paraffinSection.data.some((item) => !!item.kfb_path)) {
          tabList = tabList.concat([{
            id: 4,
            label: '阅片',
            name: 'film',
          }]);
        }
      }*/
      if (this.caseInfoForm?.technicalAdvice?.data?.length > 0) {
        tabList = tabList.concat([{
          id: 6,
          label: '技术医嘱',
          name: 'technical',
        }]);
      }
      if (this.specialInspectionAdvice.length > 0) {
        tabList = tabList.concat([{
          id: 7,
          label: '特检医嘱',
          name: 'special',
        }]);
      }
      if (this.caseInfoForm.hz_status !== '未远程会诊') {
        tabList = tabList.concat([{
          id: 8,
          label: '远程会诊',
          name: 'remote',
        }]);
      }
      if (this.caseInfoForm.is_opinion) {
        tabList = tabList.concat([{
          id: 9,
          label: '科内会诊',
          name: 'consultation',
        }]);
      }
      return tabList;
    },
    specimenList: function() {
      if (this.caseInfoForm?.specimen?.data) {
        return this.caseInfoForm.specimen.data.map((item) => ({
          label: item.specimen_name,
          value: item.id,
          paraffinBlock: item.paraffinBlock,
        }));
      } else {
        return [];
      }
    },
    tParaffinList: function() {
      if (this.tSpecimenId) {
        let specimen = this.specimenList.find((item) => item.value === this.tSpecimenId);
        if (specimen) {
          this.tParaffinId = '';
          return specimen.paraffinBlock.data.map((item) => ({
            label: item.sample_name,
            value: item.id,
          }));
        }
      }
      return [];
    },
    sParaffinList: function() {
      if (this.sSpecimenId) {
        let specimen = this.specimenList.find((item) => item.value === this.sSpecimenId);
        if (specimen) {
          this.sParaffinId = '';
          return specimen.paraffinBlock.data.map((item) => ({
            label: item.sample_name,
            value: item.id,
          }));
        }
      }
      this.sParaffinId = '';
      return [];
    },
    sectionList() {
      return this.caseInfoForm.sectionPath.data;
    },
    isReadonly: function() {
      return !!(~['已签发', '已打印', '已发放'].indexOf(this.caseInfoForm.status));
    },
  },
  async created() {
    await this.registerInfo();
    this.diagnosisInfo();
    this.getTemplateList();
    this.processConfigList();
    this.getDoctorById();
  },
  mixins: [methods],
};
