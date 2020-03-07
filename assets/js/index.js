import "../scss/index.scss"
import { createPopper } from "@popperjs/core"

document.addEventListener("DOMContentLoaded", init)

function generateGetBoundingClientRect(x = 0, y = 0) {
  return () => ({
    width: 0,
    height: 0,
    top: y,
    right: x,
    bottom: y,
    left: x
  })
}

function init() {
  const text_tooltip = document.querySelector("#text_tooltip")
  const box_tooltip = document.querySelector("#box_tooltip")
  let selectedBoxes = []
  const groups = []
  const virtualElement = e => {
    return {
      getBoundingClientRect: generateGetBoundingClientRect(e.clientX, e.clientY)
    }
  }
  document.getElementById("text").addEventListener(
    "contextmenu",
    e => {
      e.preventDefault()
      text_tooltip.style.visibility = "visible"
      createPopper(virtualElement(e), text_tooltip, {
        placement: "right-start"
      })
      return false
    },
    false
  )

  document.getElementById("boxes").addEventListener(
    "contextmenu",
    e => {
      box_tooltip.style.visibility = "visible"
      e.preventDefault()
      createPopper(virtualElement(e), box_tooltip, {
        placement: "right-start"
      })
      return false
    },
    false
  )

  const boxes = document.getElementById("boxes")
  const createBox = document.querySelectorAll(".create_box")
  const createGroup = document.querySelectorAll(".create_group")

  createBox.forEach(button => {
    button.addEventListener("click", e => {
      e.stopImmediatePropagation()
      const selection = window.getSelection()
      if (selection != "") {
        const newBox = document.createElement("DIV")
        newBox.classList.add("box")
        newBox.innerHTML = selection
        boxes.appendChild(newBox)
      }
      box_tooltip.style.visibility = "hidden"
      text_tooltip.style.visibility = "hidden"
    })
  })

  function deselectBoxes() {
    document.querySelectorAll(".box.selected").forEach(box => {
      box.classList.remove("selected")
    })
    selectedBoxes = []
  }

  boxes.addEventListener("click", e => {
    e.stopPropagation()
    const target = e.target
    if (target.classList.contains("selected")) {
      target.classList.remove("selected")
      selectedBoxes.splice(selectedBoxes.indexOf(target), 1)
    } else {
      target.classList.add("selected")
      selectedBoxes.push(target)
    }
    const groupList = document.querySelector("#group_list")
    groupList.innerHTML = extractGroupNames(groups)
    box_tooltip.style.visibility = "hidden"
    text_tooltip.style.visibility = "hidden"
  })

  createGroup.forEach(button => {
    button.addEventListener("click", e => {
      groups.push({
        name: "gruppo " + groups.length,
        items: [...selectedBoxes]
      })
      selectedBoxes.forEach(box => {
        addGroupListToBox(box, extractGroupNamesForBox(box, groups))
      })
      deselectBoxes()
      console.table(groups)
      box_tooltip.style.visibility = "hidden"
      text_tooltip.style.visibility = "hidden"
    })
  })
}

function extractGroupNames(groups) {
  return groups.map(group => {
    return group.name
  })
}
function extractGroupNamesForBox(box, groups) {
  return groups
    .filter(group => {
      return group.items.includes(box)
    })
    .map(group => {
      return group.name
    })
}
function addGroupListToBox(box, groupNames) {
  let groupList = box.querySelector(".groupList")
  if (!groupList) {
    groupList = document.createElement("DIV")
    groupList.classList.add("groupList")
  }
  groupList.innerHTML = groupNames.join(", ")
  box.appendChild(groupList)
}
