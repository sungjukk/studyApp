angular.module('starter.controllers').controller('whiteboard', function($rootScope, $scope, $stateParams) {

  var serverHost = 'http://122.99.198.182:8088';

  var canvas, ctx, sock, sockCtx;
  var canvasSetting = new Object();
  var startXy = new Array();
  var moveXy = new Array();
  var pos = { sockDrawable : false, drawable : false, x : -1, y : -1 };
  //var stompClient = null;


  allDisconnect();
  connect();
  canvas = document.getElementById("harmonyCanvas");
  //canvas = $(".harmonyCanvas");
  canvasSize();
  ctx = canvas.getContext("2d");
  canvas.addEventListener("mousedown", listener);
  canvas.addEventListener("mousemove", listener);
  canvas.addEventListener("mouseup", listener);
  canvas.addEventListener("mouseout", listener);

  canvas.addEventListener("touchstart", listener);
  canvas.addEventListener("touchmove", listener);
  canvas.addEventListener("touchend", listener);


  $(document).resize(function() {
    canvasSize();
  });



  function canvasSize() {

    canvas.style.width = '100%';
    canvas.style.height = $('#whiteboardBox').css('height');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function listener(event) {
    event.preventDefault();
    var t = event.type
    if(t=="mousedown" || t=="touchstart"){
      initDraw(event);
    }else if(t=="mousemove" || t=="touchmove"){
      if (pos.drawable){ draw(event); }
    }else if(t=="mouseup" || t=="touchend"){
      finishDraw();
    }else if(t=="mouseout"){ }
  }

  function initDraw(event){
    ctx.beginPath();
    var colorSpectrum = $(".colorSpectrum");
    var size = canvasSetting.getBrushSize($("#brushSize"));
    if(canvasSetting.getBrushType($("#brushType"))=="B4"){
      size = 30
    }
    pos.drawable = true;
    var coors = getPosition(event);
    pos.X = coors.X;
    pos.Y = coors.Y;
    startXy.push({"x" : coors.X, "y" : coors.Y, "brushSize" : size});
    ctx.lineWidth = size;
    ctx.moveTo(coors.X, coors.Y);
  }

  function draw(event){
    var coors = getPosition(event);
    ctx.strokeStyle = canvasSetting.getColor($(".colorSpectrum"));
    pos.X = coors.X;
    pos.Y = coors.Y;
    moveXy.push({"x" : coors.X, "y" : coors.Y});
    if(canvasSetting.getBrushType($("#brushType"))=="B4"){
      ctx.clearRect(coors.X, coors.Y, ctx.lineWidth, ctx.lineWidth);
    }else{
      ctx.lineTo(coors.X, coors.Y);
    }
    ctx.stroke();
  }

  function finishDraw(){
    var msg = {
      "brushType" : canvasSetting.getBrushType($("#brushType")),
      "startXy" : startXy,
      "moveXy": moveXy,
      "color" : canvasSetting.getColor($(".colorSpectrum"))
    };
    $rootScope.boardClient.send("/app/whiteboard", {}, JSON.stringify(msg));

    startXy = [];
    moveXy = [];
    pos.drawable = false;
    pos.X = -1;
    pos.Y = -1;
  }




  function connect() {
    sock = new SockJS(serverHost+'/gs-websocket');
    $rootScope.boardClient = Stomp.over(sock);
    $rootScope.boardClient.connect({}, function(frame) {
      $rootScope.boardClient.subscribe('/whiteboard/draw', function(Whiteboard) {
        returnWhiteboardDraw(Whiteboard);
      });
    });
  }

  function getPosition(event){
    if(event.type.indexOf("touch")!=-1){
      var touches = event.changedTouches;
      var x = touches[0].pageX - canvas.offsetLeft;
      var y = touches[0].pageY - canvas.offsetTop - 40;
    }else{
      var x = event.pageX - canvas.offsetLeft;
      var y = event.pageY - canvas.offsetTop - 40;
    }
    return {X: x, Y: y};
  }

  canvasSetting = {
    getColor : function(element) {
      if(element.value){ return element.value }else{ return element.val() };
    },
    getBrushType : function(element) {
      if(element.value){ return element.value }else{ return element.val() };
    },
    getBrushSize : function(element){
      var size = 0;
      if(element.value){ size = element.value }else{ size = element.val() };
      if(size<=0){ return 1; };
      return size;
    }
  }

  function returnWhiteboardDraw(data){
    var data = JSON.parse(data.body);
    var brushSize = data.startXy[0].brushSize;
    sockCtx = canvas.getContext("2d");
    sockCtx.beginPath();
    pos.sockDrawable = true;
    sockCtx.moveTo(data.startXy[0].x, data.startXy[0].y);
    sockCtx.strokeStyle = data.color;
    for(var i=0; data.moveXy.length>i; i++){
      var moveXy = data.moveXy[i];
      if(data.brushType=="B4"){
        sockCtx.clearRect(moveXy.x, moveXy.y, brushSize, brushSize);
      }else{
        sockCtx.lineTo(moveXy.x, moveXy.y);
        sockCtx.lineWidth = brushSize;
      }
      sockCtx.stroke();
    };
  }

  function allDisconnect(){
    if($rootScope.stompClient != null) {
      $rootScope.stompClient.disconnect();
      $rootScope.stompClient = null;
    }
  }
});
