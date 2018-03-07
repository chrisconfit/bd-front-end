/*
(function() {

  angular
    .module('bdApp')
    .service('jsonData', jsonData);

  jsonData.$inject = ['$http','$filter', '$timeout'];
  function jsonData ($http, $filter, $timeout) {
	  
		data = {};
		$timeout
		setupJsonData = function(key){
			$http.get('/data/'+key+'.json').then(function(response){
				data[key] = response.data;
			});
		}
		
		jsonDataKeys = [
			'jeansList',
			'profile',
			'styles',
			'threads',
			'buttons',
			'fabrics',
			'genders',
			'tailors'
		];

		for (d = 0; d < jsonDataKeys.length; d++) { 
			setupJsonData(jsonDataKeys[d]);
		}			

		var styleByGender = function(gender){
			return function(style){
				return style["images_"+gender];
		  }
		};
		
		var jeanKeyToDataKey = function(jeanKey){
			var dataKey = false;
			
			switch(true){
				case jeanKey.indexOf('thread') > -1:
				dataKey = "threads";
				break;
				
				case (jeanKey == "gender" || jeanKey == "style" ||  jeanKey == "fabric"):
				dataKey = jeanKey+"s";
				break;
				
			}
			return  dataKey;
		}
			
				
		var dataLookup = function(jeanKey, id, attr){

			attr = attr||null;
			
			if (typeof jeanKey == 'undefined' || typeof id == 'undefined') return false;
			var dataKey = jeanKeyToDataKey(jeanKey);
			var dataSet = data[dataKey];
			//console.log("dataSetVV");
			//console.log(dataSet);
			dataById = 	$filter('filter')(dataSet, {id: id});
			if (typeof dataById == 'undefined') return false; //Return false when dataSet is undefined...
			
			selected = dataById[0];
			
			if (!attr) return selected;
			else return selected[attr];	
			
		}

		var getJeanById = function(id, callback){
			console.log(data.jeansList);
			callback();
		}

	  return {
		  getData:function(){return data;},
		  jeanKeyToDataKey:jeanKeyToDataKey,
			dataLookup:dataLookup,
			getJeanById : getJeanById
		};
  }

})();*/