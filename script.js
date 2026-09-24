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

  updateTaskBar()
}



function closeWindow(win) {
  if (!win) return
  win.style.display = "none"

  updateTaskBar()

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

  else if (appName === "settings") {
  openWindow(document.getElementById("settingsWindow")) 
  }
  else if (appName === "network") {
    openWindow(document.getElementById("networkWindow"))
  }

  else if (appName === "calc") {
    openWindow(document.getElementById("calcWindow"))
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
  { btn: "networkClose", win: "networkWindow" },
  { btn: "monitorMinimize", win: "monitorWindow" },
  { btn: "passClose", win: "passWindow" },
  { btn: "notesClose", win: "notesWindow" },
  { btn: "settingsClose", win: "settingsWindow" },
  { btn: "comingSoonClose", win: "comingSoonWindow" },
  { btn: "calcClose", win: "calcWindow" },
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

function setWallpaper(url) {

  if(!url) return;
  const desktopset = document.getElementById('desktop')

  if(desktopset){

    desktopset.style.backgroundImage = `url('${url}')`
    localStorage.setItem('hackeros_wallpaper', url)
  }
}

const savedWallpaper = localStorage.getItem('hackeros_wallapaper')
if(savedWallpaper){

  setWallpaper(savedWallpaper)
}

document.querySelectorAll('.wp-btn').forEach((btn) => {

  btn.addEventListener('click', () => {

    const wpUrl = btn.dataset.wp
    setWallpaper(wpUrl)
  })
})

const applyWpBtn = document.getElementById("applyCustomWallpaper")
const wpUrlInput = document.getElementById("wallpaperUrlInput")

applyWpBtn?.addEventListener("click", () => {
  const customUrl = wpUrlInput?.value.trim()
  if (customUrl) {
    setWallpaper(customUrl);
    if (wpUrlInput) wpUrlInput.value = ""
  }
})

function updateTaskBar(){

  const docker = document.getElementById('taskbarDock')
  if(!docker) return
  docker.innerHTML = ''


  const windows = document.querySelectorAll('.os-window')
  windows.forEach((win) => {

    if(win.style.display === 'block') {

      const headerText = win.querySelector('.window-header span')?.textContent.trim() || 'App'
      const btn = document.createElement('button')
      btn.className = 'px-2.5 py-1 text-[11px] rounded bg-white/10 hover:bg-white/20  text-slate-200 transition'
      
      btn.textContent = headerText
      btn.addEventListener('click', () => {

        focusWindow(win)
  
      })

      docker.appendChild(btn)
    }
  })
}


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
    
    case "ifconfig":
      addLine("eth0: flags=4163<UP,BROADCAST,RUNNING> mtu 1500\n      inet 192.168.1.108 netmask 255.255.255.0 broadcast 192.168.1.255\n      ether 52:54:00:12:34:56 txqueuelen 1000 (Ethernet)", "text-slate-300 mb-2 whitespace-pre-wrap")
      break
    case "ping":
      addLine("PING 127.0.0.1: 56 data bytes\n64 bytes from 127.0.0.1: seq=1 time=0.04 ms\n64 bytes from 127.0.0.1: seq=2 time=0.05 ms\n--- 127.0.0.1 ping statistics: 0% packet loss ---", "text-slate-300 mb-2 whitespace-pre-wrap")
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

const netLog = document.getElementById("netLog")
const netTarget = document.getElementById("netTarget")
const scanPortsBtn = document.getElementById("scanPortsBtn")
const pingHostBtn = document.getElementById("pingHostBtn")
const clearNetLog = document.getElementById("clearNetLog")

function writeNetLine(str, color='text-slate-300'){

  if(!netLog) return

  const line = document.createElement('div')
  line.className = color
  line.textContent = str
  netLog.appendChild(line)
  netLog.scrollTop = netLog.scrollHeight
}


clearNetLog?.addEventListener('click', () => {

  if(netLog) netLog.innerHTML = ''
})

pingHostBtn?.addEventListener('click', ()=> {

  const host = netTarget?.value.trim() || '127.0.0.1'
  writeNetLine(`PING ${host}: 56 data bytes`, 'text-sky-400 font-bold')

  let runs = 0
  const timer = setInterval(() => {

    runs++
    const latency = (Math.random() * 18 + 6).toFixed(2)
    writeNetLine(`64 bytes from ${host}: seq=${runs} time=${latency} ms`)

    if (runs >=4) {

      clearInterval(timer)
      writeNetLine(`--- ${host} ping completed: 0% packet loss ---`, "text-emerald-400")
    }
    }, 400)
  })


  scanPortsBtn?.addEventListener('click', () => {

    const host = netTarget?.value.trim() || '127.0.0.1'
    scanPortsBtn.disabled = true
    scanPortsBtn.textContent = 'BUSY...'
    writeNetLine(`PORT SCAN: Probing ${host}...`, 'text-sky-400 font-bold')

    const ports = [
    { p: 21, svc: "FTP", status: "CLOSED" },
    { p: 22, svc: "SSH", status: "OPEN" },
    { p: 80, svc: "HTTP", status: "OPEN" },
    { p: 443, svc: "HTTPS", status: "OPEN" },
    { p: 3306, svc: "MYSQL", status: "CLOSED" },
    { p: 8080, svc: "NODE", status: "FILTERED" }
  ]

  let i= 0

  const scanner = setInterval(() => {

    if(i < ports.length){

      const entry = ports[i]
      const color = entry.status === 'OPEN' ? 'text-emerald-400' : (entry.status === "FILTERED" ? "text-amber-400" : "text-slate-500")
      writeNetLine(`[+] ${entry.p}/tcp (${entry.svc}) - ${entry.status}`, color)
      i++
    } else {

      clearInterval(scanner)
      writeNetLine(`Scan finished on ${host}`, 'text-slate-400')
      scanPortsBtn.disabled = false
      scanPortsBtn.textContent = 'SCAN'
    }
  }, 350)

  })


// --- Basic Calculator Logic ---
const calcScreen = document.getElementById('calcScreen')
let currentCalcExp = ''

document.querySelectorAll('.calc-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.val

    if (val === 'C') {
      currentCalcExp = ''
      calcScreen.textContent = '0'
    } else if (val === 'DEL') {
      currentCalcExp = currentCalcExp.slice(0, -1)
      calcScreen.textContent = currentCalcExp || '0'
    } else if (val === '=') {
      if (!currentCalcExp) return
      try {
        currentCalcExp = String(Function(`return (${currentCalcExp})`)())
        calcScreen.textContent = currentCalcExp
      } catch (error) {
        calcScreen.textContent = 'Error'
        currentCalcExp = ''
      }
    } else {
      const operators = ['+', '-', '*', '/', '.']
      const lastChar = currentCalcExp.slice(-1)

      if (operators.includes(val) && operators.includes(lastChar)) {
        currentCalcExp = currentCalcExp.slice(0, -1) + val
      } else {
        currentCalcExp += val
      }
      calcScreen.textContent = currentCalcExp
    }
  })
})