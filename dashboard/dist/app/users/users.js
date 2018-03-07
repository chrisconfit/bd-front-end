'use strict';

angular.module('inspinia')
  .controller('UsersController', ['bdAPI', '$scope', 'aws', 'DTColumnDefBuilder', function (bdAPI, $scope, aws, DTColumnDefBuilder) {


		
		console.log(bdAPI);

		console.log("let's get some more users...");
    var vm = this;
    
	
    
  		//Get users
		vm.pagination = {
			usersPerPage:20,
			prev:false,
			next:false,
			nextURL:"",
			page:1,
			loaded:0
		};
		vm.pagination.startIndex = (vm.pagination.page-1)*vm.pagination.usersPerPage;
		
		vm.findIndex = function(userId){
	    for(var i = 0; i < vm.users.length; i++) {
	      if(vm.users[i].userId === userId) return i;
	    }
	    return -1;
		}
		
		function incrementPage(inc){
			vm.pagination.page = vm.pagination.page+inc;
			vm.pagination.startIndex = (vm.pagination.page-1)*vm.pagination.usersPerPage;
			if (inc > 0) vm.pagination.prev=true;
			else vm.pagination.next=true;
		}
		
		
		vm.pagination.changePage = function(dir){
			
			if (vm.pagination.page == 1 && dir=="prev") return false;
			if (vm.pagination.page == 2 && dir=="prev") vm.pagination.prev=false;
			
			//put in rules for the last page
			
			if (dir =="next"){
				if (vm.pagination.page < vm.pagination.loaded) incrementPage(1);
				else{
					pullusers(function(){
						incrementPage(1);
					})
				}
			}else{
				incrementPage(-1);				
			}	
		}
		
		

		function pullusers(callback){
			var args = vm.pagination.nextURL ? [vm.pagination.usersPerPage, vm.pagination.nextURL] : vm.pagination.usersPerPage;
			bdAPI.call('usersList', args, function(result){
				console.log(result);
				vm.users.push.apply(vm.users, result.data.items);
				if (result.data.next){
					vm.pagination.nextURL=result.data.next;
					vm.pagination.next = true;
				}
				else vm.pagination.next = false;
				vm.pagination.loaded++;	
				if (callback){
				 callback();
				}
				$scope.$apply();
			});
		}
		
		//Init users
		vm.users = [];
		pullusers();    
    
   $scope.dtColumnDefs = [
   	DTColumnDefBuilder.newColumnDef(3).notSortable(),
	 	DTColumnDefBuilder.newColumnDef(2).notSortable()
	 ];
    		
        


		

    vm.userName = 'Example user';
    vm.helloText = 'Welcome in INSPINIA Gulp SeedProject';
    vm.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects.';

  }]);
