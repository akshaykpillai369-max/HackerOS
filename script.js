/* ==================================================
   HACKEROS
   MAIN JAVASCRIPT
================================================== */


/* ==================================================
   BOOT SYSTEM
================================================== */

const bootLines = [
    "Initializing HackerOS...",
    "Loading kernel...",
    "Loading security modules...",
    "Establishing secure session...",
    "System ready."
];


const lines =
    document.querySelectorAll(".boot-line");


const enterButton =
    document.getElementById("enterButton");


const bootScreen =
    document.getElementById("bootScreen");


const desktop =
    document.getElementById("desktop");


let currentLine = 0;


/* ==================================================
   BOOT TYPING EFFECT
================================================== */

function typeLine() {

    if (currentLine >= bootLines.length) {

        enterButton.disabled = false;

        return;
    }


    const line =
        lines[currentLine];


    const message =
        line.querySelector(".message");


    const text =
        bootLines[currentLine];


    line.classList.add("active");


    let character = 0;


    const typing =
        setInterval(() => {

            message.textContent +=
                text[character];


            character++;


            if (character >= text.length) {

                clearInterval(typing);


                setTimeout(() => {

                    line.classList.add(
                        "completed"
                    );


                    currentLine++;


                    setTimeout(
                        typeLine,
                        700
                    );

                }, 500);

            }

        }, 40);

}


/* ==================================================
   ENTER HACKEROS
================================================== */

enterButton.addEventListener(
    "click",
    () => {

        bootScreen.style.display =
            "none";


        desktop.style.display =
            "block";


        updateClock();

    }
);


/* ==================================================
   DESKTOP CLOCK
================================================== */

const clock =
    document.getElementById("clock");


function updateClock() {

    const now =
        new Date();


    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    const seconds =
        String(
            now.getSeconds()
        ).padStart(2, "0");


    clock.textContent =
        `${hours}:${minutes}:${seconds}`;

}


setInterval(
    updateClock,
    1000
);


/* ==================================================
   TERMINAL
================================================== */

const terminalIcon =
    document.querySelector(
        '[data-app="terminal"]'
    );


const terminalWindow =
    document.getElementById(
        "terminalWindow"
    );


const terminalHeader =
    document.getElementById(
        "terminalHeader"
    );


const terminalClose =
    document.getElementById(
        "terminalClose"
    );


const terminalMinimize =
    document.getElementById(
        "terminalMinimize"
    );


const terminalInput =
    document.getElementById(
        "terminalInput"
    );


const terminalOutput =
    document.querySelector(
        ".terminal-output"
    );


/* ==================================================
   OPEN TERMINAL
================================================== */

terminalIcon.addEventListener(
    "click",
    () => {

        terminalWindow.style.display =
            "block";


        terminalInput.focus();

    }
);


/* ==================================================
   CLOSE TERMINAL
================================================== */

terminalClose.addEventListener(
    "click",
    () => {

        terminalWindow.style.display =
            "none";

    }
);


/* ==================================================
   MINIMIZE TERMINAL
================================================== */

terminalMinimize.addEventListener(
    "click",
    () => {

        terminalWindow.style.display =
            "none";

    }
);


/* ==================================================
   TERMINAL COMMAND HISTORY
================================================== */

const commandHistory = [];

let historyIndex = -1;


/* ==================================================
   TERMINAL INPUT
================================================== */

terminalInput.addEventListener(
    "keydown",
    (event) => {


        /* ==========================================
           ENTER
        ========================================== */

        if (event.key === "Enter") {

            const command =
                terminalInput.value.trim();


            if (command === "") {

                return;

            }


            commandHistory.push(
                command
            );


            historyIndex =
                commandHistory.length;


            printCommand(
                command
            );


            runCommand(
                command
            );


            terminalInput.value = "";

        }


        /* ==========================================
           ARROW UP
        ========================================== */

        if (event.key === "ArrowUp") {

            event.preventDefault();


            if (historyIndex > 0) {

                historyIndex--;


                terminalInput.value =
                    commandHistory[
                        historyIndex
                    ];

            }

        }


        /* ==========================================
           ARROW DOWN
        ========================================== */

        if (event.key === "ArrowDown") {

            event.preventDefault();


            if (
                historyIndex <
                commandHistory.length - 1
            ) {

                historyIndex++;


                terminalInput.value =
                    commandHistory[
                        historyIndex
                    ];

            }

            else {

                historyIndex =
                    commandHistory.length;


                terminalInput.value = "";

            }

        }

    }
);


