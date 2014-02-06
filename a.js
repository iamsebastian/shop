'use strict';
/* global angular, console */

var app = angular.module('appEinkauf', []);

app.controller('ctrl', function($scope, $http, dbUrl) {
  $scope.url = dbUrl;
  $http.get(dbUrl)
  .success(function(data){
    $scope.db = data[0];
  });
  console.log($scope.db);
  $scope.arr = [1,2,3];
  $scope.colors = [
    {name:'black', shade:'dark'},
    {name:'white', shade:'light'},
    {name:'red', shade:'dark'},
    {name:'blue', shade:'dark'},
    {name:'yellow', shade:'light'}
  ];
});

app.directive('entry', function($http) {
  return {
    restrict: 'A',
    scope: {
      data:'=entry',
      db:'=dbUrl',
      url:'=',
      arr:'=',
      colors:'='
    },
    templateUrl: 'template.html',
    link: function($scope, element, args) {
      console.log($scope);
      $scope.klik = function() {
        console.log(this);
      };

      $scope.pbClass = function() {
        if(this.item && this.item.stash) {
          return 'stashed';
        } else if(this.item && !this.item.stash) {
          return 'unstashed';
        }
      };

      $scope.getActive = function() {
        if(this.item) {
          this.item.stash = !this.item.stash;
        }
        console.log(this);
      };

      $scope.postData = function() {
        console.log($scope.url, $scope.db);
        $http.put($scope.url, $scope.db)
        .success(function(cb){
          console.log(cb);
        });
      };

      $scope.createCat = function() {
        var i = 0;
        for(var attrs in $scope.db) {
          if($scope.db[''+i]) {
            i++;
          } else {
            $scope.db[''+i] = {'name': $scope.catinput};
            console.log($scope.catinput);
          }
        }
      };

      $scope.createItem = function(cat,itm) {
        var i = 0;
        var stashedOnce = false;
        console.log(i,this,cat);
        for(var attrs in $scope.db) {
          console.log(attrs);
          if($scope.db[attrs]) {
            console.log($scope.db[attrs]);
            if($scope.db[attrs].name === cat){
              if($scope.db[attrs].items) {
                console.log($scope.db[attrs].name === cat);
                for (var j = 0; j < $scope.db[attrs].items.length; j++) {
                  console.log($scope.db[attrs].items[j].item);
                  if(itm !== $scope.db[attrs].items[j].item && !stashedOnce){
                    stashedOnce = true;
                    console.log('IT IS IF: ',$scope.db[attrs].items[j].item);
                    $scope.db[attrs].items.push({
                      item: itm,
                      stash: false
                    });
                    console.log('IF inserted: ',$scope.db[attrs].items,itm);
                  }
                }
              }
              else if(!$scope.db[attrs].items) {
                $scope.db[attrs].items = [{
                  item: itm,
                  stash: false
                }];
              }
            }
          }
          // if($scope.db[][''+i]) {
          //   i++;
          // } else {
          //   $scope.db[$scope.selectedCat][''+i] = {'name': $scope.iteminput};
          //   console.log($scope.iteminput);
          //   break;
          // }
        }
      };
    }
  };
});
