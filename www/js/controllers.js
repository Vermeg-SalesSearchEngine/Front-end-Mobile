angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ResultsCtrl', function($scope, Chats,searchService,$rootScope) {
  $scope.chats = Chats.all();
       $scope.fullTextSearch = function (text, page) {
            $scope.currentPage = page;
           
            searchService.fullTextSearch(0, 20, text).then(
                function (resp) {
                    $rootScope.searchResp = resp;
                    $rootScope.totalItems = resp.hits.total;
                }
            );
        };
        $scope.isAvailableResults = function () {
            return $scope.searchResp ? true : false;
        };
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ResultDetailCtrl', function($scope, $stateParams, Chats,$rootScope) {
  var id=$stateParams.resultId;
  $scope.rfp = $rootScope.searchResp.hits.hits[id];
  console.log($scope.rfp);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