/* ==================================================
   PRINT COMMAND
================================================== */

function printCommand(command) {

    const line =
        document.createElement("div");


    line.innerHTML = `
        <span class="terminal-highlight">
            root@hackeros:~$
        </span>
        ${escapeHTML(command)}
    `;


    terminalOutput.appendChild(
        line
    );

}


/* ==================================================
   RUN TERMINAL COMMAND
================================================== */

function runCommand(command) {

    const normalizedCommand =
        command.toLowerCase();


    switch (normalizedCommand) {


        /* ==========================================
           HELP
        ========================================== */

        case "help":

            printOutput(`
Available commands:

  help       Show available commands
  clear      Clear terminal
  whoami     Display current user
  about      About HackerOS
  status     Show system status
  neofetch   Display system information
            `);

            break;


        /* ==========================================
           WHOAMI
        ========================================== */

        case "whoami":

            printOutput(
                "root"
            );

            break;


        /* ==========================================
           ABOUT
        ========================================== */

        case "about":

            printOutput(`
HackerOS
--------

A fictional security-focused
web operating system.

Version: 1.0.0
Kernel: HackerKernel
User: root
            `);

            break;


        /* ==========================================
           STATUS
        ========================================== */

        case "status":

            printOutput(`
SYSTEM STATUS

OS:          ONLINE
SECURITY:    ACTIVE
NETWORK:     CONNECTED
KERNEL:      RUNNING
SESSION:     SECURE
            `);

            break;


        /* ==========================================
           NEOFETCH
        ========================================== */

        case "neofetch":

            printOutput(`
 _   _    _    ____ _  ______ ____   ___  ____
| | | |  / \\  / ___| |/ / ___|  _ \\ / _ \\ / ___|
| |_| | / _ \\| |   | ' /| |   | |_) | | | \\___ \\
|  _  |/ ___ \\ |___| . \\| |___|  _ <| |_| |___) |
|_| |_/_/   \\_\\____|_|\\_\\____|_| \\_\\\\___/|____/

OS:        HackerOS 1.0
Kernel:    HackerKernel
Shell:     HackerShell
User:      root
Status:    ONLINE
            `);

            break;


        /* ==========================================
           CLEAR
        ========================================== */

        case "clear":

            terminalOutput.innerHTML =
                "";

            break;


        /* ==========================================
           UNKNOWN COMMAND
        ========================================== */

        default:

            printOutput(
                `Command not found: ${command}`
            );

    }

}


/* ==================================================
   PRINT TERMINAL OUTPUT
================================================== */

function printOutput(text) {

    const output =
        document.createElement("div");


    output.style.whiteSpace =
        "pre-wrap";


    output.style.marginBottom =
        "10px";


    output.textContent =
        text;


    terminalOutput.appendChild(
        output
    );


    const terminalContent =
        document.getElementById(
            "terminalContent"
        );


    terminalContent.scrollTop =
        terminalContent.scrollHeight;

}


/* ==================================================
   HTML ESCAPE
================================================== */

function escapeHTML(text) {

    const element =
        document.createElement("div");


    element.textContent =
        text;


    return element.innerHTML;

}


/* ==================================================
   TERMINAL DRAGGING
================================================== */

let isDraggingTerminal = false;

let terminalOffsetX = 0;

let terminalOffsetY = 0;


terminalHeader.addEventListener(
    "mousedown",
    (event) => {

        isDraggingTerminal = true;


        const rect =
            terminalWindow.getBoundingClientRect();


        terminalOffsetX =
            event.clientX - rect.left;


        terminalOffsetY =
            event.clientY - rect.top;


        terminalWindow.style.transform =
            "none";

    }
);


document.addEventListener(
    "mousemove",
    (event) => {

        if (!isDraggingTerminal) {

            return;

        }


        let newX =
            event.clientX -
            terminalOffsetX;


        let newY =
            event.clientY -
            terminalOffsetY;


        const maxX =
            window.innerWidth -
            terminalWindow.offsetWidth;


        const maxY =
            window.innerHeight -
            terminalWindow.offsetHeight;


        newX =
            Math.max(
                0,
                Math.min(
                    newX,
                    maxX
                )
            );


        newY =
            Math.max(
                55,
                Math.min(
                    newY,
                    maxY - 50
                )
            );


        terminalWindow.style.left =
            `${newX}px`;


        terminalWindow.style.top =
            `${newY}px`;

    }
);


