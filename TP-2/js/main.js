import { GameBoard } from "./gameBoard.js";
import { Game } from "./game.js";
import { Token } from "./token.js";

document.addEventListener("DOMContentLoaded", ()=> {
    
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width  = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;
    canvas.width  = width;
    canvas.height = height;
    
document.querySelector("#btn-start").addEventListener("click", ()=> {
        let colors = {
            success: "#198754",
            danger: "#DC3545",
            primary: "#0D6EFD",
            warning: "#FFC107",
            light: "#F8F9FA",
            secondary: "#6C757D",
        }
        let gameBoardSize = document.querySelector("#input-game-board-size").value;
        let lineTokeNumber = document.querySelector("#input-line-token-number").value;
        let p1Color = document.querySelector("#player-1").getAttribute("data-color");
        let p2Color = document.querySelector("#player-2").getAttribute("data-color");
        let p1Img = "../TP-2/"+ document.querySelector("#player-1 .active img").getAttribute("src");
        let p2Img = "../TP-2/"+ document.querySelector("#player-2 .active img").getAttribute("src");
        const img1 = new Image();
        img1.src = p1Img;
        const img2 = new Image();
        img2.src = p2Img;
        const game = instantiateGame(gameBoardSize, lineTokeNumber, colors[p1Color], colors[p2Color], img1, img2);
        let idAnimation = window.requestAnimationFrame(game.drawGame.bind(game));

        game.startGame();

    });

    function instantiateGame(tileNum, lineTokenNumber, player1Color, player2Color, player1Img, player2Img) {
        tileNum =  (tileNum < lineTokenNumber) ? lineTokenNumber : tileNum; 
        let {tileSize, tokenSize, gameBoardSquareCoordinate, player1SquareCoordinate, player2SquareCoordinate} = calculateObjectSize(tileNum);

        let instantiateToken = (cant, coordinates, color, img) => {
            let tokens = [];
            for (let i = 0; i < cant; i++) {
                tokens.push(new Token(coordinates, color, img, tokenSize, canvas.getContext('2d')));
            }
            return tokens
        };

        let playerTokenNum = (tileNum * tileNum)/2;

        let player1 = instantiateToken(playerTokenNum, player1SquareCoordinate, player1Color, player1Img);
        let player2 = instantiateToken(playerTokenNum, player2SquareCoordinate, player2Color, player2Img);
        let gameBoard =  new GameBoard(gameBoardSquareCoordinate, tileNum, tileNum, tileSize, lineTokenNumber, null, 0, ctx);
        
        return new Game(canvas, gameBoard, player1, player2); 
    }

    function calculateObjectSize(tileNum) {
        let gameBoardIsHorizontal =  width > height;
        let minSize = gameBoardIsHorizontal ? height : width;
        let maxSize = gameBoardIsHorizontal ? width  : height;
        let tileSize = minSize / tileNum;
        let tokenSize = (tileSize - 1) / 2;
        let gameBoardSize = (tileSize * tileNum);

        let gameBoardSquareCoordinate = {
            x1: (gameBoardIsHorizontal ?  ((maxSize - gameBoardSize)/2) : 0), 
            x2: (gameBoardIsHorizontal ? (((maxSize - gameBoardSize)/2) + gameBoardSize) : gameBoardSize), 
            y1: 0,
            y2: gameBoardSize,
        };

        let player1SquareCoordinate = {
            x1: 0,
            x2: (gameBoardIsHorizontal ? gameBoardSquareCoordinate.x1 : width/2),
            y1: (gameBoardIsHorizontal ? 0 : gameBoardSize),
            y2: height 
        };

        let player2SquareCoordinate = {
            x1: (gameBoardIsHorizontal ? gameBoardSquareCoordinate.x2 : width/2),
            x2: width,
            y1: (gameBoardIsHorizontal ? 0 : gameBoardSize),
            y2: height 
        };
        return {tileSize, tokenSize, gameBoardSquareCoordinate, player1SquareCoordinate, player2SquareCoordinate};
    }
    
    (function() {
        let colors = ["#198754", "#DC3545", "#0D6EFD", "#FFC107", "#F8F9FA", "#6C757D"];
        const p1Img = document.querySelector("#player-1");
        const p2img = document.querySelector("#player-2");
        document.querySelectorAll(".color").forEach( btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                let newColor = e.target.getAttribute("data-color");
               if(p1Img.getAttribute("data-color")!=newColor && p2img.getAttribute("data-color")!=newColor) {
                   let playerId = e.currentTarget.getAttribute("data-color-target");
                   let playerSelected = document.querySelector(playerId);
                   let oldColor = playerSelected.getAttribute("data-color");
                   playerSelected.setAttribute("data-color", newColor);
                   document.querySelectorAll('.color > [data-color="'+oldColor+'"]').forEach(btn=>btn.classList.toggle("d-none"));
                   document.querySelectorAll('.color > [data-color="'+newColor+'"]').forEach(btn=>btn.classList.toggle("d-none"));
               }
            });
        });
    })();

});