const enterBtn = document.getElementById("enterButton")
const bootScreen = document.getElementById("bootScreen")
const desktop = document.getElementById("desktop")
const clock = document.getElementById("clock")

enterBtn?.addEventListener("click", () => {
  bootScreen.style.display = "none"
  desktop.classList.remove("hidden")
  desktop.style.display = "block"
})




function updateClock() {
  const now = new Date()
  clock.textContent = now.toTimeString().split(" ")[0]
}
setInterval(updateClock, 1000)
updateClock()



let maxZ = 100


function focusWindow(win) {
  if (!win) return
  maxZ++
  win.style.zIndex = maxZ
}

function openWindow(win) {
  if (!win) return
  win.classList.remove("hidden")
  win.style.display = "block"
  focusWindow(win)
}



function closeWindow(win) {
  if (!win) return
  win.style.display = "none"
}



document.addEventListener("mousedown", (e) => {
  const win = e.target.closest(".os-window, .window")
  if (win) focusWindow(win)
})

let dragWin = null
let mouseOffset = { x: 0, y: 0 }



document.addEventListener("mousedown", (e) => {
  const header = e.target.closest(".window-header, [id$='Header']")
  if (!header || e.target.closest("button")) return

  dragWin = header.closest(".os-window, .window")
  if (!dragWin) return

  focusWindow(dragWin)




  const box = dragWin.getBoundingClientRect()
  dragWin.style.left = `${box.left}px`
  dragWin.style.top = `${box.top}px`
  dragWin.style.transform = "none"




  mouseOffset.x = e.clientX - box.left
  mouseOffset.y = e.clientY - box.top
})

document.addEventListener("mousemove", (e) => {
  if (!dragWin) return




  const maxX = window.innerWidth - dragWin.offsetWidth


  const maxY = window.innerHeight - dragWin.offsetHeight - 40

  const left = Math.max(0, Math.min(e.clientX - mouseOffset.x, maxX))
  const top = Math.max(40, Math.min(e.clientY - mouseOffset.y, maxY))

  dragWin.style.left = `${left}px`

  dragWin.style.top = `${top}px`
})

document.addEventListener("mouseup", () => {
  dragWin = null
})

document.addEventListener("click", (e) => {
  const icon = e.target.closest("[data-app]")
  if (!icon) return

  const appName = icon.dataset.app

  if (appName === "terminal") {

    openWindow(document.getElementById("terminalWindow"))
    document.getElementById("terminalInput")?.focus()
  } else if (appName === "monitor") {

    openWindow(document.getElementById("monitorWindow"))
  } else if (appName === "password") {

    openWindow(document.getElementById("passWindow"))
  } 

  else if (appName === "notes") {
  openWindow(document.getElementById("notesWindow"))
  }
  
  else {

    const comingSoon = document.getElementById("comingSoonWindow")
    const label = document.getElementById("comingSoonApp")

    if (label) label.textContent = appName.toUpperCase()
    openWindow(comingSoon)
  }
})

const windowControls = [
  { btn: "terminalClose", win: "terminalWindow" },

  { btn: "terminalMinimize", win: "terminalWindow" },
  { btn: "monitorClose", win: "monitorWindow" },

  { btn: "monitorMinimize", win: "monitorWindow" },
  { btn: "passClose", win: "passWindow" },
  { btn: "notesClose", win: "notesWindow" },
  { btn: "comingSoonClose", win: "comingSoonWindow" }
]

windowControls.forEach(({ btn, win }) => {
  document.getElementById(btn)?.addEventListener("click", () => {
    closeWindow(document.getElementById(win))
  })
})

const genPassBtn = document.getElementById("generatePass")
const copyPassBtn = document.getElementById("copy")

const passOutput = document.getElementById("passOutput")

genPassBtn?.addEventListener("click", () => {
  let chars = "abcdefghijklmnopqrstuvwxyz"
  if (document.getElementById("includeUppercase")?.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  if (document.getElementById("includeNumbers")?.checked) chars += "0123456789"


  if (document.getElementById("includeSymbols")?.checked) chars += "!@#$%^&*()_+-="

  const len = parseInt(document.getElementById("passLength").value) || 16
  let pass = ""
  for (let i = 0 ;i < len; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)]
  }

  passOutput.textContent = pass || "---"
})

copyPassBtn?.addEventListener("click", () => {
  const pass = passOutput.textContent
  if (!pass || pass === "---") return


  navigator.clipboard.writeText(pass)
  copyPassBtn.textContent = "COPIED"
  setTimeout(() => (copyPassBtn.textContent = "COPY"), 1000)
})

