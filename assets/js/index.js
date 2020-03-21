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

  let selectedBoxes = []
  const groups = []
  let currentSelectedElement = null
  const virtualElement = e => {
    return {
      getBoundingClientRect: generateGetBoundingClientRect(e.clientX, e.clientY)
    }
  }
  document.getElementById("text").addEventListener(
    "contextmenu",
    e => {
      e.preventDefault()
      currentSelectedElement = e.target
      text_tooltip.style.visibility = "visible"
      createPopper(virtualElement(e), text_tooltip, {
        placement: "right-start"
      })
      return false
    },
    false
  )

  const createBox = document.querySelectorAll(".create_box")
  const createGroup = document.querySelectorAll(".create_group")

  const textContainer = document.querySelector("#text")

  createBox.forEach(button => {
    button.addEventListener("click", e => {
      const text = currentSelectedElement.innerHTML
      e.stopImmediatePropagation()
      const selection = String(window.getSelection())
      if (selection != "") {
        const primaedopo = text.split(selection)
        currentSelectedElement.innerHTML = ""
        const parent = currentSelectedElement.parentElement
        const boxes = [primaedopo[0], selection, primaedopo[1]].map(box)
        console.log(boxes)
        if (currentSelectedElement.id != "text") {
          currentSelectedElement.remove()
          insertBoxes(parent, boxes)
        } else {
          insertBoxes(currentSelectedElement, boxes, "afterbegin")
        }
      }
      text_tooltip.style.visibility = "hidden"
    })
  })

  function box(text) {
    const newBox = document.createElement("DIV")
    newBox.classList.add("box")
    newBox.innerHTML = text
    return newBox
  }

  function insertBoxes(element, boxes, position) {
    boxes.forEach(box => {
      insertBox(element, box, position)
    })
  }

  function insertBox(element, box, position = "afterend") {
    if (box.innerHTML != "") {
      element.insertAdjacentElement(position, box)
    } else {
      box.remove()
    }
  }

  function boxSpecial(text) {
    const newBox = document.createElement("DIV")
    newBox.classList.add("box")
    newBox.classList.add("special")
    newBox.innerHTML = text
    return newBox
  }

  function deselectBoxes() {
    document.querySelectorAll(".box.selected").forEach(box => {
      box.classList.remove("selected")
    })
    selectedBoxes = []
  }

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
