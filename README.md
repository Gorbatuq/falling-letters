# Falling Letters Stylish Rank Game

Plain HTML/CSS/JavaScript version split into readable files. No build step and no dependencies except Google Fonts.

## Gameplay rules

Press "Start Mission" to begin the game.
The session lasts 20 seconds.
Letters fall inside the game area.
Press the matching keyboard key to collect a letter.
Golden letters are faster, less frequent, and give double points.
After the session ends, the result screen shows the final score breakdown.
Scoring
Normal letter: 100 points
Golden letter: 200 points

Final score formula:
final score = total points + (golden letters × golden letter price)

The rank system does not affect scoring and is used only for visual feedback.

## Run

Open `index.html`, or run it through Live Server / any static server.

The JavaScript files are classic deferred scripts, not ES modules. Their order in `index.html` matters.

## File structure

```text
index.html
src/
  styles/
    main.css
    01-base.css
    02-layout.css
    03-rank.css
    04-components.css
    05-effects.css
    06-animations.css
    07-responsive.css
  js/
    01-config.js
    02-dom.js
    03-state.js
    04-helpers.js
    05-score-rank.js
    06-ui.js
    07-letters.js
    08-input-scoring.js
    09-particles.js
    10-final-sequence.js
    11-game-loop.js
```

## Design decisions

I treated the task as a casino slot bonus mini-game, not as a standalone typing game. The falling-letter mechanic is the core interaction, but the main focus is on short-session engagement, pressure, reward feedback, and a clear final result screen.

Golden letters work as rare high-value targets. They are less frequent and faster than normal letters, but give double points. This creates a simple risk/reward mechanic similar to bonus symbols in slot games.

The rank system adds a second layer of challenge during the 20-second session. Successful hits increase the rank, while inactivity and wrong inputs reduce it. The rank does not change the final score;
it works as a visual performance indicator and keeps the player chasing a better result.

Wrong key input does not subtract score. It affects rank progression and triggers stronger visual feedback, so mistakes feel noticeable without making the score formula harder to understand.

Visual effects are part of the gameplay feedback. Hits, misses, golden letters, rank changes, and the final result screen all have separate responses to make the session feel more like a real casino mini-game rather than a plain typing exercise.

The project is built with vanilla HTML, CSS, and JavaScript. The only external resource is Google Fonts.

## Future improvements

- Add sound effects and background music for stronger game feedback.
- Add custom assets, illustrated backgrounds, and more polished rank animations.
- Improve responsive behavior for different screen sizes.
- Add stronger rank presentation during the session and on the final result screen.
- If changing the scoring formula is allowed, connect the rank system directly to scoring, for example through rank-based score multipliers.
- If rank-based scoring is used, increase falling speed with higher ranks to balance the higher reward with higher difficulty.

## Platform notes

The game is designed primarily for desktop keyboard input. The layout has basic responsive behavior, but the core gameplay expects a physical keyboard.
# falling-letters
