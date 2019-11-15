// Stretch Goals
// x Score counter decrease on miss
// - More than 1 arrow at a time.
// - Increase to 4 columns(each with their own arrow - up down left right)
// - Space button to "pause" the game
// - Add sound for when eventlistener triggers ? hit : miss;
// - Combo multiplier
// - Difficulty Levels(rate increase for speed, # of arrows appended)

// Pseudocode

// Objects involved: 
//  - Parent Container
//  - Arrow
//  - "hit" range container

//  - score counter
let score = 0;
let scoreSelector = $(".scoreboard");

function updateScore() {
    scoreSelector.text(score);
};

// 1. Find and select the parent container
//     - then append Arrow (div with class .arrow) at top of page.
//     - Arrow will be position absolute
//     - Arrow will have a top and bottom value set. (aka Y-axis coordinates).

// Arrow Type HTML Reference Object
const arrowType = {
    left: {
        icon: "<i class='far fa-arrow-alt-circle-left'></i>",
        keyValue: "ArrowLeft",
        columnClass: ".columnLeft",
        accumulator: 0,
    },
    up: {
        icon: "<i class='far fa-arrow-alt-circle-up'></i>",
        keyValue: "ArrowUp",
        columnClass: ".columnUp",
        accumulator: 0,
    },
    down: {
        icon: "<i class='far fa-arrow-alt-circle-down'></i>",
        keyValue: "ArrowDown",
        columnClass: ".columnDown",
        accumulator: 0,
    },
    right: {
        icon: "<i class='far fa-arrow-alt-circle-right'></i>",
        keyValue: "ArrowRight",
        columnClass: ".columnRight",
        accumulator: 0,
    },
};

let arrowElement = "";

// Append arrow element
function appendArrow(arrowDirection) {
    // Accesses HTML values that correlates with arrowDirection
    // accumulator is to give each arrow a unique class (for query/target later)
    let accumulatorValue = arrowType[arrowDirection].accumulator;
    let arrowIcon = arrowType[arrowDirection].icon;

    arrowElement = `<div class='arrow arrow${accumulatorValue}'>${arrowIcon}</div>`;

    // Push Data to reference for future
    let arrowObject = {identifier: accumulatorValue, top: 0};
    arrowData[arrowDirection].push(arrowObject);

    $(`.column${cap(arrowDirection)}`).append(arrowElement);
    arrowType[arrowDirection].accumulator += 1;
};


// Insert Arrow Reference Data in array 

const arrowData = {
    "left": [
        {
            identifier: 0,
            top: 0,
        },
    ],
    "up": [
        {
            identifier: 0,
            top: 0,
        },
    ],
    "down": [
        {
            identifier: 0,
            top: 0,
        },
    ],
    "right": [
        {
            identifier: 0,
            top: 0,
        },
    ],
};

// 2. Make function which shifts the Arrow down:
//     - decrease the Y-axis coordinate values which loop at a set interval (to be determined).

// arrowPosition value may become nested to an array for each arrow "pushed" into the array. will always select the array[0]


// Will be declared assuming the browser height will not be changed after the page loads.
const containerHeight = parseInt($(".container").css("height").match(/[\.\d]/g).join(""));


// HMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// Run gravity() for each arrow?
function gravity() {
    let thisPosition = 0;

    //Find current arrow Y-axis
    $.each(arrowData, function(key, value) {
        let arrowPosition = 0;
        // console.log(value);
        $.each(value, function(key2, value2) {
            // console.log(value2);
            $(`.arrow${value2.identifier}`).css("top", `${value2.top + 1}px`);
            value2.top += 1;
        });
    });

    // target container-first. then check for first-of-type
    
    // thisPosition = $(`.column .arrow:first-of-type`).css("top");

    if (thisPosition > containerHeight) {
        $(`.arrow${value2.identifier}`).remove();
        score --;
        updateScore();
        appendArrow("left");
    };
};

setInterval(gravity, 0.05);


// 3. Make the following event handlers: 
//     - "down arrow" key is pressed on the keyboard
//     - mouseclick on hitrange container
//     - screentap of hitrange container
    
$(".catchSection").on("click tap", function() {
    rangeChecker("left");
});

$("body").keydown(function(e) {
    switch(e.key) {
        case "ArrowLeft":
            console.log("left");
            rangeChecker("left");
            break;
        case "ArrowUp" :
            console.log("up");
            rangeChecker("up");
            break;
        case "ArrowDown":
            console.log("down");
            rangeChecker("down");
            break;
        case "ArrowRight":
            console.log("right");
            rangeChecker("right");
            break;
    };
});

// To account for camelCase requirement, targetting classes
function cap(string) {
    return (string.substr(0, 1).toUpperCase() + string.substr(1));
};

// Will be declared assuming the browser height will not be changed after the page loads.
const catchPosition = parseInt($(`.column`).css("height").match(/[\.\d]/g).join(""));


function rangeChecker(arrowDirection) {
    // Target oldest existing appended arrow
    let arrowSelector = $(`.arrow${arrowData[arrowDirection][0][identifier]}`);

    arrowPosition = arrowData[arrowDirection][0][top];
    // css("top").match(/[\.\d]/g).join(""));

    if (arrowPosition > catchPosition) {
        $(arrowSelector).remove();
        appendArrow(arrowDirection);
        score ++;
        updateScore();
    } else {
        score --;
        updateScore();
    }
};


// 4. All 3 event handlers will:
//     - verify if the y-axis of the Arrow is within the "acceptable range (to be determined)" inside the hitrange container.

// 5. If the arrow is within the hit range
//     - make the arrow disappear & increase score counter by 1.
//         - else -> reduce score by 1 & arrow will continue to shift downwards.

// 6. If arrow falls off page, remove arrow.

// 7. repeat append Arrow "X" times;
