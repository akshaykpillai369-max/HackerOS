const bootLines = [
    "Initializing HackerOS...",
    "Loading kernel...",
    "Loading security modules...",
    "Establishing secure session...",
    "System ready."
];


const lines = document.querySelectorAll(".boot-line");

const enterButton = document.getElementById("enterButton");


let currentLine = 0;

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

                setTimeout(typeLine, 400);

            }, 500);
        }

    }, 40);
}

typeLine();