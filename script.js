// Stretch Goals
// x Score counter decrease on miss
// x More than 1 arrow at a time.
// x Increase to 4 columns(each with their own arrow - up down left right)
// x animation to show that an event handler took place
// x Space button to "pause" the game
// x Start Menu - start with interval not set.
// x Workaround for mobile (touchstart and click register as 2 events at the moment, resulting in -2 points when clicked too early)
// x button for pause
// x Win / GameOver conditions..?
// - make sure to init() / document ready
// x Add sound for when eventlistener triggers ? hit : miss;
// - Difficulty Levels(rate increase for speed, # of arrows appended)
// - Combo multiplier



// Sound File Credits:
//  - Michel Baradari
//      - tick.wav
//      - flagdrop.wav
//      - resume.wav
//  - Space shooter sound fx pack 1 by Dravenx
//      - hit.wav
//      - miss.wav
//      - gameover.wav
//      - pause.wav


$(document).ready(function() {
    
    const app = {};

    app.init = function() {
    };
    
    startEventHandler();
    // app.init();

    // HP counter
    let hp = 20;
    const hpSelector = $(".hpStatus");

    function updateHp() {
        hpSelector.text(hp);

        if (hp == 0) {
            gameOver();
        } else if (hp < 6) {
            hpSelector.css("color", "red");
        } else if (hp < 11) {
            hpSelector.css("color", "yellow");
        } else {
            hpSelector.css("color", "greenyellow");
        }
    };

    function eventDisabler() {
        $("body").off();
        $(".catchSection i").off();
    }


    function gameOver() {
        eventDisabler();
        pauseSelect.off();
        countScreenSelector.hide();
        $(".finalScore").text(score);
        $(".endScreen").show();
        playSound("gameover");

        clearInterval(gravityInterval);
        pauseGravity = true;
        clearInterval(arrowAppendInterval);
        pauseArrow = true;
        arrowType["left"]["accumulator"] = 0;
        arrowType["up"]["accumulator"] = 0;
        arrowType["down"]["accumulator"] = 0;
        arrowType["right"]["accumulator"] = 0;
        arrowData["left"] = [];
        arrowData["up"] = [];
        arrowData["down"] = [];
        arrowData["right"] = [];

        // Reset Button
        $(".resetButton").on("click", function () {
            resetApp();
        });
    
        // Space Button to Start Game for Accessibility
        $("body").on("keydown", function (e) {
            switch (e.key) {
                case "spacebar":
                    resetApp();
                    break;
                case " ":
                    resetApp();
                    break;
            };
        });
    }


    // Reset App
    function resetApp() {
        $(".column").html("");
        score = 0;
        updateScore();
        hp = 20;
        updateHp();
        $(".endScreen").hide();
        $(".startScreen").show();
        playSound("resume");
        startEventHandler();
    };

    // Score counter
    let score = 0;
    const scoreSelector = $(".scoreStatus");

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
            soundFile: "hit1",
        },
        up: {
            icon: "<i class='far fa-arrow-alt-circle-up'></i>",
            keyValue: "ArrowUp",
            columnClass: ".columnUp",
            accumulator: 0,
            soundFile: "hit2",
        },
        down: {
            icon: "<i class='far fa-arrow-alt-circle-down'></i>",
            keyValue: "ArrowDown",
            columnClass: ".columnDown",
            accumulator: 0,
            soundFile: "hit3",
        },
        right: {
            icon: "<i class='far fa-arrow-alt-circle-right'></i>",
            keyValue: "ArrowRight",
            columnClass: ".columnRight",
            accumulator: 0,
            soundFile: "hit4",
        },
        pause: {
            icon: "<i class='fas fa-pause'></i>",
            color: "red"
        },
        resume: {
            icon: "<i class='fas fa-play'></i>",
            color: "green"
        },
    };


    // Insert Arrow Reference Data
    // Keeps track of each arrow position, and the ID to reference which arrow
    const arrowData = {
        left: [],
        up: [],
        down: [],
        right: [],
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


    function startEventHandler() {
        // Start Button
        $(".startButton").on("click", function() {
            startApp();
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
    }
                
    const countScreenSelector = $(".countScreen");

    function startApp() {
        // Disable Spacebar to prevent looping of startApp();
        $("body").off();
        $(".startScreen").hide();
        countScreenSelector.show();

        countScreenSelector.html("<p class='countdown'>Initializing...</p>");
        setTimeout(() => {
            countScreenSelector.html("<p class='countdown'>3</p>").delay(1000);
            playSound("tick");
        }, 1000);
        setTimeout(() => {
            countScreenSelector.html("<p class='countdown'>2</p>").delay(1000);
            playSound("tick");
        }, 2000);
        setTimeout(() => {
            countScreenSelector.html("<p class='countdown'>1</p>").delay(1000);
            playSound("tick");
        }, 3000);
        setTimeout(() => {
            countScreenSelector.html("<p class='countdown'>--begin--</p>").delay(1000);
            playSound("begin");
        }, 4000);
        setTimeout(() => {
            countScreenSelector.hide();
            arrowAppendInterval = setInterval(arrowAppender, 800);
            gravityInterval = setInterval(gravity, 0.05);
            pauseArrow = false;
            pauseGravity = false;
            enableEvents();
            pauseEventEnabler();
            pauseIcon("pause");
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
                    hp--;
                    updateHp();
                };
            };
        });
    };

    let gravityInterval = "";
    // setInterval(gravity, 0.05);

    // Make appender object
    // function appenderRng() {
    //     return Math.floor(Math.random() * 10);
    // };

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


    // **SECTION** - Pause Functionality
    let pauseArrow = true;
    let pauseGravity = true;

    // Pause Button Updater
    const pauseSelect = $(".pause");

    function pauseIcon(status) {
        pauseSelect.css(`background-color`, `${arrowType[status].color}`);
        pauseSelect.html(arrowType[status].icon);
    };

    // Pause Funciton
    function pauseInterval() {
        if (pauseArrow === true) {
            playSound("resume");
            pauseIcon("pause");
            enableEvents();
            arrowAppendInterval = setInterval(arrowAppender, 800);
            countScreenSelector.hide();
            pauseArrow = false;
        } else if (pauseArrow === false) {
            playSound("pause")
            pauseIcon("resume");
            eventDisabler();
            clearInterval(arrowAppendInterval);
            pauseEventEnabler();
            countScreenSelector.html("<p class='countdown'>PAUSED</p>");
            countScreenSelector.show();
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
    
    function pauseEventEnabler() {
        pauseSelect.on("touchstart mouseup", function(e) {
            if (e.type == "touchstart") {
                e.preventDefault();
                pauseInterval();
            } else if (e.type == "mouseup") {
                pauseInterval();
            };
        });

        $("body").keydown(function (e) {
            switch (e.key) {
                case " ":
                    pauseInterval();
                    break;
                case "Spacebar":
                    pauseInterval();
                    break;
            };
        });
    }

    // if() statement used to mitigate issue on mobile registering this event twice.
    function enableEvents() {

        $(".catchSection i").on("touchstart mouseup", function(e) {
            let catchDirection = e.target["attributes"]["data-direction"]["nodeValue"];
            if (e.type == "touchstart") {
                e.preventDefault();
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
            } else if (e.type == "mouseup") {
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
                // case " ":
                //     pauseInterval();
                //     break;
                // case "Spacebar":
                //     pauseInterval();
                //     break;
            };
        });
    };


    function playSound(condition) {
        let sound = $(`#${condition}`);
        sound.get(0).currentTime = 0;
        sound.get(0).play();
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
                playSound(`${arrowType[arrowDirection].soundFile}`);
                animator($(`.catch${cap(arrowDirection)}`), "pulse-green");
                $(arrowSelector).remove();
                arrowData[arrowDirection].shift();
                score ++;
                updateScore();
            } else {
                animator($(`.catch${cap(arrowDirection)}`), "pulse-red");
                playSound("miss");
                score --;
                updateScore();
                hp --;
                updateHp();
            }
        };
    };
});