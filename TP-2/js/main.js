import { Game } from "./game.js";

const canvas = document.getElementById("canvas")

const game =  new Game(canvas);

game.startGame();