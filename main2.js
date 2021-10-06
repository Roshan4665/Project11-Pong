
function drawRest() {
  drawPaddle();
}


function drawPaddle(){
  ctx.beginPath();
ctx.rect(edge.left + width / 4, edge.top, width / 2, height / 20);
ctx.rect(edge.left + width / 4, edge.bottom - height / 20, width / 2, height / 20);
ctx.fillStyle = "purple";
ctx.fill();
ctx.closePath();
}