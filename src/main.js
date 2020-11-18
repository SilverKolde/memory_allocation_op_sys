import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import Button from "@/models/Button";
import InputLine from "@/models/InputLine";


Vue.config.productionTip = false;
Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    algoButtons: [
      new Button("First-Fit"),
      new Button("Last-Fit"),
      new Button("Best-Fit"),
      new Button("Worst-Fit"),
      new Button("Random-Fit"),
    ],
    inputLines: [
      new InputLine("Näidis1", "1,8;35,4;3,6;4,2;1,4;3,3;1,2;5,1;50,1"),
      new InputLine("Näidis2", "1,8;7,4;10,6;25,2;1,4;13,3;6,2;8,1;50,1"),
      new InputLine("Esimene", "4,5;2,7;9,2;4,6;7,1;6,4;8,8;3,6;1,10;9,2"),
      new InputLine("Teine", "1,10;6,6;3,9;2,4;1,6;5,2;1,4;5,2;2,1;2,7"),
      new InputLine("Kolmas", "5,10;6,6;3,9;8,4;3,6;5,12;1,4;15,3;3,4;9,7"),
      new InputLine("Enda oma", "")
    ],
    selectedAlgorithm: null,
    selectedInput: null
  },
  mutations: {
    unSelectAllExceptThis: (state, button) => {
      button.selected = true;
      state.selectedAlgorithm = button;
      for (let i = 0; i < state.algoButtons.length; i++) {
        if (button !== state.algoButtons[i])
          state.algoButtons[i].selected = false;
      }
    },
    unSelectAll: (state) => {
      for (let i = 0; i < state.algoButtons.length; i++) {
        state.algoButtons[i].selected = false;
      }
    },
    selectInput: function (state, payload) {
      state.selectedInput = payload;
    }
  },
  getters: {
    getButtons: (state) => {
      return state.algoButtons
    },
    getInputLines: (state) => state.inputLines,
    getSelectedAlgorithm: (state) => state.selectedAlgorithm,
    getSelectedInput: (state) => state.selectedInput
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
