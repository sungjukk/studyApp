angular.module('starter.controllers')
.controller('chatDetailCtrl', function($scope, $rootScope, $stateParams, $ionicModal, $ionicScrollDelegate) {

  if ($rootScope.stompClient != null) {
    $rootScope.stompClient.disconnect();
  }

  $rootScope.socket = new SockJS($rootScope.url + '/gs-websocket');

    $rootScope.roomName = $stateParams.roomName;

    function connect() {
      $rootScope.stompClient = Stomp.over($rootScope.socket);
      $rootScope.stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);
        $rootScope.stompClient.subscribe('/groupChat/all', function(greeting) {
          //console.log(JSON.parse(greeting.body));
        });
        $rootScope.stompClient.subscribe('/groupChat/room/' + $rootScope.roomName, function(greeting) {
          var obj = JSON.parse(greeting.body);
          writeText('text',obj);
        });
        $rootScope.stompClient.subscribe('/groupChat/roomMsg/' + $rootScope.roomName , function(greeting) {
          //console.log(greeting.body);
          document.getElementById('msgList').innerHTML += "<div style='width: 100%; text-align: center'>" + greeting.body + "</div>";
          $ionicScrollDelegate.scrollBottom();
        });
      });
    }
    connect();

    function init() {
      $rootScope.stompClient.send("/app/roomMsg", {}, JSON.stringify({
        'id' : $rootScope.userName,
        'message' : "join",
        'roomName' : $rootScope.roomName
      }));
    }

    setTimeout(init,500);

    $ionicModal.fromTemplateUrl('templates/userList.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.roomName = $stateParams.roomName;

    $scope.sendMsgText = function () {
      var sendMsg = document.getElementById("inputText");
      $rootScope.stompClient.send("/app/roomChat", {}, JSON.stringify({
        'id' : $rootScope.userName,
        'message' : sendMsg.value,
        'roomName' : $rootScope.roomName
      }));
      sendMsg.value = "";
    }

    function writeText(type,obj) {
      var checkTime = getDate(new Date());
      var msgList = document.getElementById('msgList');
      var html = '<div class="item" style="padding: 0 !important; border: none">';

      if(type == 'text') {
        if ($rootScope.userName != obj.sendId) {
          html += '<div><img src="img/defaultImg.png" class="profile-pic left" />';
          html += '<div class="chat-bubble left" style="white-space:normal;"><pre>' + obj.content  + '</pre>';
        }
        if ($rootScope.userName == obj.sendId) {
          html += '<div><img src="img/defaultImg.png" class="profile-pic right" />';
          html += '<div class="chat-bubble right" style="white-space:normal;"><pre>' + obj.content  + '</pre>';
        }
      }
/*      if (type == 'image') {
        if (user == 'other') {
          html += '<div ng-if="user._id !== message.userId"><img ng-click="viewProfile(message)" class="profile-pic left" src="' + data.photoUrl + '" onerror="onProfilePicError(this)" >';
          html += '<div class="chat-bubble left" style="white-space:normal;"><img id="viewImg" src="' + data.imgUrl  +' " onclick="asdasd()"/>';
        }
        if (user =='user') {
          html += '<div ng-if="user._id !== message.userId"><img ng-click="viewProfile(message)" class="profile-pic right" src="' + $rootScope.rootUser.photoUrl + '" onerror="onProfilePicError(this)">';
          html += '<div class="chat-bubble right" style="white-space:normal;"><img src="' + data.imgUrl  +' " />';
        }
      }*/
      html += '<div class="message-detail"><span class="bold">' + obj.sendId + '</span>,';
      html += '<span>' + checkTime + '</span></div>';
      html += '</div>';
      html += '</div>';
      msgList.innerHTML += html;
      $ionicScrollDelegate.scrollBottom();
    }

    function getDate(writeDate) {
      var time = writeDate.getHours();
      var minute = writeDate.getMinutes();
      if (minute < 10) {
        minute = '0' + minute;
      }
      return time + ":" + minute;
    }

    $scope.showUserList = function () {
      $.ajax({
        url : $rootScope.url + "/app/getUserList",
        data : {roomName : $rootScope.roomName, userName : $rootScope.userName},
        type : "post",
        dataType : "json"
      }).done(function (result) {
        $scope.chatUserList = result;
        $scope.modal.show();
      });
    }
  })
