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


const lines = document.querySelectorAll(".boot-line");

const enterButton = document.getElementById("enterButton");

const bootScreen = document.getElementById("bootScreen");

const desktop = document.getElementById("desktop");

const clock = document.getElementById("clock");


let currentLine = 0;


/* ==================================================
   BOOT TYPING EFFECT
================================================== */

function typeLine() {

    if (currentLine >= lines.length) {

        enterButton.disabled = false;

        return;
    }


    const line = lines[currentLine];

    const message = line.querySelector(".message");

    const text = bootLines[currentLine];


    line.classList.add("active");


    let character = 0;


    const typing = setInterval(() => {

        message.textContent += text[character];

        character++;


        if (character >= text.length) {

            clearInterval(typing);


            setTimeout(() => {

                line.classList.add("completed");

                currentLine++;

                setTimeout(typeLine, 700);

            }, 500);
        }

    }, 40);
}


/* ==================================================
   ENTER HACKEROS
================================================== */

enterButton.addEventListener("click", () => {

    bootScreen.style.display = "none";

    desktop.style.display = "block";

    updateClock();

});


/* ==================================================
   CLOCK
================================================== */

function updateClock() {

    const now = new Date();


    const hours =
        String(now.getHours()).padStart(2, "0");


    const minutes =
        String(now.getMinutes()).padStart(2, "0");


    const seconds =
        String(now.getSeconds()).padStart(2, "0");


    clock.textContent =
        `${hours}:${minutes}:${seconds}`;
}


setInterval(updateClock, 1000);


/* ==================================================
   TERMINAL ELEMENTS
================================================== */

const terminalIcon =
    document.querySelector('[data-app="terminal"]');


const terminalWindow =
    document.getElementById("terminalWindow");


const terminalHeader =
    document.getElementById("terminalHeader");


const terminalClose =
    document.getElementById("terminalClose");


const terminalMinimize =
    document.getElementById("terminalMinimize");


const terminalInput =
    document.getElementById("terminalInput");


const terminalOutput =
    document.querySelector(".terminal-output");


/* ==================================================
   OPEN TERMINAL
================================================== */

terminalIcon.addEventListener("click", () => {

    terminalWindow.style.display = "block";

    terminalInput.focus();

});


/* ==================================================
   CLOSE TERMINAL
================================================== */

terminalClose.addEventListener("click", () => {

    terminalWindow.style.display = "none";

});


/* ==================================================
   MINIMIZE TERMINAL
================================================== */

terminalMinimize.addEventListener("click", () => {

    terminalWindow.style.display = "none";

});


/* ==================================================
   TERMINAL COMMANDS
================================================== */

const commandHistory = [];

let historyIndex = -1;


terminalInput.addEventListener("keydown", (event) => {

    /* ENTER */

    if (event.key === "Enter") {

        const command =
            terminalInput.value.trim();


        if (command === "") {
            return;
        }


        commandHistory.push(command);

        historyIndex = commandHistory.length;


        printCommand(command);

        runCommand(command);


        terminalInput.value = "";

    }


    /* ARROW UP */

    if (event.key === "ArrowUp") {

        event.preventDefault();


        if (historyIndex > 0) {

            historyIndex--;

            terminalInput.value =
                commandHistory[historyIndex];

        }

    }


    /* ARROW DOWN */

    if (event.key === "ArrowDown") {

        event.preventDefault();


        if (
            historyIndex <
            commandHistory.length - 1
        ) {

            historyIndex++;

            terminalInput.value =
                commandHistory[historyIndex];

        } else {

            historyIndex =
                commandHistory.length;

            terminalInput.value = "";

        }

    }

});


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


    terminalOutput.appendChild(line);

}


/* ==================================================
   RUN COMMAND
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

            terminalOutput.innerHTML = "";

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
   PRINT OUTPUT
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


    terminalOutput.appendChild(output);


    terminalOutput.parentElement.scrollTop =
        terminalOutput.parentElement.scrollHeight;

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
   DRAG TERMINAL WINDOW
================================================== */

let isDragging = false;

let offsetX = 0;

let offsetY = 0;


terminalHeader.addEventListener("mousedown", (event) => {

    isDragging = true;


    const rect =
        terminalWindow.getBoundingClientRect();


    offsetX =
        event.clientX - rect.left;


    offsetY =
        event.clientY - rect.top;


    terminalWindow.style.transform =
        "none";

});


document.addEventListener("mousemove", (event) => {

    if (!isDragging) {
        return;
    }


    let newX =
        event.clientX - offsetX;


    let newY =
        event.clientY - offsetY;


    const maxX =
        window.innerWidth -
        terminalWindow.offsetWidth;


    const maxY =
        window.innerHeight -
        terminalWindow.offsetHeight;


    newX =
        Math.max(0, Math.min(newX, maxX));


    newY =
        Math.max(55, Math.min(newY, maxY - 50));


    terminalWindow.style.left =
        `${newX}px`;


    terminalWindow.style.top =
        `${newY}px`;

});


document.addEventListener("mouseup", () => {

    isDragging = false;

});


/* ==================================================
   KEEP TERMINAL FOCUSED
================================================== */

terminalWindow.addEventListener("click", () => {

    terminalInput.focus();

});


/* ==================================================
   OTHER APPS
================================================== */

const appIcons =
    document.querySelectorAll(".app-icon");


appIcons.forEach((app) => {

    if (app.dataset.app === "terminal") {
        return;
    }


    app.addEventListener("click", () => {

        const appName =
            app.dataset.app;


        console.log(
            `Opening ${appName}...`
        );

    });

});


/* ==================================================
   START BOOT
================================================== */

typeLine();