const notesArea = document.getElementById('notesArea')
const saveNotesBtn = document.getElementById('saveNotes')
const clearNotesBtn = document.getElementById('clearNotes')

if (notesArea){

  notesArea.value = localStorage.getItem('hackeros_notes') || ''
}

saveNotesBtn?.addEventListener("click", () => {

  if (notesArea) {


    localStorage.setItem("hackeros_notes", notesArea.value)
    saveNotesBtn.textContent = "SAVED!"
    setTimeout(() => (saveNotesBtn.textContent = "SAVE"), 1000)

  }
})

clearNotesBtn?.addEventListener("click", () => {

  if (notesArea) {

    notesArea.value = ""

    localStorage.removeItem("hackeros_notes")

  }
})


const termInput = document.getElementById("terminalInput")

const termOutput = document.querySelector(".terminal-output")
const termContent = document.getElementById("terminalContent")
const history = []
let historyIndex = -1

function addLine(text, cssClass = "") {
  const div = document.createElement("div")
  div.className = cssClass
  div.textContent = text
  termOutput.appendChild(div)

  termContent.scrollTop = termContent.scrollHeight
}

function runCmd(cmd) {
  const input = cmd.trim().toLowerCase()

  switch (input) {
    case "help":
      addLine(
        "Available commands:\n  help      Show commands\n  clear     Clear terminal\n  whoami    Display user\n  about     About HackerOS\n  status    Show system status\n  neofetch  Display system information",
        "text-slate-300 mb-2 whitespace-pre-wrap"
      )
      break
    case "whoami":
      addLine("root", "text-slate-300 mb-2")
      break
    case "about":
      addLine("HackerOS v1.0.0\nA minimal web desktop workspace.", "text-slate-300 mb-2")
      break
    case "status":
      addLine("SYSTEM: ONLINE | SECURITY: ACTIVE | KERNEL: RUNNING", "text-slate-300 mb-2")
      break
    case "neofetch":
      addLine("HackerOS 1.0\nOS: HackerOS\nKernel: 6.8.0-web\nUser: root", "text-slate-300 mb-2 whitespace-pre-wrap")
      break
    case "clear":
      termOutput.innerHTML = ""
      break
    default:
      addLine(`Command not found: ${cmd}`, "text-rose-400 mb-2")
  }
}

termInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = termInput.value.trim()
    if (!cmd) return
    

    history.push(cmd)
    historyIndex = history.length

    addLine(`user@hackeros:~$ ${cmd}`, "text-sky-400 font-bold")
    runCmd(cmd)
    termInput.value = ""
  } else if (e.key === "ArrowUp") {
    e.preventDefault()
    if (historyIndex > 0) termInput.value = history[--historyIndex]
  } else if (e.key === "ArrowDown") {
    e.preventDefault()
    if (historyIndex < history.length - 1) {
      termInput.value = history[++historyIndex]
    } else {
      historyIndex = history.length
      termInput.value = ""
    }
  }
})

const cpuVal = document.getElementById("cpuValue")
const memVal = document.getElementById("memoryValue")
const netVal = document.getElementById("networkValue")
const diskVal = document.getElementById("diskValue")

const cpuBar = document.getElementById("cpuBar")
const memBar = document.getElementById("memoryBar")
const netBar = document.getElementById("networkBar")
const diskBar = document.getElementById("diskBar")

const tempEl = document.getElementById("temperature")
const procEl = document.getElementById("processCount")
const uptimeEl = document.getElementById("uptime")

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function updateStats() {
  const cpu = randomNum(15, 80)
  const mem = randomNum(30, 70)
  const net = randomNum(5, 45)
  const disk = randomNum(40, 60)

  if (cpuVal) cpuVal.textContent = `${cpu}%`
  if (memVal) memVal.textContent = `${mem}%`
  if (netVal) netVal.textContent = `${net}%`
  if (diskVal) diskVal.textContent = `${disk}%`

  if (cpuBar) cpuBar.style.width = `${cpu}%`
  if (memBar) memBar.style.width = `${mem}%`
  if (netBar) netBar.style.width = `${net}%`
  if (diskBar) diskBar.style.width = `${disk}%`

  if (tempEl) tempEl.textContent = `${randomNum(40, 56)}°C`
  if (procEl) procEl.textContent = randomNum(42, 58)
}

setInterval(updateStats, 2000)
updateStats()

let elapsed = 0
setInterval(() => {
  elapsed++
  if (uptimeEl) {
    uptimeEl.textContent = new Date(elapsed * 1000).toISOString().substring(11, 19)
  }
}, 1000)