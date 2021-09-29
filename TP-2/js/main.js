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
    
    const img = new Image()
    img.src = "../TP-2/img/token_1.png"
    img.addEventListener("load", ()=> {     
        const game = instantiateGame(8, 2, "red", "blue", img) 
        let idAnimation = window.requestAnimationFrame(game.drawGame.bind(game));
        
        game.startGame();

    });

    function instantiateGame(tileNum, lineTokenNumber, player1Color, player2Color, img) {
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

        let player1 = instantiateToken(playerTokenNum, player1SquareCoordinate, player1Color, img);
        let player2 = instantiateToken(playerTokenNum, player2SquareCoordinate, player2Color, img);
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

});