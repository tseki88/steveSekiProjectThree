// Stretch Goals
// x Score counter decrease on miss
// x More than 1 arrow at a time.
// x Increase to 4 columns(each with their own arrow - up down left right)
// x animation to show that an event handler took place
// x Space button to "pause" the game
// x Start Menu - start with interval not set.
// - Workaround for mobile (touchstart and click register as 2 events at the moment, resulting in -2 points when clicked too early)
// - button for pause
// - Win / GameOver conditions..?
// - make sure to init() / document ready
// - Add sound for when eventlistener triggers ? hit : miss;
// - Difficulty Levels(rate increase for speed, # of arrows appended)
// - Combo multiplier



// Sound File Credits:
//  - Michel Baradari
//      - tick.wav
//      - flagdrop.wav
//  - Space shooter sound fx pack 1 by Dravenx
//      - hit.wav
//      - miss.wav
//      - gameover.wav


$(document).ready(function() {
    
    const app = {};

    app.init = function() {

    };

    // Objects involved: 
    //  - Parent Container
    //  - Arrow
    //  - "hit" range container

    //  - score counter
    let score = 0;
    const scoreSelector = $(".scoreboard");

    function updateScore() {
        scoreSelector.text(score);
    };


    // Arrow Type HTML Reference Object
    // Accumulator used to add reference for each new arrow
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


    // Insert Arrow Reference Data
    // Keeps track of each arrow position, and the ID to reference which arrow
    const arrowData = {
        left: [
            {
                identifier: 0,
                top: 0,
            },
        ],
        up: [
            {
                identifier: 0,
                top: 0,
            },
        ],
        down: [
            {
                identifier: 0,
                top: 0,
            },
        ],
        right: [
            {
                identifier: 0,
                top: 0,
            },
        ],
    };



    // Append arrow element
    let arrowElement = "";

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
        arrowType[arrowDirection].accumulator++;
    };


    // Start Button
    $(".startButton").on("click", function() {
        startApp();
        this.off();
    });

    // Space Button to Start Game for Accessibility
    $("body").on("keydown", function(e) {
        switch (e.key) {
            case "spacebar":
                startApp();
                break;
            case " ":
                startApp();
                break;
        };
    });

    function startApp() {
        // Disable Spacebar to prevent looping of startApp();
        $("body").off("keydown");

        $(".startScreen").html("<p class='countdown'>Beginning Game</p>");
        setTimeout(() => {
            $(".startScreen").html("<p class='countdown'>3</p>").delay(1000);
        }, 1000);
        setTimeout(() => {
            $(".startScreen").html("<p class='countdown'>2</p>").delay(1000);
        }, 2000);
        setTimeout(() => {
            $(".startScreen").html("<p class='countdown'>1</p>").delay(1000);
        }, 3000);
        setTimeout(() => {
            $(".startScreen").html("<p class='countdown'>Go!</p>").delay(1000);
        }, 4000);
        setTimeout(() => {
            $(".startScreen").hide();
            arrowAppendInterval = setInterval(arrowAppender, appenderRng() * 100);
            gravityInterval = setInterval(gravity, 0.05);
            pauseArrow = false;
            pauseGravity = false;
            enableEvents();
        }, 5000);
    }


    // function which shifts the Arrow down:

    // Will be declared assuming the browser height will not be changed after the page loads.
    const containerHeight = parseInt($(".container").css("height").match(/[\.\d]/g).join(""));

    function gravity() {
        let thisPosition = 0;

        //Find current arrow Y-axis
        $.each(arrowData, function(key, value) {
            if (value.length !== 0) {
                // for each arrow reference
                $.each(value, function(key2, value2) {
                    $(`.column${cap(key)} .arrow${value2.identifier}`).css("top", `${value2.top + 1}px`);
                    value2.top++;
                });
                
                thisPosition = $(`.column${cap(key)} .arrow:first-of-type`).css("top").match(/[\.\d]/g).join("");

                if (thisPosition > containerHeight) {
                    $(`.column${cap(key)} .arrow:first-of-type`).remove();
                    arrowData[key].shift();
                    score--;
                    updateScore();
                };
            };
        });
    };

    let gravityInterval = "";
    // setInterval(gravity, 0.05);

    // Make appender object
    function appenderRng() {
        return Math.floor(Math.random() * 10);
    };

    function arrowAppender() {
        let arrowTypeRng = Math.floor(Math.random() * 4);

        switch(arrowTypeRng) {
            case 0:
                appendArrow("left");
                break;
            case 1:
                appendArrow("up");
                break;
            case 2:
                appendArrow("down");
                break;
            case 3:
                appendArrow("right");
                break;
        };
    };

    let arrowAppendInterval = "";
    // setInterval(arrowAppender, appenderRng() * 100);


    // Pause Functionality
    let pauseArrow = true;
    let pauseGravity = true;

    function pauseInterval() {
        if (pauseArrow === true) {
            arrowAppendInterval = setInterval(arrowAppender, appenderRng() * 100);
            pauseArrow = false;
        } else if (pauseArrow === false) {
            clearInterval(arrowAppendInterval);
            pauseArrow = true;
        }

        if (pauseGravity === true) {
            gravityInterval = setInterval(gravity, 0.05);
            pauseGravity = false;
        } else if (pauseGravity === false) {
            clearInterval(gravityInterval);
            pauseGravity = true;
        }
    };

    //Event Handlers
    
    // if() statement used to mitigate issue on mobile registering this event twice.
    function enableEvents() {

        $(".catchSection i").on("click touchend", function(e) {
            let catchDirection = e.target["attributes"]["data-direction"]["nodeValue"];
            if (e.type == "touchend") {
                switch (catchDirection) {
                    case "left":
                        rangeChecker("left");
                        break;
                    case "up":
                        rangeChecker("up");
                        break;
                    case "down":
                        rangeChecker("down");
                        break;
                    case "right":
                        rangeChecker("right");
                        break;
                };
            } else if (e.type == "click") {
                switch (catchDirection) {
                    case "left":
                        rangeChecker("left");
                        break;
                    case "up":
                        rangeChecker("up");
                        break;
                    case "down":
                        rangeChecker("down");
                        break;
                    case "right":
                        rangeChecker("right");
                        break;
                };
            };
        });

        $("body").keydown(function(e) {
            switch(e.key) {
                case "ArrowLeft":
                    rangeChecker("left");
                    break;
                case "ArrowUp" :
                    rangeChecker("up");
                    break;
                case "ArrowDown":
                    rangeChecker("down");
                    break;
                case "ArrowRight":
                    rangeChecker("right");
                    break;
                case " ":
                    pauseInterval();
                    break;
                case "Spacebar":
                    pauseInterval();
                    break;
            };
        });
    };
    // To account for camelCase requirement, targetting classes
    function cap(string) {
        return (string.substr(0, 1).toUpperCase() + string.substr(1));
    };

    function animator(query, animateClass) {
        $(query).addClass(animateClass);
        $(query).on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function() {
            $(query).removeClass(animateClass);
        });
    };

    let arrowPosition = 0;

    // Will be declared assuming the browser height will not be changed after the page loads.
    const catchPosition = parseInt($(`.column`).css("height").match(/[\.\d]/g).join(""));

    function rangeChecker(arrowDirection) {
        // Target oldest existing appended arrow
        let arrowSelector = $(`.column${cap(arrowDirection)} .arrow:first-of-type`);

        if (arrowData[arrowDirection].length !== 0) {

            arrowPosition = arrowSelector.css("top").match(/[\.\d]/g).join("");
            
            if (arrowPosition > catchPosition) {
                animator($(`.catch${cap(arrowDirection)}`), "pulse-green");
                $(arrowSelector).remove();
                arrowData[arrowDirection].shift();
                score ++;
                updateScore();
            } else {
                animator($(`.catch${cap(arrowDirection)}`), "pulse-red");
                score --;
                updateScore();
            }
        };
    };
});