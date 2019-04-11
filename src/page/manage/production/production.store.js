export const productionModule = {
  state: {
    spinMachineList: [],
    embedMachineList: [],
    sectionMachineList: [],
    dyeMachineList: [],
    mountingMachineList: [],
  },
  mutations: {
    setSpinMachineList (state, list) {
      state.spinMachineList = list;
    },
    setEmbedMachineList (state, list) {
      state.embedMachineList = list;
    },
    setSectionMachineList (state, list) {
      state.sectionMachineList = list;
    },
    setDyeMachineList (state, list) {
      state.dyeMachineList = list;
    },
    setMountingMachineList (state, list) {
      state.mountingMachineList = list;
    },
  },

  getters: {

  }
};
