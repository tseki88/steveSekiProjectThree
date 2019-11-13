# Project 3 Proposal

## Description
Object of Up Down Left Right linked to arrow key on keyboard (add clickable buttons for accessibility for each);
Append arrow at Top.
The arrows will fall down from top to bottom, each belonging to their own column.
falling Arrows will be position absolute, with top bottom starting at a fixed point.
the Y axis as is scrolls will add the same value to Y top and bottom to recreate the falling motion.
setInterval()
On the bottom, there will be an arrowObject to 'catch' the falling arrows.
If the user presses the appropriate position absolute arrow on keyboard when the Y position of the falling arrow matches (or close to with some variance) a score will be generated and added to the score board.

Once the arrow falls off the page, it will be removed to prevent further processing.

the score will be based on the values assigned to TOP or BOTTOM

If missed, the score will go down (to a min of 0).


## MVP
- 1 object moving from top to bottom. press the down arrow key on keyboard (or click / tap on hitrange container), when it falls into a certain range within a "hit" box to register. Score counter to increase when hit.


## Stretch Goal: 
- Score counter decrease on miss
- More than 1 arrow at a time.
- Increase to 4 columns (each with their own arrow - up down left right)
- Space button to "pause" the game
- Combo multiplier
- Difficulty Levels (rate increase for speed, # of arrows appended)


## Pseudocode

### Objects involved: 
- Parent Container
- Arrow
- "hit" range container
- score counter


1. Find and select the parent container
    - then append Arrow (div with class .arrow) at top of page.
    - Arrow will be position absolute
    - Arrow will have a top and bottom value set. (aka Y-axis coordinates).

2. Make function which shifts the Arrow down:
    - decrease the Y-axis coordinate values which loop at a set interval (to be determined).

3. Make the following event handlers: 
    - "down arrow" key is pressed on the keyboard
    - mouseclick on hitrange container
    - screentap of hitrange container

4. All 3 event handlers will:
    - verify if the y-axis of the Arrow is within the "acceptable range (to be determined)" inside the hitrange container.

5. If the arrow is within the hit range
    - make the arrow disappear & increase score counter value by 1 and update score display.
        - else -> arrow will continue to shift downwards.

6. If arrow falls off page, remove arrow.

7. repeat append Arrow "X" times (tbd);