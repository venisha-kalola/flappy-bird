let highest;
if(localStorage.getItem("highest")){
    highest = localStorage.getItem("highest");
}
else{
    highest=0;
}
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let bird = {
    x :  boardWidth/8,
    y : boardHeight/2,
    width : 34,
    height : 24
}
let birdImg;

//pipes
let pipeArray=[];
let pipe = {
    width : 64,
    height : 512,
    x : boardWidth,
    y : 0
}
let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes move left
let velocityY = 0; //bird moves up ( for jump )
let gravity = 0.4;
let gameOver = false;
let score = 0;

window.onload = function(){
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context = board.getContext("2d"); //used to draw on board
    //flappy bird
    addFlappyBird();
    addTopPipe();
    addBottomPipe();
    //start button
    let start = document.getElementById("button");
    start.addEventListener("click",function(){
        gameStart();
    })
    document.addEventListener("keydown",StartKey);
}
function gameStart(){
    if( document.getElementById("btn").textContent==="Restart"){
        location.reload();
    }
    else{
        document.getElementById("btn").textContent="Restart";
        requestAnimationFrame(update);
        setInterval(placePipes,1500);
        document.addEventListener("keydown",moveBird);
    }
}

function StartKey(e){
    if(e.code=="Enter" ||   e.code =="KeyX"){
        gameStart();
    }
}

function addTopPipe(){
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png"
}

function addBottomPipe(){
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png"
}

function addFlappyBird(){
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function(){
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height)
    }
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,board.width,board.height);
    //bird
    setTimeout(function() {
        velocityY+=gravity;
    }, 1000); 
    bird.y = Math.max(bird.y + velocityY, 0);
   // bird.y += velocityY;
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    //pipes
    for(let i =0; i<pipeArray.length;i++){
        let pipes = pipeArray[i];
        if(score>=10){
            velocityX=-2.2;
        }
        else if(score>=20){
            velocityX=-2.4;
        }
        else if(score>=30){
            velocityX=-2.5;
        }
        else if(score>=40){
            velocityX=-2.6;
        }
        else if(score>=50){
            velocityX=-2.8;
        }
        else if(score>=60){
            velocityX=-3;
        }
        pipes.x+=velocityX;
        context.drawImage(pipes.img, pipes.x, pipes.y, pipes.width, pipes.height);
        if(!pipes.passed && bird.x > pipes.x + pipes.width){
            score+=0.5; // 2 pipes so 0.5
            pipes.passed=true;
        }
        if(detectCollision(bird,pipes)){
            gameOver=true;
        }
    }

    //clear pipe
    while(pipeArray.length>0 && pipeArray[0].x< -pipe.width){
        pipeArray.shift(); //remove first element from array
    }
    //score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(`${score}`,5,45);
    if(gameOver){
        context.fillText("GAME OVER",40,260)
        context.font="30px sans-serif";
        context.fillText(`Your score : ${score}`,75,300)
        if(score>highest){
            highest=score;
            context.fillText(`New Highest Score : ${highest}`,25,340);
            localStorage.setItem("highest",highest);
        }
        else{
            context.fillText(`Highest Score : ${highest}`,50,340);
        }
        setTimeout(function() {
            location.reload();
        }, 5000); 
       
    }
}

function placePipes(){
    if(gameOver){
        return;
    }
    let randomPipeY = pipe.y - pipe.height/4 - Math.random()*(pipe.height/2);
    let openingSpace = board.height/4;
    
    let topPipe = {
        img : topPipeImg,
        x : pipe.x,
        y : randomPipeY,
        width : pipe.width,
        height : pipe.height,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipe.x,
        y : randomPipeY + pipe.height + openingSpace,
        width : pipe.width,
        height : pipe.height,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if(window.code=="Space" || e.code=="ArrowUp" || e.code =="KeyX"){
        velocityY=-6;
    }
}

function detectCollision(a,b){
    if(bird.y>board.height){
        return true;
    }
    return a.x<b.x+b.width && a.x + a.width> b.x && a.y< b.y + b.height && a.y + a.height >b.y;
}