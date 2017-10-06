'use strict';

/**
 * @ngdoc overview
 * @name amClientApp
 * @description
 * # amClientApp
 *
 * Main module of the application.
 */
angular
  .module('amClientApp', [
    //   'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.grid',
    'ui.grid.resizeColumns',
    'ui.grid.cellNav',
    'ui.bootstrap',
    'auth0.auth0',
    'angular-jwt'
  ])
  .config(config)
  .run(run);

run.$inject = ['authService'];

function run(authService) {
  // Handle the authentication result in the hash
  authService.handleAuthentication();
}

config.$inject = ['angularAuth0Provider',
  '$locationProvider',
  '$httpProvider',
  'jwtOptionsProvider', 'port', 'callback'];


function config(angularAuth0Provider, $locationProvider, $httpProvider, jwtOptionsProvider, port, callback) {
  // Initialization for the angular-auth0 library

  var callbackURI = callback + ':' + port + '/#!/callback';
  console.log("Using " + callbackURI);

  angularAuth0Provider.init({
    clientID: 'yOWNc5CAVRvDHLeGVw8BHU13HQxQHM7r',
    domain: 'hopshackle.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'arsmagica.uk',
    //    redirectUri: 'http://localhost:5000/#!/callback',
    redirectUri: callbackURI,
    scope: 'openid update:foedus'
  });


  //   $locationProvider.hashPrefix('');

  /// Comment out the line below to run the app
  // without HTML5 mode (will use hashes in routes)
  //$locationProvider.html5Mode({
  //  enabled: true
  //});

  jwtOptionsProvider.config({
    tokenGetter: function () {
      return localStorage.getItem('access_token');
    },
    whiteListedDomains: ['localhost']
  });

  $httpProvider.interceptors.push('jwtInterceptor');
}



'use strict';

