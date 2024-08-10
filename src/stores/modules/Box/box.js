import CustomizedAxios from "../../../plugins/axios";
const boxModule = {
  state: {
    planningActionHistory_index: -1,
    planningActionHistory: [],
    planningBoxes: [],
    OutToBeInserted:[],
    ThisOutToBeInserted:[],
    planningWithTheBoxes: null,
    storageData: {
      actualShift: null,
      selectedDate: null,
      selectedPlanning: null,
      ShiftIndex: null,
    },
    justCreated: false,
    set_WH: false,
  },
  mutations: {
    SET_PLANNING_BOXES(state, payload) {
      state.planningBoxes = payload;
    },
    SET_PLANNING_BOXES(state, payload) {
      state.planningBoxes = payload;
    },
    SET_PLANNING_WITH_THE_BOXES(state, payload) {
      state.planningWithTheBoxes = payload;
    },
    CLEAR_BOXES(state) {
      state.planningWithTheBoxes.planning_boxes = null;
    },
    CLEAR_PLANNING(state) {
      state.planningWithTheBoxes=null;
      state.storageData = {
        actualShift: null,
        selectedDate: null,
        selectedPlanning: null,
        ShiftIndex: null,
      };
    },
    SET_PLANNING_FROM_THE_FRONTEND(state, payload) {
      state.planningWithTheBoxes = {
        planning: payload,
        planning_boxes: null,
      };
    },
    SET_PLANNING_AND_BOXES(state, payload) {
      console.log("this planning with boxes", payload.planning_boxes);
      let headerArray = payload.planning.planning_header.split(".");
      headerArray=headerArray.map((e)=>{
        return {
          title: e,
        }
      });
      headerArray.unshift("Drivers | Time");
      payload.planning_boxes.unshift(headerArray);
      state.planningWithTheBoxes = {
        planning: payload.planning,
        planning_boxes: payload.planning_boxes,
      };
      state.storageData.actualShift = payload.planning.shift;
      state.storageData.selectedDate = new Date(
        payload.planning.planned_at
      );
      state.storageData.selectedPlanning = payload.planning ;
      console.log("payload",payload)
      state.storageData.ShiftIndex = payload.planning.shift_periode_index;

      let ThisOutToBeInserted = [];
      payload.planning_boxes[0].slice(1).map((e) => {
        ThisOutToBeInserted.push({
                  list: [],
                  checked: false,
                });
        });
        state.OutToBeInserted=ThisOutToBeInserted;
    },
    SET_ALL_FROM_EDIT(state, payload) {
      state.planningWithTheBoxes={...payload.planningWithTheBoxes};
      state.OutToBeInserted=payload.OutToBeInserted;
    },
    SET_BOXES_FROM_THE_FRONTEND(state, payload) {
      state.planningWithTheBoxes.planning_boxes = payload;
    },
    SET_STORAGE_DATA(state, payload) {
      state.storageData = payload;
    },
    CLEAR_STORAGE_DATA(state, payload) {
      state.storageData = null;
    },
    SET_JUSTE_CREATED(state, payload) {
      state.justCreated = payload;
    },
    SET_OUT_TO_BE_INSERTED(state, payload) {
      state.OutToBeInserted = payload;
    },
    SET_THIS_OUT_TO_BE_INSERTED(state, payload) {
      state.ThisOutToBeInserted = payload;
    },
    SET_ACTIONS_History(state, payload) {
      state.planningActionHistory = payload.planningActionHistory;
      state.planningActionHistory_index = payload.planningActionHistory_index;
    },
    SET_PLANNING_NEW(state, payload) {
      state.storageData.selectedPlanning = payload;
    },
    UN_SET_WH(state, payload) {
      state.storageData.selectedPlanning.wh_set=0;
      state.planningWithTheBoxes.planning.wh_set=0;
    },
    SET_WH(state) {
      state.storageData.selectedPlanning.wh_set=1;
      state.planningWithTheBoxes.planning.wh_set=1;
    },
    DELETE_PLANNING(state) {
      state.planningActionHistory_index= -1;
      state.planningActionHistory= [];
      state.planningBoxes= [];
      state.OutToBeInserted=[];
      state.ThisOutToBeInserted=[];
      state.planningWithTheBoxes= null;
      state.storageData= {
        actualShift: null,
        selectedDate: null,
        selectedPlanning: null,
        ShiftIndex: null,
      };
      state.justCreated= false;
      state.set_WH= false;
    },

  },
  actions: {
    deletePlanningAction({ commit, state }, planning) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("plannings/delete", planning)
          .then((response) => {
            commit("DELETE_PLANNING", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    SetPlanningNewAction({ commit, state }, data) {
      commit("SET_PLANNING_NEW", response.data.payload);
    },
    SetPlanningByIdAndBoxesAction({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("boxes/getPlanningByIdAndBoxes", data)
          .then((response) => {
            commit("SET_PLANNING_AND_BOXES", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    CreatePlanningWitchTheBoxes({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("boxes/addPlanningAndBoxes", data)
          .then((response) => {
            commit("SET_PLANNING_AND_BOXES", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    UpdatePlanningAndBoxes({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("boxes/updatePlanningAndBoxes", data)
          .then((response) => {
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    set_WH_Action({ commit, state }, data) {
      console.log("data",data)
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("boxes/setWHAction", data)
          .then((response) => {
            commit("SET_WH");
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    un_set_WH_Action({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("boxes/UnSetWHAction", data)
          .then((response) => {
            commit("UN_SET_WH");
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    //--------------------------------------------------------------
    addPlanningBoxesAction({ commit, state }, planningBoxes) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("boxes/addPlanningBoxes", planningBoxes)
          .then((response) => {
            commit("SET_PLANNING_BOXES", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setBoxAction({ commit, state }, box) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("boxes/add", box)
          .then((response) => {
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setPlanningBoxes({ commit, state }, planning) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("boxes/getByPlanning", planning)
          .then((response) => {
            commit("SET_PLANNING_BOXES", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setBoxUpdateAction({ commit, state }, box) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("boxes/update", box)
          .then((response) => {
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    clearBoxes({ commit, state }) {
      commit("CLEAR_BOXES");
    },
    clearPlanning_new({ commit, state }) {
      commit("CLEAR_PLANNING");
    },
    setPlanningFromTheFrontend({ commit, state }, planning) {
      commit("SET_PLANNING_FROM_THE_FRONTEND", planning);
    },
    setBoxesFromTheFrontend({ commit, state }, plannig_boxes) {
      commit("SET_BOXES_FROM_THE_FRONTEND", plannig_boxes);
    },
    setStorageData({ commit, state }, storage_data) {
      commit("SET_STORAGE_DATA", storage_data);
    },
    clearStorageData({ commit, state }, storage_data) {
      commit("CLEAR_STORAGE_DATA", storage_data);
    },
    setJustCreated({ commit, state }, created) {
      commit("SET_JUSTE_CREATED", created);
    },
    setOutToBeInserted({ commit, state }, data) {
      commit("SET_OUT_TO_BE_INSERTED", data);
    },
    setThisOutToBeInserted({ commit, state }, data) {
      commit("SET_THIS_OUT_TO_BE_INSERTED", data);
    },
    setAllFromEdit({ commit, state }, data) {
      commit("SET_ALL_FROM_EDIT", data);
    },
    setActionHistory({ commit, state }, data) {
      commit("SET_ACTIONS_History", data);
    },
  },
  getters: {
    getPlanningBoxes(state) {
      return state.planningBoxes;
    },
    getPlanningWithTheBoxes(state) {
      return state.planningWithTheBoxes;
    },
    getStorageData(state) {
      return state.storageData;
    },
    getJustCreated(state) {
      return state.justCreated;
    },
    getOutToBeInserted(state) {
      return state.OutToBeInserted;
    },
    getThisOutToBeInserted(state) {
      return state.ThisOutToBeInserted;
    },
    getActonHistory(state) {
      return state.planningActionHistory;
    },
    getActonHistory_index(state) {
      return state.planningActionHistory_index;
    },
  },
};
export default boxModule;
