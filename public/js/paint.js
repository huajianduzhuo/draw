// websocket
var socket;
var isPaint = true;

// 改变形状
 function changeShape(s) {
     shape = s;
     // 橡皮擦
     if (eraserFlag) {
         eraserFlag = false;
         eraser.style.display = 'none';
         wrap.style.cursor = 'default';
     }
 }

 // 改变颜色
 function changeColor(color) {
     context.strokeStyle = color;
     context.fillStyle = color;
 }

 // 改变宽度
 function changeWidth(w) {
     context.lineWidth = w;
 }



 var wrap = document.getElementById('wrap');
 var cover = document.getElementById('cover');
 var canvas = document.getElementById('canvas');
 var context = canvas.getContext('2d');

 // canvas 宽高设置
 function init() {
     canvas.width = wrap.clientWidth;
     canvas.height = wrap.clientHeight;
 }
 init();
 $(window).resize(init);

 var eraserBtn = document.getElementById('eraserBtn');
 var clearAll = document.getElementById('clearAll');
 var eraser = document.getElementById('eraser');
 var isFill = document.getElementById('isFill');


 // 清除
 clearAll.onclick = function() {
   if(!isPaint){
     return;
   }
     context.clearRect(0, 0, canvas.width, canvas.height);
     url = null;
     img = null;
   if(socket){
     socket.emit('dataURI', canvas.toDataURL());
   }
 }

 // 橡皮擦
 eraserBtn.onclick = function() {
     eraserFlag = true;
 }

 // 是否填充
 isFill.onchange = function() {
     if (isFill.value == '1') {
         fillFlag = true;
     } else {
         fillFlag = false;
     }
 }

 var shape = 'paint';
 var eraserFlag = false;
 var eraserWidth = 10;
 var eraserHeight = 10;
 var eraserLeft = 0;
 var eraserTop = 0;
 var fillFlag = false;

 var flag = false;
 var offsetX = 0;
 var offsetY = 0;
 var url, img;
 cover.onmousedown = function(event) {
   if(!isPaint){
     return;
   }
     flag = true;
     offsetX = event.offsetX;
     offsetY = event.offsetY;

     if (url) {
         img = new Image();
         img.src = url;
     }

     // 画笔
     if (shape == 'paint') {
         context.beginPath();
         context.moveTo(offsetX, offsetY);
     }
 }

 cover.onmousemove = function(event) {
   if(!isPaint){
     return;
   }
     // 橡皮擦
     if (eraserFlag) {
         eraserLeft = (event.offsetX - eraserWidth / 2) + 'px';
         eraserTop = (event.offsetY - eraserHeight / 2) + 'px';
         eraser.style.transform = 'translate(' + eraserLeft + ', ' + eraserTop + ')';
         eraser.style.display = 'block';
         wrap.style.cursor = 'none';
     }

     if (flag) {
         // 橡皮擦擦除
         if (eraserFlag) {
             context.clearRect(parseInt(eraserLeft), parseInt(eraserTop), eraserWidth, eraserHeight);
           if(socket){
             socket.emit('dataURI', canvas.toDataURL());
           }
             return;
         }

         context.clearRect(0, 0, canvas.width, canvas.height);

         if (url) {
             context.drawImage(img, 0, 0, canvas.width, canvas.height);
         }

         var nowX = event.offsetX;
         var nowY = event.offsetY;
         var disX = nowX - offsetX;
         var disY = nowY - offsetY;
         if (shape == 'paint') {
             // 画笔
             context.lineTo(nowX, nowY);
             context.stroke();
         } else if (shape == 'square') {
             // 矩形
             context.beginPath();
             context.moveTo(offsetX, offsetY);
             context.lineTo(offsetX, nowY);
             context.lineTo(nowX, nowY);
             context.lineTo(nowX, offsetY);
             context.closePath();
             if (fillFlag) {
                 context.fill();
             } else {
                 context.stroke();
             }
         } else if (shape == 'line') {
             // 直线
             context.beginPath();
             context.moveTo(offsetX, offsetY);
             context.lineTo(nowX, nowY);
             context.stroke();
         } else if (shape == 'circle') {
             // 圆形
             var radius = Math.sqrt(disX * disX + disY * disY) / 2;
             var x = offsetX + (nowX - offsetX) / 2;
             var y = offsetY + (nowY - offsetY) / 2;
             context.beginPath();
             context.arc(x, y, radius, 0, Math.PI * 2, true);
             if (fillFlag) {
                 context.fill();
             } else {
                 context.stroke();
             }
         } else if (shape == 'triangle') {
             // 三角形
             context.beginPath();
             context.moveTo(offsetX, offsetY);
             context.lineTo(offsetX, nowY);
             context.lineTo(nowX, nowY);
             context.closePath();
             if (fillFlag) {
                 context.fill();
             } else {
                 context.stroke();
             }
         }

         if(socket){
             socket.emit('dataURI', canvas.toDataURL());
         }

     }
 }

 document.onmouseup = function() {
   if(!isPaint){
     return;
   }
     flag = false;
     url = canvas.toDataURL();
 }