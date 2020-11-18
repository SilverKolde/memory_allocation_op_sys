<template>
  <div class="input-container">
    <div>
      <h3>Vali või sisesta kümneelemendiline järjend kujul 1,8;35,4;3,6;4,2;1,4;3,3;1,2;5,1;50,1</h3>
      <table>
        <tr v-for="(inputLine, index) in inputLines" :key="index">
          <td>
            <label class="container">{{ inputLine.label }}
              <input type="radio" @click="selectInput(inputLine)" name="radio">
              <span class="checkmark"></span>
            </label>
          </td>
          <td v-if="(inputLine.processes.length !== 0)">{{ inputLine.processes }}</td>
          <td v-else><input name="myProc" type="text"/></td>
        </tr>
      </table>
      <h3>Vali algoritm</h3>
    </div>
    <div class="buttons">
      <div class="buttons" v-for="(button, index) in algoButtons" :key="index">
        <button @click="selectAlgorithm(button)">
          {{button.text}}
        </button>
      </div>
    </div>
    <div class="buttons">
      <button @click="clear">Puhasta väljund</button>
    </div>
  </div>
</template>

<script>


export default {
  name: "Input",
  computed: {
    algoButtons: function () {
      return this.$store.getters.getButtons
    },
    inputLines: function () {
      return this.$store.getters.getInputLines
    }
  },
  methods: {
    selectAlgorithm: function (button) {
      this.$store.commit("unSelectAllExceptThis", button);
    },
    selectInput: function (inputLine) {
      if (this.$store.getters.getSelectedInput !== null)
        this.clear();
      let procs;
      if (inputLine.label === "Enda oma") {
        procs = document.querySelector("input[name=myProc]").value
      }
      else procs = inputLine.processes
      this.$store.commit("selectInput", procs)
    },
    clear() {
      this.$store.state.selectedAlgorithm = null
      this.$store.state.selectedInput = null
      this.$store.commit("unSelectAll");
    }
  }
}




</script>

<style scoped>
  /* The container */
  .container {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default radio button */
  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  /* Create a custom radio button */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
    border-radius: 50%;
  }

  /* On mouse-over, add a grey background color */
  .container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the radio button is checked, add a blue background */
  .container input:checked ~ .checkmark {
    background-color: #2196F3;
  }

  /* Create the indicator (the dot/circle - hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the indicator (dot/circle) when checked */
  .container input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the indicator (dot/circle) */
  .container .checkmark:after {
    top: 9px;
    left: 9px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  }

  .buttons {
    display: flex;
    justify-content: flex-start;
  }

  button {
    margin: 0 10px 5px 0;
  }

  .input-container {
    border-radius: 10px;
    background-color: silver;
    padding: 10px 10px 20px 20px;
  }

  td {
    padding-right: 30px;
  }

  .selected {
    background-color: #2196F3;
  }

  .unselected {
    background-color: inherit;
  }

</style>