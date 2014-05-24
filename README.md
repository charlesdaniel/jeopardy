jeopardy
========

A very simple Jeopardy game UI thing I threw together for someone's presentation about health plan education. This is a static website (no dynamic backend server stuff needed). It uses Angular and Bootstrap to make a single page app. It basically consists of 2 parts, a Jeopardy game looking game board (the "Black/Blue" window)and a Jeopardy game host's interface window (the "gray" window)that communicates and controls the gameboard.

The basic idea is that you plug your laptop into a second screen/projector. Load up the index.html in a modern browser like Chrome. Then click the Open Gameboard and drag that new tab/window into the projected screen by itself and make it full screen there.

Then you can remotely control the gameboard by clicking on the various parts in the host window. The things you can do from the host's window include:

* You can change any of the team names by clicking the name in the host window and editing it, the name will be changed on the gameboard in real time. NOTE: Make sure you rename the teams before starting as the points are associated with the team name and will be reset to 0 if the team name changes midway.
* You can edit any of the points on any of the teams manually.
* You can click any of the dollar value screens in the host window and it will open up the question in the gameboard.
* Once a question is displayed a 30 second timer pops up on both windows after which the question will timeout and nobody gets/loses points.
* The host can pause/reset the timer at any time using the buttons on the host window.
* The host can mark which teams get or lose points as the question is displayed. Then when they click done the points are adjusted to reflect the change.

The questions and categories are easy to change. Simply open up the questions.js file and edit accordingly. It should be fairly self-explanitory: the categories array represents the order in which the categories are displayed, the questions data structure represents the category, points, question, answer.

TODO: There's no daily doubles or anything like that. Probably could add some show music and other things. Some more flashiness using css transitions or angular animations.
