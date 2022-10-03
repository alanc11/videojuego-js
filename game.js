const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const keyDown = document.querySelector('#down');
const keyUp = document.querySelector('#up');
const keyRight= document.querySelector('#right');
const keyLeft = document.querySelector('#left');
const spanLives = document.querySelector('#lives');
const gameOver = document.querySelector('#game-over');
const continueGame = document.querySelector('#continue');
const cancelGame = document.querySelector('#cancel');
const spanTime = document.querySelector('#time');


continueGame.addEventListener('click', continuar);
cancelGame.addEventListener('click', cancel);
keyDown.addEventListener('click', clickDown);
keyUp.addEventListener('click', clickUp);
keyRight.addEventListener('click', clickRight);
keyLeft.addEventListener('click', clickLeft);

document.addEventListener('keydown',keyPressed);
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
let canvasSize;
let elementsSize;
const playerPosition = {
    x: undefined,
    y: undefined
};
let cowPosition = {
    x: undefined,
    y: undefined,
};
let enemiesPositions = [];
let level = 0;
let lives = 3;
let timeStar;
let timePlayer;
let timeInterval;

function continuar(){
    location.reload();
}
function cancel(){
    gameOver.style='display: none ';
}
function deleteMap(){
    game.clearRect(0, 0, canvasSize, canvasSize);
}

function clickUp(){
    if((playerPosition.y - elementsSize + 1) < elementsSize){
        console.warn('OUT');
    }else{
        playerPosition.y -= elementsSize;
        startGame();
    }
}
function clickDown(){
    if((playerPosition.y + elementsSize) > canvasSize){
        console.warn('OUT');
    }else{
        playerPosition.y += elementsSize;
        startGame();
    }
}

function clickRight(){
    if((playerPosition.x + elementsSize) > canvasSize){
        console.warn('OUT');
    }else{
        playerPosition.x += elementsSize;
        startGame();
    }
}
function clickLeft(){
    if((playerPosition.x - elementsSize + 1) < elementsSize){
        console.warn('OUT');
    }else{
        playerPosition.x -= elementsSize;
        startGame();
    }
}
function startGame(){
    
    game.font = elementsSize + 'px Helvetica';
    game.textAlign = 'end';
    enemiesPositions = [];
    const map = maps[level];
    
    if(!map){
        gameWin();
        return;
    }
    if(!timeStar){
        timeStar = Date.now();
    }
    deleteMap();
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    
    showLives();
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const positionX = elementsSize * (colI + 1);
            const positionY = elementsSize * (rowI + 1);
            if (col == "O" && playerPosition.x == undefined && playerPosition.y == undefined){
				playerPosition.x = positionX;
				playerPosition.y = positionY;
			}else if(col == 'I'){
                cowPosition.x = positionX;
                cowPosition.y = positionY;
            }else if(col == 'X'){
                enemiesPositions.push({
                    x: positionX,
                    y: positionY,
                });
            }
            game.fillText(emojis[col], positionX + 10 , positionY - 5);
            
        });
    });
   movePlayer();
}
function setCanvasSize(){ 
    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.8;
    }else{
        canvasSize = window.innerHeight * 0.8;
    }
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    elementsSize = canvasSize / 10.1;
    console.log('Canvas Size: ' + canvasSize);
    startGame();
}

function keyPressed(key){
    if(key.keyCode == '38') clickUp();
    else if(key.keyCode == '40') clickDown();
    else if(key.keyCode == '37') clickLeft();
    else if(key.keyCode == '39')clickRight();
}
function movePlayer(){
   
    let xp = Math.floor(playerPosition.x); 
    let yp = Math.floor(playerPosition.y); 
    let xc = Math.floor(cowPosition.x); 
    let yc = Math.floor(cowPosition.y); 
    if(xp == xc && yp == yc){
        console.log('Win');
        levelPassed();
    }
        const enemyColision = enemiesPositions.find(enemy => {
        const enemyCollisionX = Math.floor(enemy.x) == Math.floor(playerPosition.x);
        const enemyCollisionY = Math.floor(enemy.y) == Math.floor(playerPosition.y);
        return enemyCollisionY && enemyCollisionX;
    });
    if(enemyColision){
        levelFailed();
    }
    game.fillText(emojis['PLAYER'], playerPosition.x + 10, playerPosition.y - 5);
}
function levelPassed(){
    console.log('Subiste de nivel');
    level++;
    startGame();
}
function gameWin(){
    console.log('Terminaste el juego');
}
function levelFailed(){
    console.log('level failed');
    lives--;
    
    if(lives > 0){      
        console.log(lives);
        gameOver.style='display: none';
    }else{
        gameOver.style='display: flex';
        // level = 0;
        // lives = 3;
    }
    
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}
function showLives(){
    spanLives.innerText = emojis["HEART"].repeat(lives);
}

function showTime(){
    spanTime = Date.now() - timeStar;
}
