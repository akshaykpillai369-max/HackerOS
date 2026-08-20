const lowercase="abcdefghijklmnopqrstuvwxyz";
const uppercase="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers="0123456789";
const symbols="!@#$%^&*()_+-=[]{}|;:,.<>?";

const enterButton=document.getElementById("enterButton");
const bootScreen=document.getElementById("bootScreen");
const desktop=document.getElementById("desktop");

enterButton.addEventListener("click",()=>{
    bootScreen.style.display="none";
    desktop.style.display="block";
});

const clock=document.getElementById("clock");

function updateClock(){
    const now=new Date();
    clock.textContent=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
}
setInterval(updateClock,1000);
updateClock();

const passIcon=document.querySelector('[data-app="password"]');
const passWindow=document.getElementById("passWindow");
const passHeader=document.getElementById("passHeader");
const passClose=document.getElementById("passClose");
const passLength=document.getElementById("passLength");
const includeUppercase=document.getElementById("includeUppercase");
const includeNumbers=document.getElementById("includeNumbers");
const includeSymbols=document.getElementById("includeSymbols");
const generatePass=document.getElementById("generatePass");
const passOutput=document.getElementById("passOutput");
const copy=document.getElementById("copy");

passIcon.addEventListener("click",()=>passWindow.classList.remove("hidden"));
passClose.addEventListener("click",()=>passWindow.classList.add("hidden"));

generatePass.addEventListener("click",()=>{
    let pool=lowercase;
    if(includeUppercase.checked)pool+=uppercase;
    if(includeNumbers.checked)pool+=numbers;
    if(includeSymbols.checked)pool+=symbols;

    const length=Math.min(32,Math.max(4,Number(passLength.value)));
    passLength.value=length;

    let password="";
    for(let i=0;i<length;i++)
        password+=pool[Math.floor(Math.random()*pool.length)];

    passOutput.textContent=password;
});

copy.addEventListener("click",async()=>{
    const password=passOutput.textContent;
    if(!password||password==="---")return;

    await navigator.clipboard.writeText(password);
    copy.textContent="COPIED";
    setTimeout(()=>copy.textContent="COPY",1000);
});

const terminalIcon=document.querySelector('[data-app="terminal"]');
const terminalWindow=document.getElementById("terminalWindow");
const terminalHeader=document.getElementById("terminalHeader");
const terminalClose=document.getElementById("terminalClose");
const terminalMinimize=document.getElementById("terminalMinimize");
const terminalInput=document.getElementById("terminalInput");
const terminalOutput=document.querySelector(".terminal-output");
const terminalContent=document.getElementById("terminalContent");
const history=[];
let historyIndex=-1;

terminalIcon.addEventListener("click",()=>{
    terminalWindow.style.display="block";
    terminalInput.focus();
});

[terminalClose,terminalMinimize].forEach(button=>{
    button.addEventListener("click",()=>terminalWindow.style.display="none");
});

terminalInput.addEventListener("keydown",event=>{
    if(event.key==="Enter"){
        const command=terminalInput.value.trim();
        if(!command)return;
        history.push(command);
        historyIndex=history.length;
        printCommand(command);
        runCommand(command);
        terminalInput.value="";
    }

    if(event.key==="ArrowUp"){
        event.preventDefault();
        if(historyIndex>0)terminalInput.value=history[--historyIndex];
    }

    if(event.key==="ArrowDown"){
        event.preventDefault();
        if(historyIndex<history.length-1)
            terminalInput.value=history[++historyIndex];
        else{
            historyIndex=history.length;
            terminalInput.value="";
        }
    }
});

function printCommand(command){
    const line=document.createElement("div");
    line.textContent=`root@hackeros:~$ ${command}`;
    terminalOutput.appendChild(line);
    terminalContent.scrollTop=terminalContent.scrollHeight;
}

function printOutput(text){
    const output=document.createElement("div");
    output.style.cssText="white-space:pre-wrap;margin-bottom:10px";
    output.textContent=text;
    terminalOutput.appendChild(output);
    terminalContent.scrollTop=terminalContent.scrollHeight;
}

