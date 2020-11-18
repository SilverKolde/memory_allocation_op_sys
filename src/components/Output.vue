<template>
  <div>
    <h3>{{ selectedAlgorithm }}</h3>
    <table>
      <tr v-for="i in 11" :key="i">
        <td v-for="j in 52" :key="j" class="cell">
          <span v-if="i===1 && j===1"><strong>Etapp</strong></span>
          <span v-else-if="i===1 && j===2"><strong>Lisatud<br>protsess</strong></span>
          <span v-else-if="i===1 && j>2">{{ j-3 }}</span>
          <span v-else-if="i>1 && j===1">{{ i-1 }}</span>
          <span v-else-if="i>1 && j===2">{{ fillCMD(i) }}</span>
          <span v-else><p class="memoryCell" :id="setID(j, i)" >{{fillCell(j-3, i-2)}}</p></span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  name: "OutPut",
  computed: {
    selectedAlgorithm() {
      let algo = this.$store.getters.getSelectedAlgorithm;
      return (algo !== null) ? algo.text : ""
    }
  },
  methods: {
    setID(j, i) {
      return (j-3).toString() + "," + (i-2).toString()
    },
    fillCell(x, y) {
      let cmd = this.$store.state.selectedInput
      let algo = this.$store.state.selectedAlgorithm
      // if there's nothing to calculate
      if (cmd === null || algo === null)
        return "-"
      cmd = cmd.split(";")

      // Before writing output to first memory slot, we'll do calculations and put result into outputMatrice
      if (x===0 && y===0) {
        calculateOutput(cmd, algo)
      }

      // Change the background color
      let letterForDisplay = outputMatrice[y][x]

      if (letterForDisplay === " ")
        cantPlaceOnThisLine = y;

      changeOutputBackground(letterForDisplay, x+","+y)
      // now display already calculated output
      return letterForDisplay
    },
    fillCMD(i) {
      let cmd = this.$store.state.selectedInput
      if (cmd !== null) {
        cmd = cmd.split(";")
        let letters = "ABCDEFGHIJ";
        let result = letters[i - 2] + " : " + cmd[i - 2]
        return (cmd[i - 2] !== undefined) ? result : "-"
      }
    }
  }
}

// ================================================================================================================== //
//                                         Algorithm Selection                                                        //
// ================================================================================================================== //

function calculateOutput(cmd, algo) {

  if (algo.text === "First-Fit") {
    firstFitter(cmd)
  } else if (algo.text === "Last-Fit") {
    lastFitter(cmd)
  } else if (algo.text === "Best-Fit") {
    bestFitter(cmd)
  } else if (algo.text === "Worst-Fit") {
    worstFitter(cmd)
  } else if (algo.text === "Random-Fit") {
    randomFitter(cmd)
  }

}

// ================================================================================================================== //
//                                              First-Fit                                                             //
// ================================================================================================================== //

/**
 * This algorithm looks for free slot from the very beginning of memory area for each and every process.
 * If slot is found (enough consecutive free units), process is placed into memory.
 *
 * @param cmd process list with durations and memory slots needed
 */
function firstFitter(cmd) {

  for (let i = 0; i <cmd.length; i++) {
    let process = cmd[i].split(",")
    let memUnits = parseInt(process[0])
    let timeUnits = parseInt(process[1])
    let letters = "ABCDEFGHIJ";

    let firstFreeSlot = findFirstFreeSlot(i, memUnits)

    // Algorithm fills the line with error message, if can't find a slot
    //                             OR process demands too much time
    if (firstFreeSlot.length === 0 || i+timeUnits > 10) {
      outputMatrice[i] = processWontFit();
      continue;
    }

    let from = firstFreeSlot[0]
    let to = firstFreeSlot[1]


    // Modify outputMatrice 2 dimensional area. ( from point (l, k), area size (memUnits x timeUnits) )
    for (let k = from; k < to; k++) {
      for (let l = i; l < i+timeUnits; l++) {
        outputMatrice[l][k] = letters[i]
      }
    }
  }

  // Returns array of free slot indexes [from, to]
  function findFirstFreeSlot(i, memUnits) {
    let counter = 0
    for (let j = 0; j < 50; j++) {
      if (outputMatrice[i][j] === "-") counter++
      else counter = 0
      if (counter === memUnits) {
        return [j-counter+1, j+1]
      }
    }
    return [];
  }
}

