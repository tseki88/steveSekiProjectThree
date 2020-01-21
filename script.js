// Your web app's Firebase configuration

// ** NOTICE **
// I am aware that it is not a good practice to place the apiKey within public view.
// The Firebase Key is stored here for this project's purposes, as proof of concept on utilizing the firebase database integrated into this project.
// This course did not cover the ways to 'hide' this data from the public, and is not sensitive data.
const firebaseConfig = {
    apiKey: "AIzaSyACYzCfe400d6NXHk031R15QQiMfyIA7ss",
    authDomain: "ludr-high-score.firebaseapp.com",
    databaseURL: "https://ludr-high-score.firebaseio.com",
    projectId: "ludr-high-score",
    storageBucket: "ludr-high-score.appspot.com",
    messagingSenderId: "353061442545",
    appId: "1:353061442545:web:d1a3b0a720122de201aa50"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

$(document).ready(function() {
    
    const dbRef = firebase.database().ref();
    const app = {};
    
    app.init = function() {
        startEventHandler();
        dbRef.on('value', (data) => {
            normalLeaderBoard = [];
            hardLeaderBoard = [];
            exLeaderBoard = [];
            $.each(data.val(), function(key, value) {
                switch (value.mode) {
                    case "Normal":
                        normalLeaderBoard.push(value);
                        break;
                    case "Hard":
                        hardLeaderBoard.push(value);
                        break;
                    case "EX":
                        exLeaderBoard.push(value);
                        break;
                };
            });
        });
    };
    
    app.init();

    // HP counter
    let hp = 30;
    const hpSelector = $(".hpStatus");

    function updateHp() {
        hpSelector.text(hp);

        if (hp == 0) {
            gameOver();
        } else if (hp < 11) {
            hpSelector.css("color", "red");
        } else if (hp < 21) {
            hpSelector.css("color", "yellow");
        } else {
            hpSelector.css("color", "greenyellow");
        }
    };

    function eventDisabler() {
        $("body").off();
        $(".catchSection i").off();
    }

    function submitHiScore() {
        $("input[type=submit]").on("click submit", function(e) {
            e.preventDefault();
            let formName = $("#name").val();
            dbRef.push({
                "player": formName,
                "score": score,
                "mode": gameMode,
            });
            $(".submitForm").hide();
            $("input[type=submit]").off();
        });
    };

    function gameOver() {
        $(".submitForm").show();
        eventDisabler();
        pauseSelect.off();
        countScreenSelector.hide();
        submitHiScore();
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
        $(".resetButton").off();
        $(".resetButton").on("click", function () {
            resetApp();
        });
    }

    let normalLeaderBoard = [];
    let hardLeaderBoard = [];
    let exLeaderBoard = [];

    // Future Note: To sort and push top 5 for each difficulty level directly to the DB, cleans up unused data entries and more better performance.
    function displayLeaderBoard() {
        $(".startScreen").hide();
        
        $(".back").on("click", function() {
            $(".leaderBoardScreen").hide();
            $(".startScreen").show();
        })

        sortArray(normalLeaderBoard);
        sortArray(hardLeaderBoard);
        sortArray(exLeaderBoard);

        $(".boardNormal").empty();
        $(".boardHard").empty();
        $(".boardEX").empty();

        renderLeaderBoard(".boardNormal", normalLeaderBoard);
        renderLeaderBoard(".boardHard", hardLeaderBoard);
        renderLeaderBoard(".boardEX", exLeaderBoard);
        
        $(".leaderBoardScreen").show();
    }

    function sortArray(array) {
        array.sort(function(a, b) {
            return b.score - a.score;
        });
    };

    function renderLeaderBoard(target, array) {
        if (array.length < 5) {
            for (let i = 0; i < array.length; i++){
                $(`${target}`).append(`
                    <li>${array[i].player.toUpperCase()}  :  ${array[i].score}</li>`);
            };    
        } else {
            for (let i = 0; i < 5; i++){
                $(`${target}`).append(`
                    <li>${array[i].player.toUpperCase()}  :  ${array[i].score}</li>`);
            };
        }
    };

    $(".leaderBoardButton").on("click", function() {
        displayLeaderBoard();
    });

    // Reset App
    function resetApp() {
        $(".column").html("");
        score = 0;
        updateScore();
        hp = 30;
        updateHp();
        countScreenSelector.hide();
        $(".endScreen").hide();
        $(".startScreen").show();
        playSound("resume");
        $(".startButton").off();
        $(".startButtonHard").off();
        $(".startButtonEX").off();
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

    let appendForce = 0;
    let gameMode = "";

    function startEventHandler() {
        // Start Button

        $(".startButton").on("click", function() {
            appendForce = 500;
            gameMode = "Normal";
            $(".container").css("transform", "rotateX(5deg) scaleY(1)");
            startApp(appendForce);
        });

        $(".startButtonHard").on("click", function () {
            appendForce = 350;
            gameMode = "Hard",
            $(".container").css("transform", "rotateX(25deg) scaleY(1.4)");
            startApp(appendForce);
        });

        $(".startButtonEX").on("click", function() {
            appendForce = 200;
            gameMode = "EX";
            $(".container").css("transform", "rotateX(50deg) scaleY(1.9)");
            startApp(appendForce);
        })

        // Space Button to Start Game for Accessibility
        $("body").on("keydown", function(e) {
            appendForce = 500;
            gameMode = "Normal";
            if (e.key === "spacebar" || e.key === " ") {
                startApp();
            }
        });
    }
    
    const countScreenSelector = $(".countScreen");

    function startApp() {
        // Disable Spacebar to prevent looping of startApp();
        $("body").off();
        $(".startScreen").hide();
        $(".difficulty").text(gameMode);
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
            arrowAppendInterval = setInterval(arrowAppender, appendForce);
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
    let containerHeight = parseInt($(".container").css("height").match(/[\.\d]/g).join(""));

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
                    playSound("miss");
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
            arrowAppendInterval = setInterval(arrowAppender, appendForce);
            countScreenSelector.hide();
            pauseArrow = !pauseArrow;
        } else if (pauseArrow === false) {
            playSound("pause")
            pauseIcon("resume");
            eventDisabler();
            clearInterval(arrowAppendInterval);
            pauseEventEnabler();
            countScreenSelector.html(`
                <p class='countdown'>PAUSED</p>
                <p>Difficulty: <span class="difficulty"></span></p>
                <p>*to resume press the top right button <span class="mobileHide"> or the space button</span></p>
                <button type="button" class="resetButton">Restart</button>`);
            $(".difficulty").text(gameMode);
            $(".resetButton").off();
            $(".resetButton").on("click", function () {
                gameOver();
            });
            countScreenSelector.show();
            pauseArrow = !pauseArrow;
        }

        if (pauseGravity === true) {
            gravityInterval = setInterval(gravity, 0.05);
            pauseGravity = !pauseGravity;
        } else if (pauseGravity === false) {
            clearInterval(gravityInterval);
            pauseGravity = !pauseGravity;
        }
    };
    

    //Event Handlers
    
    function pauseEventEnabler() {

        pauseSelect.off();

        pauseSelect.on("touchstart mouseup", function(e) {
            if (e.type === "touchstart" || e.type === "mouseup") {
                e.preventDefault();
                pauseInterval();
            }
        });

        $("body").keydown(function (e) {
            if (e.key === " " || e.key === "Spacebar") {
                pauseInterval();
            }
        });
    }

    // if() statement used to mitigate issue on mobile registering this event twice.
    function enableEvents() {

        $(".catchSection i").off();

        $(".catchSection i").on("touchstart mouseup", function(e) {
            let catchDirection = e.target["attributes"]["data-direction"]["nodeValue"];
            if (e.type === "touchstart" || e.type === "mouseup") {
                e.preventDefault();
                rangeChecker(catchDirection);
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
            
            if (arrowPosition > (catchPosition - 20)) {
                playSound(`${arrowType[arrowDirection].soundFile}`);
                animator($(`.catch${cap(arrowDirection)}`), "pulse-green");
                $(arrowSelector).remove();
                arrowData[arrowDirection].shift();
                score++;
                updateScore();
            } else {
                animator($(`.catch${cap(arrowDirection)}`), "pulse-red");
                playSound("miss");
                score--;
                updateScore();
                hp--;
                updateHp();
            }
        };
    };
});