document.addEventListener(
    "mouseup",
    () => {

        isDraggingTerminal = false;

    }
);


/* ==================================================
   TERMINAL FOCUS
================================================== */

terminalWindow.addEventListener(
    "click",
    () => {

        terminalInput.focus();

    }
);



/* ==================================================
   SYSTEM MONITOR
================================================== */

const monitorIcon =
    document.querySelector(
        '[data-app="monitor"]'
    );


const monitorWindow =
    document.getElementById(
        "monitorWindow"
    );


const monitorHeader =
    document.getElementById(
        "monitorHeader"
    );


const monitorClose =
    document.getElementById(
        "monitorClose"
    );


const monitorMinimize =
    document.getElementById(
        "monitorMinimize"
    );


/* ==================================================
   MONITOR ELEMENTS
================================================== */

const cpuBar =
    document.getElementById(
        "cpuBar"
    );


const memoryBar =
    document.getElementById(
        "memoryBar"
    );


const networkBar =
    document.getElementById(
        "networkBar"
    );


const diskBar =
    document.getElementById(
        "diskBar"
    );


const cpuValue =
    document.getElementById(
        "cpuValue"
    );


const memoryValue =
    document.getElementById(
        "memoryValue"
    );


const networkValue =
    document.getElementById(
        "networkValue"
    );


const diskValue =
    document.getElementById(
        "diskValue"
    );


const processCount =
    document.getElementById(
        "processCount"
    );


const temperature =
    document.getElementById(
        "temperature"
    );


const uptime =
    document.getElementById(
        "uptime"
    );


/* ==================================================
   OPEN SYSTEM MONITOR
================================================== */

monitorIcon.addEventListener(
    "click",
    () => {

        monitorWindow.style.display =
            "block";

    }
);


/* ==================================================
   CLOSE SYSTEM MONITOR
================================================== */

monitorClose.addEventListener(
    "click",
    () => {

        monitorWindow.style.display =
            "none";

    }
);


/* ==================================================
   MINIMIZE SYSTEM MONITOR
================================================== */

monitorMinimize.addEventListener(
    "click",
    () => {

        monitorWindow.style.display =
            "none";

    }
);


/* ==================================================
   RANDOM SYSTEM VALUE
================================================== */

