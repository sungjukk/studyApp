// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller : 'mainCtrl'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.chat', {
      cache : false,
      url: '/chat',
      views: {
        'menuContent': {
          templateUrl: 'templates/chatMain.html',
          controller: 'chatCtrl'
        }
      }
    })
    .state('app.room', {
      cache : false,
      url: '/chat/room',
      views: {
        'menuContent': {
          templateUrl: 'templates/roomList.html',
          controller: 'roomListCtrl'
        }
      }
    })
    .state('app.roomDetail', {
      cache : false,
      url: '/chat/room/:roomName',
      views: {
        'menuContent': {
          templateUrl: 'templates/testChat.html',
          controller: 'chatDetailCtrl'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })
    .state('app.whiteboard', {
      url: '/whiteboard',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'views/whiteboard/whiteboard.html',
          controller: 'whiteboard'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/search');
});
