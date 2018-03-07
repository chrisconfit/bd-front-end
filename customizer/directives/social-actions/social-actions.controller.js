(function () {

  angular
    .module('bdApp')
    .controller('socialCtrl', socialCtrl);
	
		socialCtrl.$inject = ['$scope', 'popups', 'api', 'jean'];
	
		function socialCtrl($scope, popups, api, jean) {
	
			var sovm = this;
			sovm.jean = $scope.jean;
			sovm.shareImageUploaded =  $scope.shareImageUploaded;
			
			sovm.jeanToUrl = function(){
				var url = "http://share.bluedeltajeans.com/";
				url += api.getDataCode($scope.jean);
				return url;
			};
			
			var sharingUrls = {};
			
			var socialTitle = "Custom Jeans by Blue Delta";
			var socialDescription = "Check out the jeans I made at the Blue Delta Jean Builder";

			//Facebook sharing URL
			sharingUrls.facebook = function(url){
				if (!url) return false;
				var baseString = 'https://www.facebook.com/sharer/sharer.php?u='+url;
				return baseString;
			};
			
			//Twitter sharing URL/
			sharingUrls.twitter = function(url){
				if (!url) return false;
				return 'https://twitter.com/intent/tweet?text='+socialTitle+'&source=webclient&url='+url;
			};
			
			//Email sharing URL
			sharingUrls.email = function(url){
				return "mailto:?&subject="+socialTitle+"&body="+socialDescription+" - "+url;
			};
			
			//Pinterest sharing URL
			sharingUrls.pinterest = function (url){
				if(!url) return false;
				return 'https://www.pinterest.com/pin/find/?description=sharing&url='+url+'&description='+socialTitle+'%0A'+socialDescription;
			};
      
      
      function runShare(social, shareUrl){
        var url = sharingUrls[social](shareUrl);
        if (url !== false) {
          if (social == 'email') window.open(url, '_self');
          else window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
        }
        else console.log("Error builiding social URL");
        return false;
      }
			
			sovm.share = function(social){
        var shareUrl = sovm.jeanToUrl();
        runShare(social, shareUrl);
			};
		
		}	
			
})();