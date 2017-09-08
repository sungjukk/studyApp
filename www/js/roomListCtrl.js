angular.module('starter.controllers')

  .controller('roomListCtrl', function($rootScope,$scope, $http, $location, $ionicModal, $timeout, $ionicLoading, $ionicScrollDelegate) {
    if ($rootScope.stompClient != null) {
      $.ajax({
        url : $rootScope.url + "/app/exitRoom",
        method : "post",
        data : {roomName : $rootScope.roomName, userName : $rootScope.userName}
      }).done(function () {
        $rootScope.stompClient.send("/app/roomMsg", {}, JSON.stringify({
          'id' : $rootScope.userName,
          'message' : "exit",
          'roomName' : $rootScope.roomName
        }));
        $rootScope.stompClient.disconnect();
        $rootScope.roomName = null;
        $rootScope.stompClient = null;
      });
    }

    $ionicModal.fromTemplateUrl('templates/chatModal/createRoom.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    function init() {
      $.ajax({
        type : "post",
        url : $rootScope.url + "/app/chatList"
      }).done(function (result) {
        $scope.roomList = result;
      });
    }
    init();
    $scope.refreshRoomList = function () {
       init();
       $scope.$broadcast('scroll.refreshComplete');
    }


    $scope.joinRoom = function (roomName) {
      console.log(roomName);
      $rootScope.roomName = roomName;
      //location.href = "/#/app/chat/room/" + roomName;
      $.ajax({
        type: "post",
        url : $rootScope.url + "/app/joinRoom",
        data : {roomName : $rootScope.roomName, userName : $rootScope.userName}
      }).done(function (result) {
        console.log(result);
        if (result == false) {
          //alert("Room is not find");
          $timeout(function () {
            init();
          },10);
        } else {
          $timeout(function () {
            $location.path("/app/chat/room/" + $rootScope.roomName);
          },100);
        }
      });
  }

    $scope.createRoom = function () {
      $rootScope.roomName = document.getElementById("createRoom").value;
      $.ajax({
        type: "post",
        url : $rootScope.url + "/app/createRoom",
        data : {roomName : $rootScope.roomName, userName : $rootScope.userName}
      }).done(function (result) {
        console.log($rootScope.roomName);
        $scope.modal.hide();
        $timeout(function () {
          $location.path("/app/chat/room/" + $rootScope.roomName);
        },100);
      });
    }

  })
