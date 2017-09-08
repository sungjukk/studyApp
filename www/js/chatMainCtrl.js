angular.module('starter.controllers')

  .controller('chatCtrl', function($rootScope,$scope, $http, $location, $window, $state, $localstorage) {
    $rootScope.url = "http://122.99.198.182:8088";
    if ($rootScope.boardClient != null) {
      $rootScope.boardClient.disconnect();
      $rootScope.boardClient = null;
    }

   init();

    function init() {
      var authData = $localstorage.get("authData");
      if (authData != null) {
        $rootScope.userName = authData;

        $.ajax({
          type : "post",
          url : $rootScope.url + "/app/enterChat",
          data : {userName : $rootScope.userName}
        }).done(function (result) {
          console.log(result);
          //$localstorage.set("authData",$rootScope.userName);
          //location.href = "/#/app/chat/room";
          //$location.path("/app/chat/room");
          //$window.location.href = '/#/app/chat/room';
          $state.go('app.room');
        });
      }
    }

    $scope.chatJoin =  function() {
      $rootScope.userName = document.getElementById('userName').value;

      if ($rootScope.userName == "") {
        alert("이름을 입력하세요");
        return false;
      }

     $.ajax({
       type : "post",
       url : $rootScope.url + "/app/enterChat",
       data : {userName : $rootScope.userName}
     }).done(function (result) {
       console.log(result);
       $localstorage.set("authData",$rootScope.userName);
       //location.href = "/#/app/chat/room";
       //$location.path("/app/chat/room");
       //$window.location.href = '/#/app/chat/room';
       $state.go('app.room');
     });
      //$location.path("/app/chat/room");
    };
  })