function randomValue(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


/* ==================================================
   UPDATE SYSTEM STATISTICS
================================================== */

function updateSystemStats() {


    const cpu =
        randomValue(
            25,
            88
        );


    const memory =
        randomValue(
            35,
            75
        );


    const network =
        randomValue(
            10,
            65
        );


    const disk =
        randomValue(
            40,
            80
        );


    /* ==========================================
       VALUES
    ========================================== */

    cpuValue.textContent =
        `${cpu}%`;


    memoryValue.textContent =
        `${memory}%`;


    networkValue.textContent =
        `${network}%`;


    diskValue.textContent =
        `${disk}%`;


    /* ==========================================
       PROGRESS BARS
    ========================================== */

    cpuBar.style.width =
        `${cpu}%`;


    memoryBar.style.width =
        `${memory}%`;


    networkBar.style.width =
        `${network}%`;


    diskBar.style.width =
        `${disk}%`;


    /* ==========================================
       EXTRA FAKE DATA
    ========================================== */

    processCount.textContent =
        randomValue(
            38,
            57
        );


    temperature.textContent =
        `${randomValue(
            38,
            58
        )}°C`;

}


/* ==================================================
   START MONITOR
================================================== */

updateSystemStats();


setInterval(
    updateSystemStats,
    1500
);


/* ==================================================
   SYSTEM UPTIME
================================================== */

let systemSeconds = 0;


function updateUptime() {

    systemSeconds++;


    const hours =
        Math.floor(
            systemSeconds / 3600
        );


    const minutes =
        Math.floor(
            (systemSeconds % 3600) / 60
        );


    const seconds =
        systemSeconds % 60;


    uptime.textContent =
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;

}


setInterval(
    updateUptime,
    1000
);


/* ==================================================
   SYSTEM MONITOR DRAGGING
================================================== */

let isDraggingMonitor = false;

let monitorOffsetX = 0;

let monitorOffsetY = 0;


monitorHeader.addEventListener(
    "mousedown",
    (event) => {

        isDraggingMonitor = true;


        const rect =
            monitorWindow.getBoundingClientRect();


        monitorOffsetX =
            event.clientX - rect.left;


        monitorOffsetY =
            event.clientY - rect.top;


        monitorWindow.style.transform =
            "none";

    }
);


document.addEventListener(
    "mousemove",
    (event) => {

        if (!isDraggingMonitor) {

            return;

        }


        let newX =
            event.clientX -
            monitorOffsetX;


        let newY =
            event.clientY -
            monitorOffsetY;


        const maxX =
            window.innerWidth -
            monitorWindow.offsetWidth;


        const maxY =
            window.innerHeight -
            monitorWindow.offsetHeight;


        newX =
            Math.max(
                0,
                Math.min(
                    newX,
                    maxX
                )
            );


        newY =
            Math.max(
                55,
                Math.min(
                    newY,
                    maxY - 50
                )
            );


        monitorWindow.style.left =
            `${newX}px`;


        monitorWindow.style.top =
            `${newY}px`;

    }
);


document.addEventListener(
    "mouseup",
    () => {

        isDraggingMonitor = false;

    }
);



/* ==================================================
   COMING SOON APPLICATIONS
================================================== */

const comingSoonWindow =
    document.getElementById(
        "comingSoonWindow"
    );


const comingSoonHeader =
    document.getElementById(
        "comingSoonHeader"
    );


const comingSoonClose =
    document.getElementById(
        "comingSoonClose"
    );


const comingSoonApp =
    document.getElementById(
        "comingSoonApp"
    );


const networkIcon =
    document.querySelector(
        '[data-app="network"]'
    );


const editorIcon =
    document.querySelector(
        '[data-app="editor"]'
    );


/* ==================================================
   OPEN COMING SOON WINDOW
================================================== */

function openComingSoon(appName) {

    comingSoonApp.textContent =
        appName.toUpperCase();


    comingSoonWindow.style.display =
        "block";

}


/* ==================================================
   NETWORK SCANNER
================================================== */

networkIcon.addEventListener(
    "click",
    () => {

        openComingSoon(
            "Network Scanner"
        );

    }
);


/* ==================================================
   CODE EDITOR
================================================== */

editorIcon.addEventListener(
    "click",
    () => {

        openComingSoon(
            "Code Editor"
        );

    }
);


/* ==================================================
   CLOSE COMING SOON
================================================== */

comingSoonClose.addEventListener(
    "click",
    () => {

        comingSoonWindow.style.display =
            "none";

    }
);


/* ==================================================
   DRAG COMING SOON WINDOW
================================================== */

let isDraggingComingSoon = false;

let comingSoonOffsetX = 0;

let comingSoonOffsetY = 0;


comingSoonHeader.addEventListener(
    "mousedown",
    (event) => {

        isDraggingComingSoon = true;


        const rect =
            comingSoonWindow
                .getBoundingClientRect();


        comingSoonOffsetX =
            event.clientX - rect.left;


        comingSoonOffsetY =
            event.clientY - rect.top;


        comingSoonWindow.style.transform =
            "none";

    }
);


document.addEventListener(
    "mousemove",
    (event) => {

        if (!isDraggingComingSoon) {

            return;

        }


        let newX =
            event.clientX -
            comingSoonOffsetX;


        let newY =
            event.clientY -
            comingSoonOffsetY;


        const maxX =
            window.innerWidth -
            comingSoonWindow.offsetWidth;


        const maxY =
            window.innerHeight -
            comingSoonWindow.offsetHeight;


        newX =
            Math.max(
                0,
                Math.min(
                    newX,
                    maxX
                )
            );


        newY =
            Math.max(
                55,
                Math.min(
                    newY,
                    maxY - 50
                )
            );


        comingSoonWindow.style.left =
            `${newX}px`;


        comingSoonWindow.style.top =
            `${newY}px`;

    }
);


document.addEventListener(
    "mouseup",
    () => {

        isDraggingComingSoon = false;

    }
);



/* ==================================================
   START HACKEROS
================================================== */

typeLine();