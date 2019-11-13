// Stretch Goal: 
//  - More than 1 arrow at a time.
//  - Increase to 4 columns (each with their own arrow - up down left right)
//  - Space button to "pause" the game
//  - Combo multiplier
//  - Difficulty Levels (rate increase for speed, # of arrows appended)


// MVP
//  - 1 object moving from top to bottom. press an arrow key on keyboard associated, when it falls into a certain range within a "hit" box to register.


// Pseudocode

// Objects involved: 
//  - Parent Container
//  - Arrow
//  - "hit" range container

//  - score counter
let score = 0;


// 1. Find and select the parent container
//     - then append Arrow (div with class .arrow) at top of page.
//     - Arrow will be position absolute
//     - Arrow will have a top and bottom value set. (aka Y-axis coordinates).
// Arrow Font Awesome Reference Object
const arrowType = {
    up: {
        icon: "<i class='far fa-arrow-alt-circle-up'></i>",
        keyValue: "ArrowUp",
    },
    right: {
        icon: "<i class='far fa-arrow-alt-circle-right'></i>",
        keyValue: "ArrowRight",
    },
    down: {
        icon: "<i class='far fa-arrow-alt-circle-down'></i>",
        keyValue: "ArrowDown",
    },
    left: {
        icon: "<i class='far fa-arrow-alt-circle-left'></i>",
        keyValue: "ArrowLeft",
    },
};

let arrowObject = `<div class='arrow'>${arrowType.down.icon}</div>`;

function appendArrow() {
    $(".slider").append(arrowObject);
}


// 2. Make function which shifts the Arrow down:
//     - decrease the Y-axis coordinate values which loop at a set interval (to be determined).

// arrowPosition value may become nested to an array for each arrow "pushed" into the array. will always select the array[0]
let arrowPosition = 0;
let containerHeight = 0;


function gravity() {
    arrowPosition = $(".arrow").css("top").match(/\d/g);
    let positionNumber = parseInt(arrowPosition.join(""));
    $(".arrow").css("top", `${positionNumber + 1}px`);
    
    containerHeight = $(".container").css("height").match(/\d/g);
    let heightNumber = parseInt(containerHeight.join(""));
    if (positionNumber > heightNumber) {
        $(".arrow").remove();
        appendArrow();
    }

    // rangeChecker();
}

setInterval(gravity, 0.05);


// 3. Make the following event handlers: 
//     - "down arrow" key is pressed on the keyboard
//     - mouseclick on hitrange container
//     - screentap of hitrange container
    
$(".catch").on("click tap", function() {
    console.log("event triggered");
    rangeChecker();
})

$("body").keydown(function(e) {
    if (e.key == "ArrowDown") {
        console.log("DOWN");
        rangeChecker();
    } else {
        console.log("hm");
    }
})


function rangeChecker() {
    if (parseInt(arrowPosition.join("")) > ((parseInt(containerHeight.join(""))) - (parseInt($(".catch").css("height").match(/\d/g).join("")) / 10))) {
        // console.log((parseInt($(".catch").css("height").match(/\d/g).join(""))));
        $(".arrow").remove();
        appendArrow();
        score ++;
        $(".scoreboard").text(score);
    } else {
        score --;
        $(".scoreboard").text(score);
    }
}


// 4. All 3 event handlers will:
//     - verify if the y-axis of the Arrow is within the "acceptable range (to be determined)" inside the hitrange container.

// 5. If the arrow is within the hit range
//     - make the arrow disappear & increase score counter by 1.
//         - else -> reduce score by 1 & arrow will continue to shift downwards.

// 6. If arrow falls off page, remove arrow.

// 7. repeat append Arrow "X" times;



