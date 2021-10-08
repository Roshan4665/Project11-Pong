//
var elem = document.documentElement;
let size = 30;
let maxVelocity = 10;
let minVelocity=3;
document.getElementById("play").onclick = function () {
  document.getElementById("gameSettings").style.display = "none";
  size = document.getElementById("pSize").value;
  if (dv == 1) maxVelocity = 15;
  else if (dv == 2) maxVelocity = 20;
  // handleScore();
  // openFullscreen();
  play();
};


var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
let singlePlayerScore=0;

function play() {
  let bgColor = 'black';
  let gravity = 0.0;
  let listCol = ["#1aebdd", "#1aeb3d", "#42eff5", "#1aeb3d", "#eb361a"];
  let particleColor = listCol[parseInt(Math.random() * 100) % 5];

  let canvas = /** @type {HTMLCanvasElement} */(document.getElementById("gameCanvas"));
  let ctx = canvas.getContext('2d');

  let p1score = 0, cs = 0;
  let scard=document.getElementById("scoreDiv");
function handleScore(){
  if(modeVal==0)
  {
    // if(singlePlayerScore>100)
    scard.innerHTML=singlePlayerScore;
  }
  else
  {
    scard.innerHTML=p1score+" : "+cs;
  }
}
handleScore();
  (onresize = function () {
    if (canvas.clientHeight < canvas.clientWidth) {
      canvas.style.width = "60vw";
      canvas.style.left = "20vw";
    }
    width = canvas.width = canvas.clientWidth;
    height = canvas.height = canvas.clientHeight;
    o = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
    edge = { top: -o.y, right: width - o.x, bottom: height - o.y, left: -o.x }
  })();
  let pshelper=0;
  let particles = {};
  let newParticle = (function () {
    var nextIndex = 0;
    return function (x, y, r, o, c, xv, yv, rv, ov) {
      particles[++nextIndex] = {
        index: nextIndex,
        x: x,
        y: y,
        r: r,
        o: o,
        c: c,
        xv: xv,
        yv: yv,
        rv: rv,
        ov: ov
      };
    };
  })();
  let state="Start";
  let fireballs = {};
  let newFireball = (function () {
    var nextIndex = 0;
    return function (x, y, xv, yv) {
      fireballs[++nextIndex] = {
        index: nextIndex,
        x: edge.left + Math.random() * width,
        y: edge.top + height / 2,
        xv: minVelocity,
        yv: minVelocity,
      };
    };
  })();
  let fc = 0;
  canvas.onclick = function () {
    if (fc == 0) {
      fc = 1;
      state="continue";
      newFireball(
        -100, 50, 0, 0
      );
    }
  };
  let mx = 0;


  function drawStartMsg(){
    ctx.beginPath();
    ctx.font = "32px Arial";
    ctx.strokeStyle = "pink";
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.strokeText("Tap to "+state, 0, 0);
    ctx.closePath();
  }
  requestAnimationFrame(loop = function () {
    
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    ctx.translate(o.x, o.y);
    ctx.globalCompositeOperation = 'lighter';
    particlesLogic();
    
    for (var i in fireballs) {
      const f = fireballLogic(i);
      detectCollision(f, i);
      mx = Math.max(mx, f.yv);
    }
    handleUserMovement();
    drawPaddle();
    requestAnimationFrame(loop);
    if(fc==0) drawStartMsg();
    else drawScore();
  });

  size =Math.max(width/8,size * width / (250+(dv*50)));
  let paddle1 = { x: edge.left+width/2-size/2, len: size };
  let paddle2 = { x: edge.left, len: width };
  let controller=document.getElementById("position");
  function particlesLogic() {
    for (var i in particles) {
      var p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.globalAlpha = p.o;
      ctx.fillStyle = p.c;
      ctx.fill();
    }

    for (var i in particles) {
      var p = particles[i];
      p.x += p.xv;
      p.y += p.yv;
      p.r += p.rv;
      p.o += p.ov;
      if (p.r < 0) delete particles[p.index];
      if (p.o < 0) delete particles[p.index];
    }
  }
  function fireballLogic(i) {
    f = fireballs[i];
    var numParticles = Math.sqrt(f.xv * f.xv + f.yv * f.yv) / 5;
    if (numParticles < 1) numParticles = 1;
    var numParticlesInt = Math.ceil(numParticles),
      numParticlesDif = numParticles / numParticlesInt;
    for (var j = 0; j < numParticlesInt; j++) {
      newParticle(
        f.x - f.xv * j / numParticlesInt,
        f.y - f.yv * j / numParticlesInt,
        9,
        numParticlesDif,
        particleColor,
        Math.random() * 0.6 - 0.3,
        Math.random() * 0.6 - 0.3,
        -0.3,
        -0.05 * numParticlesDif
      );
    }
    return f;
  }


  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle2.x, edge.top, paddle2.len, height / 20);
    ctx.rect(paddle1.x, edge.bottom - height / 20, paddle1.len, height / 20);
    ctx.fillStyle = "#1aebdd";
    ctx.fill();
    ctx.closePath();
  }


  function detectCollision(f, i) {
    
    f.x += f.xv;
    f.y += f.yv;
    var boundary;
    if ((f.x >= paddle1.x && f.x <= paddle1.x + paddle1.len && f.y + f.yv >= edge.bottom - height / 20) || (f.x >= paddle2.x && f.x <= paddle2.x + paddle2.len && f.y + f.yv <= edge.top + height / 20)) {
      singlePlayerScore+=parseInt((Math.random()+0.1)*(f.xv*f.xv+f.yv*f.yv)*(dv+1*10)/paddle1.len);
      handleScore();
      let vv = parseInt(Math.random() * maxVelocity);
      let hv = parseInt((Math.random() - 0.5) * maxVelocity);
      if (f.yv < 0)
        f.yv = minVelocity + vv;
      else
        f.yv = -(minVelocity + vv);
      f.xv <= 0 ? f.xv = hv - minVelocity : f.xv = hv + minVelocity;

    }
    else if (f.y < (boundary = edge.top + 7)) {
      p1score++;
      handleScore();
      fc = 0;
      delete fireballs[i];

    } else if (f.y > (boundary = edge.bottom - 7)) {
      singlePlayerScore-=parseInt((Math.random()+0.1)*(f.xv*f.xv+f.yv*f.yv)*(dv+1*10)/paddle1.len);
      cs++;
      handleScore();
      fc = 0;
      delete fireballs[i];

    }
    if (f.x > (boundary = edge.right - 7)) {
      f.x = boundary;
      f.xv *= -1;
    } else if (f.x < (boundary = edge.left + 7)) {
      f.x = boundary;
      f.xv *= -1;
    }
    pshelper=f.yv;

  }
  function drawScore() {
    ctx.beginPath();
    ctx.font = "32px Arial";
    ctx.strokeStyle = "pink";
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.strokeText("Ball velocity : "+parseInt(Math.sqrt(f.yv*f.yv+f.xv*f.xv)), 0, 0);
    ctx.closePath();
  }
  let rightPressed = false, leftPressed = false;
  function handleUserMovement() {
    if (rightPressed) {
      paddle1.x += (7+Math.abs(pshelper*0.35));
      if(paddle1.x+paddle1.len>edge.right)
      paddle1.x=edge.right-paddle1.len;
    }
    else if (leftPressed) {
      paddle1.x -= (7+Math.abs(pshelper*0.35));
      if(paddle1.x<edge.left)
      paddle1.x=edge.left;
      
    }
    else if(isMobile){
      paddle1.x=edge.left+controller.value*(width-paddle1.len)/100;
    }
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    function keyDownHandler(e) {
      if (e.key == "Right" || e.key == "ArrowRight") rightPressed = true;
      else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = true;
    }
    function keyUpHandler(e) {
      if (e.key == "Right" || e.key == "ArrowRight") rightPressed = false;
      else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = false;
    }
    // console.log("hi");
  }
  

}