angular.module('amClientApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/callback', {
        templateUrl: 'views/callback.html',
        controller: 'MainCtrl',
        controllerAs: 'vm'
      })
      .when('/:covenant/service', {
        templateUrl: 'views/service.html',
        controller: 'ServiceCtrl',
        controllerAs: 'service'
      })
      .when('/:covenant', {
        templateUrl: 'views/covenant.html',
        controller: 'CovCtrl',
        controllerAs: 'cov'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
(function () {
    
      'use strict';
    
      angular
        .module('amClientApp')
        .constant('port', 5000)
        .constant('callback', 'http://localhost');
})();
'use strict';

/**
 * @ngdoc function
 * @name amClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the amClientApp
 */
angular.module('amClientApp')
  .controller('MainCtrl', function () {
    var main = this;
    main.fghfh = '';
  })
  .controller('HeaderCtrl', ['hdr', 'authService', function (hdr, authService) {
    var header = this;
    header.hdr = hdr;
    header.auth = authService;
  }])
  .service('hdr', ['$location', function ($location) {
    // put this as a service, so that all pages can easily update where the user
    // has navigated to
    var hdr = this;
    hdr.port = $location.port();
    var numberOfColons = $location.absUrl().split(':').length;
    if (numberOfColons == 1) {
      hdr.url = $location.absUrl().split(':')[0].split('#')[0];
    } else {
      hdr.url = $location.absUrl().split(':')[1].split('#')[0];
    }

    if (hdr.url == 'http') {
      hdr.url = 'http://localhost';
    }
    console.log("Port in use is " + hdr.port);
    console.log("URL is " + hdr.url);
    hdr.covenantSelected = false;
    hdr.covenant = "";
    hdr.message = "";
    hdr.page = "index";
    hdr.setCovenant = function (covenant) {
      hdr.covenantSelected = true;
      hdr.covenant = covenant;
    };
  }]);


'use strict';
angular.module('amClientApp')
    .service('util', util);

function util() {
    
    return {

        save: function (key, value) {
            window.localStorage[key] = value;
        },
        load: function (key, defaultValue) {
            var retValue = window.localStorage[key];
            if (retValue) return retValue;
            return defaultValue;
        },
        convertToArray: function (items, separator) {
            console.log(items);
            if (items) return items.split(separator);
            return items;
        },
        seasonToNumber: function (seasonAsString) {
            switch (seasonAsString) {
                case 'Winter':
                    return 1;
                case 'Spring':
                    return 2;
                case 'Summer':
                    return 3;
                case 'Autumn':
                    return 4;
                default:
                    return 0;
            }
        },
        seasonToString: function (seasonAsNumber) {
            switch (seasonAsNumber) {
                case 1:
                    return 'Winter';
                case 2:
                    return 'Spring';
                case 3:
                    return 'Summer';
                case 4:
                    return 'Autumn';
                default:
                    return 'Unknown';
            }
        },
        createSeasonRecord: function (seasonData) {
            return {
                description: seasonData.description,
                isService: seasonData.isService,
                serviceForMagus: seasonData.serviceForMagus,
                objId: seasonData._id,
                prettyText: function () {
                    if (this.isService) {
                        return this.description; // + "<br/>[Covenant Service]";
                    }
                    return this.description;
                }
            };
        },
        emptySeasonMap: function (covenant, startYear, endYear) {
            var seasonMap = new Map();
            var seasonKeys = [];
            for (var y = startYear; y <= endYear; y++) {
                for (var s = 1; s <= 4; s++) {
                    var key = y + "-" + s;
                    seasonKeys.push(key);
                    var seasonRecord = { year: y, season: this.seasonToString(s) }
                    for (var magusName of covenant.allMagi) {
                        seasonRecord[magusName] = {};
                        seasonRecord[magusName].prettyText = function () { return "---" };
                    }
                    seasonMap.set(key, seasonRecord);
                }
            }
            var retValue = {};
            retValue.keysInOrder = seasonKeys;
            retValue.seasonMap = seasonMap;
            return retValue;
        }
    }
}


'use strict';
angular.module('amClientApp')
    .service('db', ['util', '$resource', '$q', 'hdr', db]);

function db(util, $resource, $q, hdr) {

    var baseURL = hdr.url + ':' + hdr.port + '/api';
    console.log("Using " + baseURL);

 //   var baseURL = "http://localhost\:5000/api";
    var cov_db = $resource(baseURL + "/:covenant", null, {
        'update': { method: 'PUT' }
    });
    var season_db = $resource(baseURL + "/:covenant/:magus/:objId", null, {
        'update': { method: 'PUT' }
    });

    var onError = function (res) {
        hdr.message = "Database Access Error: " + res.status + " " + res.statusText;
        if (res.status == 401) {
            hdr.message = hdr.message + "\nYou are not authorised to update data for this covenant";
        }
    };

    return {
        writeRecord: function (covenant, magus, year, season, data, callback) {
            hdr.message = "";
            data.magus = magus;
            data.year = year;
            data.season = util.seasonToNumber(season);
            data.itemsUsed = data.itemsUsed.join("|");
            if (data.objId) {
                season_db.update({ covenant: covenant, magus: magus, objId: data.objId }, JSON.stringify(data), callback, onError);
            } else {
                season_db.save({ covenant: covenant }, JSON.stringify(data), callback, onError);
            }
        },
        getCovenantDetails: function (c, callback) {
            var covenantDetails = {};
            cov_db.get({ covenant: c }, function (covRecord) {
                covenantDetails.covenantName = covRecord.name;
                covenantDetails.description = covRecord.description;
                covenantDetails.allMagi = covRecord.members;
                callback(covenantDetails);
            });
            return covenantDetails;
        },
        getMagusData: function (covenant, magus, callback) {
            var apiParams = { covenant: covenant, magus: magus };
            season_db.query(apiParams, callback);
        },
        getSeasonData: function (covenant, startYear, endYear, callback) {
            hdr.message = "";
            var thing = util.emptySeasonMap(covenant, startYear, endYear);
            var seasonKeys = thing.keysInOrder;
            var seasonMap = thing.seasonMap;
            var seasons = [];
            var promises = [];
            var db = this;
            angular.forEach(covenant.allMagi, function (m) {
                var newPromise = $q.defer();
                promises.push(newPromise.promise);
                db.getMagusData(covenant.covenantName, m, function (seasonData) {
                    for (var j = 0; j < seasonData.length; j++) {
                        var key = seasonData[j].year + "-" + seasonData[j].season;
                        if (seasonData[j].year <= endYear && seasonData[j].year >= startYear) {
                            var seasonRecord = seasonMap.get(key);
                            seasonRecord[seasonData[j].magus] = util.createSeasonRecord(seasonData[j]);
                            seasonMap.set(key, seasonRecord);
                        }
                    }
                    newPromise.resolve();
                });
            });

            $q.all(promises).then(function () {
                for (var k of seasonKeys) {
                    seasons.push(seasonMap.get(k));
                }
                if (callback) {callback(seasons);}
            });
            return seasons;
        }
    };
}
'use strict';

angular.module('amClientApp')
    .controller('CovCtrl', ['$routeParams', '$uibModal', 'util', 'db', 'uiGridConstants', 'hdr',
        function ($routeParams, $uibModal, util, db, uiGridConstants, hdr) {
            var cov = this;

            hdr.page = 'labHistory';
            hdr.setCovenant($routeParams.covenant);

            cov.apiRegister = function (gridApi) {
                cov.gridApi = gridApi;
            };

            cov.refreshColumns = function () {
                cov.columnDefs = [
                    { field: "year", width: 60, allowCellFocus: false },
                    { field: "season", width: 80, allowCellFocus: false }
                ];
                for (var i in cov.covenant.allMagi) {
                    if (cov.selected[i]) {
                        var m = cov.covenant.allMagi[i];
                        cov.columnDefs.push({
                            allowCellFocus: true,
                            displayName: m, field: m + ".prettyText()", width: "*",
                            cellTemplate: 'templates/seasonCellTemplate.html',
                            cellClass: function (grid, row, col, ri, rc) {
                                var result = "";
                                if (row.entity[col.displayName].isService) {
                                    result = 'covService';
                                }
                                if (row.entity[col.displayName].serviceForMagus) {
                                    result += ' forOtherMagus';
                                }
                                return result;
                            }
                        });
                    }
                }

                cov.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            };

            cov.startYear = parseInt(util.load($routeParams.covenant + "_sy", '1220'));
            cov.endYear = parseInt(util.load($routeParams.covenant + "_ey", '1235'));
            cov.selected = JSON.parse(util.load($routeParams.covenant + "_ms", '{}'));
            
            cov.refreshGrid = function () {
                util.save($routeParams.covenant + "_sy", cov.startYear);
                util.save($routeParams.covenant + "_ey", cov.endYear);
                util.save($routeParams.covenant + "_ms", JSON.stringify(cov.selected));
                cov.seasons = db.getSeasonData(cov.covenant, cov.startYear, cov.endYear, function (data) {
                    cov.refreshColumns();
                });
            };

            cov.covenant = db.getCovenantDetails($routeParams.covenant, function (covenant) {
                if (Object.keys(cov.selected).length == 0) {
                    for (var i in cov.covenant.allMagi) {
                        cov.selected[i] = true;
                    }
                }
                cov.refreshColumns();
                cov.seasons = db.getSeasonData(covenant, cov.startYear, cov.endYear);
            });

            cov.selectAll = function (allOn) {
                for (var i in cov.covenant.allMagi) {
                    cov.selected[i] = allOn;
                }
            };

            cov.editCell = function (grid, row, col) {
                var year = row.entity.year;
                var season = row.entity.season;
                var seasonAsInt = util.seasonToNumber(season);
                $uibModal.open({
                    templateUrl: 'templates/edit-modal.html',
                    controller: 'SeasonEditController',
                    controllerAs: 'vm',
                    resolve: {
                        year: function () { return row.entity.year; },
                        season: function () { return row.entity.season; },
                        magus: function () { return col.displayName; },
                        data: function () { return row.entity[col.displayName]; },
                        onSave: function () { return cov.refreshGrid; },
                        covenant: function () { return cov.covenant; }
                    }
                });
            }
        }]);
'use strict';

angular.module('amClientApp')
    .controller('SeasonEditController', ['$uibModalInstance', 'db', 'data', 'covenant', 'year', 'season', 'magus', 'onSave',
        function ($uibModalInstance, db, data, covenant, year, season, magus, onSave) {

            var scope = this;
            scope.year = year;
            scope.season = season;
            scope.magus = magus;
            scope.covenant = covenant;

            scope.data = {};
            scope.data.objId = data.objId;
            scope.data.description = data.description;
            scope.data.isService = data.isService;
            scope.data.serviceForMagus = data.serviceForMagus;
            scope.data.itemsUsed = data.itemsUsed ? data.itemsUsed.slice() : [];

            scope.close = function () {
                $uibModalInstance.close();
            }
            scope.save = function () {
                db.writeRecord(covenant.covenantName, magus, year, season, scope.data, function(result) {
                    onSave();
                });
                $uibModalInstance.close();
            }
        }]);
'use strict';

angular.module('amClientApp')
    .controller('ServiceCtrl', ['$routeParams', '$q', 'util', 'db', 'uiGridConstants', 'hdr',
        function ($routeParams, $q, util, db, uiGridConstants, hdr) {
            var service = this;

            hdr.page = 'service';
            hdr.setCovenant($routeParams.covenant);

            service.apiRegister = function (gridApi) {
                service.gridApi = gridApi;
            }

            service.covenant = db.getCovenantDetails($routeParams.covenant, function (covenant) {
                var allData = [];
                var promises = [];

                angular.forEach(covenant.allMagi, function (magus) {
                    // we need to do this inside a function, as JS does not have block-level scopes
                    // and we need to distinguish each promise from the next
                    var promise = $q.defer();
                    promises.push(promise.promise);

                    db.getMagusData(covenant.covenantName, magus, function (magusData) {
                        var data = {};
                        data.Magus = magus;
                        data.Service = 0;
                        // set zeros for service done for sodales
                        for (var j in covenant.allMagi) {
                            data[covenant.allMagi[j]] = 0;
                            data[covenant.allMagi[j] + "_S"] = 0;
                        }
                        if (magusData.length > 0) {
                            data.Seasons = magusData.length;
                            for (var record of magusData) {
                                if (record.serviceForMagus && record.serviceForMagus != "") {
                                    data[record.serviceForMagus] += 1;
                                    if (record.isService) data[record.serviceForMagus + "_S"] += 1;
                                    // the _S keeps track of seasons service done for other magi
                                } else {
                                    if (record.isService) data.Service += 1;
                                }
                            }
                        } else {
                            // no data for this magus
                            data.Seasons = 0;
                        }
                        allData.push(data);
                        promise.resolve();
                    });
                });

                service.columnDefs = [
                    // magus in rows, residence, service, owed then all magi in columns
                    { field: "Magus", width: "*" },
                    { field: "Seasons", width: "*" },
                    { field: "Service", width: "*" }
                ]
                for (var i in service.covenant.allMagi) {
                    var m = service.covenant.allMagi[i];
                    service.columnDefs.push({
                        displayName: m, field: m, width: "*"
                    });
                }
                service.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);

                // Now wait for all the db queries on individual magi to return
                $q.all(promises).then(function () {
                    // Now we can take account of seasons owed
                    for (var i in service.covenant.allMagi) {
                        var magus1 = service.covenant.allMagi[i];
                        for (var j in service.covenant.allMagi) {
                            if (j <= i) continue;
                            var magus2 = service.covenant.allMagi[j];
                            var oneForTwo = allData[i][magus2];
                            allData[i][magus2] -= allData[j][magus1];
                            // subtract the seasons worked by magus2 for magus 1
                            // from the seasons worked by magus1 for magus2
                            allData[j][magus1] -= oneForTwo;
                            // and vice versa
                            allData[i].Service += allData[j][magus1 + "_S"];
                            allData[j].Service += allData[i][magus2 + "_S"];
                            // and then take account of seasons of service undertaken by the other
                        }
                        allData[i][magus1] = ""; // cannot owe oneself
                    }
                    service.displayData = allData;
                });
            });
        }]);
(function () {

  'use strict';

  angular
    .module('amClientApp')
    .service('authService', authService);

  authService.$inject = ['angularAuth0', '$timeout'];

  function authService(angularAuth0, $timeout) {

    function login() {
      angularAuth0.authorize();
    }

    function handleAuthentication() {
      var mainHash = window.location.hash;
      var fudgedHash = '#/' + mainHash.slice(mainHash.indexOf('access_token'));
      angularAuth0.parseHash({ hash: fudgedHash }, function (err, authResult) {
        console.log(authResult);
        if (authResult && authResult.accessToken && authResult.idToken) {
          console.log(authResult);
          setSession(authResult);
        } else if (err) {
          $timeout(function () {
            // stuff
          });
          console.log(err);
        }
      });
    }

    function setSession(authResult) {
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
    }

    function logout() {
      // Remove tokens and expiry time from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
    }

    function isAuthenticated() {
      // Check whether the current time is past the access token's expiry time
      let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }

    return {
      login: login,
      handleAuthentication: handleAuthentication,
      setSession: setSession,
      logout: logout,
      isAuthenticated: isAuthenticated
    }
  }

})();
angular.module('amClientApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/callback.html',
    "<div class=\"jumbotron\"> <h1>You have logged in successfully</h1> </div> "
  );


  $templateCache.put('views/covenant.html',
    "<div class=\"row\"> <div class=\"col-md-6\"> <h2>Covenant of {{cov.covenant.covenantName}}</h2> <p>{{cov.covenant.description}}</p> </div> <div class=\"col-md-6 form-group\"> <!-- cov.selected is an object, with a numerically named property for each selected item --> <!-- $index is evaluated as \"0\", \"1\", etc. --> <div class=\"checkbox-inline\" ng-repeat=\"magus in cov.covenant.allMagi\"> <input ng-model=\"cov.selected[$index]\" id=\"{{magus}}\" type=\"checkbox\" name=\"{{magus}}\" value=\"\"><label for=\"{{magus}}\">{{magus}}</label> </div> <div class=\"btn btn-primary btn-small\" ng-click=\"cov.selectAll(true)\"> Select All </div> <div class=\"btn btn-primary btn-small\" ng-click=\"cov.selectAll(false)\"> Deselect All </div> <p> </p><div class=\"form-horizontal form-inline\"> <label for=\"startYear\">From </label> <input id=\"startYear\" type=\"number\" name=\"startYear\" min=\"1220\" max=\"1300\" required class=\"form-control\" ng-model=\"cov.startYear\"> <label for=\"endYear\">To </label> <input id=\"endYear\" type=\"number\" name=\"endYear\" min=\"1220\" max=\"1300\" required class=\"form-control\" ng-model=\"cov.endYear\"> <div class=\"btn btn-lg btn-success\" ng-click=\"cov.refreshGrid()\">Refresh</div> </div> <p></p> </div> </div>  <div> <div ui-grid=\"{ data: cov.seasons, enableSorting: false, columnDefs: cov.columnDefs, rowHeight: 66,\r" +
    "\n" +
    "        onRegisterApi: cov.apiRegister }\" ui-grid-resize-columns class=\"myGrid\" ui-grid-cellnav></div> </div>"
  );


  $templateCache.put('views/main.html',
    "<div class=\"jumbotron\"> <h1>Select your covenant</h1> <p> <a class=\"btn btn-lg btn-success\" ng-href=\"#!/Foedus\" ng-click=\"hdr.setCovenant('Foedus')\">Foedus <span class=\"glyphicon glyphicon-ok\"></span></a> <a class=\"btn btn-lg btn-success\" ng-href=\"#!/Aoide\" ng-click=\"hdr.setCovenant('Aoide')\">Aoide <span class=\"glyphicon glyphicon-ok\"></span></a> </p> </div> "
  );


  $templateCache.put('views/service.html',
    "<div> <div> <p> The table shows the number of seasons a magus has been in the covenant (measured from the number of seasons that have an entry on the Lab History page), the number of seasons service they have provided to the covenant, and seasons owed/owing to their sodales. Reading a line horizontally for a magus, a positive number indicates net seasons provided to the magus in the column header, and hence that they are owed, while a negative number indicates a net debt to the magus. </p></div> <div ui-grid=\"{ data: service.displayData, enableSorting: true, columnDefs: service.columnDefs,\r" +
    "\n" +
    "        onRegisterApi: service.apiRegister }\" ui-grid-resize-columns class=\"myGrid\"></div> </div>"
  );


  $templateCache.put('templates/edit-modal.html',
    "<div> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"vm.close()\"> <span aria-hidden=\"true\">&times;</span> </button> <h2 class=\"modal-title\"><strong>{{vm.magus}}</strong> : {{vm.season}} of {{vm.year}}</h2> </div> <div class=\"modal-body\"> <div class=\"form-group\"> <label for=\"detail\">Description </label> <textarea class=\"form-control\" rows=\"5\" id=\"detail\" ng-model=\"vm.data.description\"></textarea> </div> <div class=\"form-group\"> <div class=\"checkbox\"> <label><input type=\"checkbox\" id=\"isService\" ng-model=\"vm.data.isService\"> Covenant Service? </label> </div> <select class=\"form-control\" id=\"serviceFor\" ng-model=\"vm.data.serviceForMagus\"> <option></option> <option ng-repeat=\"magi in vm.covenant.allMagi | filter : '!' + vm.magus\">{{magi}}</option> </select> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"vm.save()\">Save changes</button> <button type=\"button\" class=\"btn btn-secondary\" ng-click=\"vm.close()\">Close</button> </div> </div>"
  );


  $templateCache.put('templates/seasonCellTemplate.html',
    "<div ng-bind-html=\"COL_FIELD\" title=\"{{COL_FIELD}}\" ng-dblclick=\"grid.appScope.cov.editCell(grid, row, col)\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<!-- <button ng-show=\"grid.appScope.cov.allowEdit\" ng-click=\"grid.appScope.cov.editCell(grid, row, col)\"\r" +
    "\n" +
    "class=\"btn btn-block btn-default btn-xs\">Edit</button>' "
  );

}]);