// ================================================================================================================== //
//                                              Last-Fit                                                              //
// ================================================================================================================== //

/**
 * This algorithm maps all free slots. Finds last slot that is big enough. Places process into memory.
 *
 * @param cmd process list with durations and memory slots needed
 */
function lastFitter(cmd) {

  for (let i = 0; i <cmd.length; i++) {
    let process = cmd[i].split(",")
    let memUnits = parseInt(process[0])
    let timeUnits = parseInt(process[1])
    let letters = "ABCDEFGHIJ"

    let slots = findFreeSlots(i)
    let lastBigEnoughSlot = findLastBigEnoughSlot(slots, memUnits)

    // Algorithm fills the line with error message, if can't find a slot
    //                                 OR process demands too much time
    if (lastBigEnoughSlot.length === 0 || i+timeUnits > 10) {
      outputMatrice[i] = processWontFit();
      continue;
    }

    // Modify outputMatrice 2 dimensional area. ( from point (k, j), area size (memUnits x timeUnits) )
    for (let j = lastBigEnoughSlot[0]; j < lastBigEnoughSlot[0] + memUnits; j++) {
      for (let k = i; k < i + timeUnits; k++) {
        outputMatrice[k][j] = letters[i]
      }
    }
  }

  function findLastBigEnoughSlot(slots, memUnits) {
    for (let i = slots.length-1; i >= 0; i--)
      if (slots[i][1] - slots[i][0] >= memUnits)
        return slots[i]
    return []
  }
}

// ================================================================================================================== //
//                                              Best-Fit                                                              //
// ================================================================================================================== //

/**
 * This algorithm maps all free slots. Finds the smallest slot where process fits. Places the process into memory.
 *
 * @param cmd process list with durations and memory slots needed
 */
function bestFitter(cmd) {
  for (let i = 0; i < cmd.length; i++) {
    let process = cmd[i].split(",")
    let memUnits = parseInt(process[0])
    let timeUnits = parseInt(process[1])
    let letters = "ABCDEFGHIJ"

    let slots = findFreeSlots(i)

    let bestSlot = findBestSlot(slots, memUnits)

    // Algorithm fills the line with error message, if can't find a slot
    //                        OR process demands too much time
    if (bestSlot.length === 0 || i+timeUnits > 10) {
      outputMatrice[i] = processWontFit();
      continue;
    }

    // Modify outputMatrice 2 dimensional area. ( from point (k, j), area size (memUnits x timeUnits) )
    for (let j = bestSlot[0]; j < bestSlot[0] + memUnits; j++) {
      for (let k = i; k < i + timeUnits; k++) {
        outputMatrice[k][j] = letters[i]
      }
    }

  }

  function findBestSlot(slots, memUnits) {
    let bestslot = []
    for (let i = 0; i < slots.length; i++) {
      // if slot is big enough
      let slotSize = slots[i][1] - slots[i][0]
      if (slotSize >= memUnits)
        // and is smaller than previous (or suitable not found yet)
        if (bestslot.length === 0 || slotSize < bestslot[1] - bestslot[0])
          bestslot = slots[i]
    }
    return bestslot
  }
}

// ================================================================================================================== //
//                                             Worst-Fit                                                              //
// ================================================================================================================== //

/**
 * This algorithm maps all free slots. Finds the biggest. Places the process (if slot exists)
 *
 * @param cmd process list with durations and memory slots needed
 */
function worstFitter(cmd) {

  for (let i = 0; i < cmd.length; i++) {
    let process = cmd[i].split(",")
    let memUnits = parseInt(process[0])
    let timeUnits = parseInt(process[1])
    let letters = "ABCDEFGHIJ"

    let slots = findFreeSlots(i)
    let biggest = biggestSlot(slots)

    // Algorithm fills the line with error message, if can't find a slot
    //                                          OR process demands too much time
    if (suitableSlotNotFound(biggest, memUnits) || i+timeUnits > 10) {
      outputMatrice[i] = processWontFit();
      continue;
    }

    // Modify outputMatrice 2 dimensional area. ( from point (k, j), area size (memUnits x timeUnits) )
    for (let j = biggest[0]; j < biggest[0] + memUnits; j++) {
      for (let k = i; k < i + timeUnits; k++) {
        outputMatrice[k][j] = letters[i]
      }
    }
  }

  function suitableSlotNotFound(biggest, memUnits) {
    return biggest.length === 0 || biggest[1] - biggest[0] < memUnits;
  }

  function biggestSlot(slots) {
    if (slots.length === 0) return slots
    let biggest = slots[0]
    for (let i = 1; i < slots.length; i++) {
      if (slots[i][1] - slots[i][0] > biggest[1] - biggest[0])
        biggest = slots[i]
    }
    return biggest;
  }
}