function runCommand(command){
    switch(command.toLowerCase()){
        case "help":
            printOutput("Available commands:\n help      Show commands\n clear     Clear terminal\n whoami    Display user\n about     About HackerOS\n status    Show system status\n neofetch  Display system information");
            break;
        case "whoami":
            printOutput("root");
            break;
        case "about":
            printOutput("HackerOS\n--------\nA fictional security-focused web operating system.\nVersion: 1.0.0\nKernel: HackerKernel\nUser: root");
            break;
        case "status":
            printOutput("SYSTEM STATUS\n\nOS: ONLINE\nSECURITY: ACTIVE\nNETWORK: CONNECTED\nKERNEL: RUNNING\nSESSION: SECURE");
            break;
        case "neofetch":
            printOutput("HackerOS 1.0\n------------\nOS: HackerOS\nKernel: HackerKernel\nShell: HackerShell\nUser: root\nStatus: ONLINE");
            break;
        case "clear":
            terminalOutput.innerHTML="";
            break;
        default:
            printOutput(`Command not found: ${command}`);
    }
}

function makeDraggable(header, windowEl) {
    let dragging = false, x = 0, y = 0;

    header.addEventListener("mousedown", event => {
        
        if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
            return;
        }

        dragging = true;
        const rect = windowEl.getBoundingClientRect();
        
       
        windowEl.style.left = `${rect.left}px`;
        windowEl.style.top = `${rect.top}px`;
        windowEl.style.transform = "none";

        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    });

    document.addEventListener("mousemove", event => {
        if (!dragging) return;
        windowEl.style.left = `${Math.max(0, Math.min(event.clientX - x, window.innerWidth - windowEl.offsetWidth))}px`;
        windowEl.style.top = `${Math.max(55, Math.min(event.clientY - y, window.innerHeight - windowEl.offsetHeight - 50))}px`;
    });

    document.addEventListener("mouseup", () => dragging = false);
}

makeDraggable(terminalHeader,terminalWindow);
makeDraggable(passHeader,passWindow);

const monitorIcon=document.querySelector('[data-app="monitor"]');
const monitorWindow=document.getElementById("monitorWindow");
const monitorHeader=document.getElementById("monitorHeader");
const monitorClose=document.getElementById("monitorClose");
const monitorMinimize=document.getElementById("monitorMinimize");

const cpuBar=document.getElementById("cpuBar");
const memoryBar=document.getElementById("memoryBar");
const networkBar=document.getElementById("networkBar");
const diskBar=document.getElementById("diskBar");
const cpuValue=document.getElementById("cpuValue");
const memoryValue=document.getElementById("memoryValue");
const networkValue=document.getElementById("networkValue");
const diskValue=document.getElementById("diskValue");
const processCount=document.getElementById("processCount");
const temperature=document.getElementById("temperature");
const uptime=document.getElementById("uptime");

monitorIcon.addEventListener("click",()=>monitorWindow.style.display="block");
[monitorClose,monitorMinimize].forEach(button=>{
    button.addEventListener("click",()=>monitorWindow.style.display="none");
});

function randomValue(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

function updateStats(){
    const values=[
        randomValue(25,88),randomValue(35,75),
        randomValue(10,65),randomValue(40,80)
    ];

    [cpuValue,memoryValue,networkValue,diskValue].forEach((el,i)=>{
        el.textContent=`${values[i]}%`;
    });

    [cpuBar,memoryBar,networkBar,diskBar].forEach((el,i)=>{
        el.style.width=`${values[i]}%`;
    });

    processCount.textContent=randomValue(38,57);
    temperature.textContent=`${randomValue(38,58)}°C`;
}

updateStats();
setInterval(updateStats,1500);

let seconds=0;
setInterval(()=>{
    seconds++;
    uptime.textContent=new Date(seconds*1000).toISOString().substring(11,19);
},1000);

makeDraggable(monitorHeader,monitorWindow);

const comingSoonWindow=document.getElementById("comingSoonWindow");
const comingSoonHeader=document.getElementById("comingSoonHeader");
const comingSoonClose=document.getElementById("comingSoonClose");
const comingSoonApp=document.getElementById("comingSoonApp");

function openComingSoon(name){
    comingSoonApp.textContent=name.toUpperCase();
    comingSoonWindow.style.display="block";
}

document.querySelector('[data-app="network"]').addEventListener("click",()=>openComingSoon("Network Scanner"));
document.querySelector('[data-app="editor"]').addEventListener("click",()=>openComingSoon("Code Editor"));
comingSoonClose.addEventListener("click",()=>comingSoonWindow.style.display="none");

makeDraggable(comingSoonHeader,comingSoonWindow);