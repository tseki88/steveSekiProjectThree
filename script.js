// Stretch Goals
// x Score counter decrease on miss
// - More than 1 arrow at a time.
// - Increase to 4 columns(each with their own arrow - up down left right)
// - Space button to "pause" the game
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
        columnClass: ".column-left",
        accumulator: 0,
    },
    up: {
        icon: "<i class='far fa-arrow-alt-circle-up'></i>",
        keyValue: "ArrowUp",
        columnClass: ".column-up",
        accumulator: 0,
    },
    down: {
        icon: "<i class='far fa-arrow-alt-circle-down'></i>",
        keyValue: "ArrowDown",
        columnClass: ".column-down",
        accumulator: 0,
    },
    right: {
        icon: "<i class='far fa-arrow-alt-circle-right'></i>",
        keyValue: "ArrowRight",
        columnClass: ".column-right",
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

    $(`.column-${arrowDirection}`).append(arrowElement);
    arrowType[arrowDirection].accumulator += 1;
}


// Insert Arrow Reference Data in array 

const arrowData = {
    left: [],
    up: [],
    down: [],
    right: [],
};

// 2. Make function which shifts the Arrow down:
//     - decrease the Y-axis coordinate values which loop at a set interval (to be determined).

// arrowPosition value may become nested to an array for each arrow "pushed" into the array. will always select the array[0]

let arrowPosition = 0;

// Will be declared assuming the browser height will not be changed after the page loads.
let containerHeight = parseInt($(".container").css("height").match(/[\.\d]/g).join(""));

// Run gravity() for each arrow?
function gravity() {
    //Find current arrow Y-axis
    arrowPosition = parseInt($(".arrow").css("top").match(/[\.\d]/g).join(""));
    // let positionNumber = parseInt(arrowPosition.join(""));
    $(".arrow").css("top", `${arrowPosition + 1}px`);
    
    if (arrowPosition > containerHeight) {
        $(".arrow").remove();
        score --;
        updateScore();
        appendArrow("left");
    }
}

setInterval(gravity, 0.05);


// 3. Make the following event handlers: 
//     - "down arrow" key is pressed on the keyboard
//     - mouseclick on hitrange container
//     - screentap of hitrange container
    
$(".catchSection").on("click tap", function() {
    rangeChecker();
})

$("body").keydown(function(e) {
    if (e.key == "ArrowDown") {
        // console.log("DOWN");
        rangeChecker();
    }
})


function rangeChecker() {
    arrowPosition = parseInt($(".arrow").css("top").match(/[\.\d]/g).join(""));
    catchPosition = parseInt($(".column").css("height").match(/[\.\d]/g).join("")) * 0.95

    if (arrowPosition > catchPosition) {
        $(".arrow").remove();
        appendArrow("left");
        score ++;
        updateScore();
    } else {
        score --;
        updateScore();
    }
}


// 4. All 3 event handlers will:
//     - verify if the y-axis of the Arrow is within the "acceptable range (to be determined)" inside the hitrange container.

// 5. If the arrow is within the hit range
//     - make the arrow disappear & increase score counter by 1.
//         - else -> reduce score by 1 & arrow will continue to shift downwards.

// 6. If arrow falls off page, remove arrow.

// 7. repeat append Arrow "X" times;