// ================================================================================================================== //
//                                            Random-Fit                                                              //
// ================================================================================================================== //

/**
 * This algorithm maps all free slots. Selects random slot that is big enough. Places the process (if slot exists)
 *
 * @param cmd process list with durations and memory slots needed
 */
function randomFitter(cmd) {
  for (let i = 0; i < cmd.length; i++) {
    let process = cmd[i].split(",")
    let memUnits = parseInt(process[0])
    let timeUnits = parseInt(process[1])
    let letters = "ABCDEFGHIJ"

    let slots = findFreeSlots(i)
    let randomSlot = findRandomSlotThatIsBigEnough(slots, memUnits)

    // Algorithm fills the line with error message, if can't find a slot
    //                          OR process demands too much time
    if (randomSlot.length === 0 || i+timeUnits > 10) {
      outputMatrice[i] = processWontFit();
      continue;
    }

    // Modify outputMatrice 2 dimensional area. ( from point (k, j), area size (memUnits x timeUnits) )
    for (let j = randomSlot[0]; j < randomSlot[0] + memUnits; j++) {
      for (let k = i; k < i + timeUnits; k++) {
        outputMatrice[k][j] = letters[i]
      }
    }
  }

  // Returns a random slots that's big enough, empty array if slot not found.
  function findRandomSlotThatIsBigEnough(slots, memUnits) {
    let suitables = []
    for (let slot of slots)
      if (slot[1] - slot[0] >= memUnits)
        suitables.push(slot)
    if (suitables.length === 0)
      return []
    let randomIndex = Math.floor(Math.random() * Math.floor(suitables.length))
    return suitables[randomIndex]
  }
}

// ===================================== Helper methods ============================================================= //

let outputMatrice = fillUp()
let cantPlaceOnThisLine = -1;

function fillUp() {
  let arr = []
  for (let i = 0; i < 10; i++) {
    let arr2 = []
    for (let j = 0; j < 50; j++) {
      arr2.push("-")
    }
    arr.push(arr2)
  }
  return arr
}

function findFreeSlots(i) {
  let counter = 0
  let slots = []
  for (let j = 0; j < 50; j++) {
    if (outputMatrice[i][j] === "-")
      counter++
    else {
      if (counter !== 0) {
        // remember each free slot in slots
        let slot = [j-counter, j]
        slots.push(slot)
      }
      counter = 0
    }
    // if we reach end and have counted free units, save the slot
    if (j===49 && counter > 0) {
      let slot = [j-counter+1, j+1]
      slots.push(slot)
    }
  }
  return slots;
}

function changeOutputBackground(letter, id) {
  let letters = "ABCDEFGHIJ"
  let colors = ["#00ff00", "#ff3333", "darkorange", "#0099ff", "yellow", "#b366ff", "#cc9900", "#ff0066", "cyan"]
  let index = letters.indexOf(letter)
  if (cantPlaceOnThisLine < 0 && index >= 0) {
    document.getElementById(id).style.backgroundColor = colors[index]
  } else if (cantPlaceOnThisLine >= 0) {
    document.getElementById(id).style.backgroundColor = "black"
    document.getElementById(id).style.color = "white"

    // if faulty line is marked, continue work as usual
    if (id.substring(0,2) === "49")
      cantPlaceOnThisLine = -1
  }
}

function processWontFit() {
  let arr = []
  let str = "              PROTSESS EI MAHU MÄLLU!             "
  for (let i = 0; i < str.length; i++) {
    arr.push(str[i]);
  }
  return arr
}

</script>

<style scoped>
  .cell {
    min-width: 30px;
    min-height: 30px;
    padding: 0;
    text-align: center;
  }

  .memoryCell {
    background-color: silver;
    width: inherit;
    height: inherit;
  }

  table {
    /*min-height: 330px;*/
    border-collapse: separate;
  }
  td {
    height: inherit;
  }
  span {
    width: inherit;
    height: inherit;
  }
</style>