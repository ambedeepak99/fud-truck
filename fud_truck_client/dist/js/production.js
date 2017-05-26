/**
 * @namespace app
 * @description This file is used to redirect application state e.g. login, mailer etc.
 * @author Prathamesh Parab
 */
var app = angular.module("done", ["ngRoute", "ui.bootstrap"]);

app.config(["$httpProvider", "$routeProvider", function ($httpProvider, $routeProvider) {
    $routeProvider
        .when("/", {
            redirectTo: "/login"
        })
        .when("/graph", {
            templateUrl: "templates/ftruck/ftruck.html",
            controller: "ftruckCtrl",
            controllerAs: "vmlogin"
        })

        .when("/login", {
            templateUrl: "templates/login/login.html",
            controller: "loginCtrl",
            controllerAs: "log"
        })

        .otherwise({
            redirectTo: "/login"
        });
}]);

function containerCtrl(Utils) {
    var vm = this;
};
app.controller('containerCtrl', ['Utils', containerCtrl]);


/**
 * This file is used to generate custom directive to perform some oprtaion with dom element with class ,attribute and element.
 * @author Prathamesh Parab
 */
app.directive('hcPieChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            data: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}:{point.y} <b>({point.percentage:.1f}%)</b>'
                },
                plotOptions: {
                    pie: {
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [
                    {
                        name: scope.title,
                        colorByPoint: true,
                        data: scope.data
                    }
                ]
            });
        }
    };
});

app.directive('clientAutoComplete', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            attrs.autocomplete({
                source: function (request, response) {

                    //term has the data typed by the user
                    var params = request.term;

                    //simulates api call with odata $filter
                    var data = scope.dataSource;
                    if (data) {
                        var result = $filter('filter')(data, {name: params});
                        angular.forEach(result, function (item) {
                            item['value'] = item['name'];
                        });
                    }
                    response(result);

                },
                minLength: 1,
                select: function (event, ui) {
                    //force a digest cycle to update the views
                    scope.$apply(function () {
                        scope.setClientData(ui.item);
                    });
                }

            });
        }

    };
});


app.directive('hcColumnChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            axistitle: '=',
            data: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], {
                chart: {
                    type: 'column'
                },

                title: {
                    text: scope.title
                },
                subtitle: {
                    text: ''
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'middle',
                    layout: 'vertical'
                },

                xAxis: {
                    categories: scope.axistitle.xTitle,
                    labels: {
                        x: -10
                    }
                },

                yAxis: {
                    allowDecimals: false,
                    title: {
                        text: scope.axistitle.yTitle
                    }
                },

                series: scope.data,

                responsive: {
                    rules: [
                        {
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                    layout: 'horizontal'
                                },
                                yAxis: {
                                    labels: {
                                        align: 'left',
                                        x: 0,
                                        y: -5
                                    },
                                    title: {
                                        text: null
                                    }
                                },
                                subtitle: {
                                    text: null
                                },
                                credits: {
                                    enabled: false
                                }
                            }
                        }
                    ]
                }
            });
        }
    };
});


/**
 * This file is used to define constants, services
 * @author Prathamesh Parab
 */
app.factory('Utils', function () {

    var constants = {
        BASE_URL: "http://10.40.13.71:3001/",
        SERVER_ERROR: "There is no internet connection or server unreachable.",
        SETTING: {
            SOUND_NOTIFY_SETTING_KEY: "SOUNDNOTIFY"
        }
    };

    var encodeDecodeFunctions = {
        encodeString: encodeString,
        decodeString: decodeString
    }

    function encodeString(originalString) {
        return Base64.encode(originalString);
    }

    function decodeString(encodedString) {
        return Base64.decode(encodedString);
    }

    /**
     * This section build for store values in store section
     * @type {{setStorage: setStorage, getStorage: getStorage, deleteStorage: deleteStorage}}
     * @author Prathamesh Parab
     */

    var soundNotifyFunctions = {
        playTruckTone: playTruckTone
    }

    function playTruckTone() {
        try {
            startTruckTone.pause();
            startTruckTone.currentTime = 0;
            startTruckTone.play();

        }
        catch (e) {
            throw Error(e);
        }
    }

    var storageFunctions = {
        setStorage: setStorage,
        getStorage: getStorage,
        deleteStorage: deleteStorage
    };

    function setStorage(key, value) {
        localStorage.setItem(key, value);
    }

    function getStorage(key) {
        var value = localStorage.getItem(key);
        if (value)
            return value;
        else
            return value;
    }

    function deleteStorage(key) {
        localStorage.removeItem(key);
    }


    return{
        CONSTANTS: constants,
        STORAGE: storageFunctions,
        SOUNDNOTIFY: soundNotifyFunctions,
        ENCODE_DECODE: encodeDecodeFunctions
    }
});

app.factory('WebService', ['$http', 'Utils', "$location", function ($http, Utils, $location) {

        var BASE_URL = Utils.CONSTANTS.BASE_URL;
        var finalResult = {
            "success": false,
            "response": null
        }
        var animation_delay = 750;
        var WebServiceFunctions = {
            validatelogin: validatelogin,
            getAllPlaces: getAllPlaces,
            getTruckInfoByCord: getTruckInfoByCord,
            createAlert: createAlert,
            signUp: signUp
        }

        /**
         * checkAuthorization - This function is used to check authorization token expire or not
         * @param errCode
         * @param callback
         * @author Prathamesh parab
         */
        function checkAuthorization(err, callback) {
            if (err.code == 401 || err.code == 402) {
                createAlert(1, "your session has been expire please try to login again", 3);
                Utils.STORAGE.deleteStorage("access-token");
                $location.path('/login');
            } else {
                createAlert(1, Utils.CONSTANTS.SERVER_ERROR, 3);
                $location.path('/login');
                callback(finalResult);
            }
        }

        /**rakesh.s
         * rash123
         * validatelogin - This function is used to validate the user creaditial
         * @param loginInfo
         * @param callback
         * @author Prathamesh Parab
         */
        function validatelogin(loginInfo, callback) {
            var post_request = {
                'username': loginInfo.uName,
                'password': loginInfo.pwd
            };

            var request_config = { headers: {  "Content-Type": 'application/json',
                "authorization": Utils.STORAGE.getStorage("access_token")
            } };

            $http.post(BASE_URL + "user/signin", post_request, request_config)
                .success(function (data) {
                    finalResult.success = true;
                    finalResult.response = data;
                    callback(finalResult);
                }).error(function (err) {
                    checkAuthorization(err);
                });
        };

        /**
         * signUp - This function is used to Rgister New user
         * @param loginInfo
         * @param callback
         * @author Prathamesh Parab
         */

        function signUp(loginInfo, callback) {
            var post_request = {
                'username': loginInfo.uName,
                'password': loginInfo.pwd,
                'email': loginInfo.email
            };

            var request_config = { headers: {  "Content-Type": 'application/json',
                "authorization": Utils.STORAGE.getStorage("access_token")
            } };

            $http.post(BASE_URL + "user/signup", post_request, request_config)
                .success(function (data) {
                    finalResult.success = true;
                    finalResult.response = data;
                    callback(finalResult);
                }).error(function (err) {
                    checkAuthorization(err);
                });
        };

        /**
         * getAllPlaces - This service get all places which are present in SF
         * @param loginInfo
         * @param callback
         * @author prathamesh parab
         */

        function getAllPlaces(loginInfo, callback) {
            var request_config = { headers: {  "Content-Type": 'application/json',
                "authorization": Utils.STORAGE.getStorage("access_token")
            } };

            $http.get(BASE_URL + "v1/datasf/getAllData", request_config)
                .success(function (data) {
                    finalResult.success = true;
                    finalResult.response = data;
                    callback(finalResult);
                }).error(function (err) {
                    checkAuthorization(err);
                });
        };

        /**
         * getTruckInfoByCord - This service get all avaliable truck which are present within this co-ordinates
         * @param coordinates
         * @param callback
         * @author  prathamesh parab
         */

        function getTruckInfoByCord(coordinates, callback) {

            var url = "";

            var request_config = { headers: {  "Content-Type": 'application/json',
                "authorization": Utils.STORAGE.getStorage("access_token")
            } };

            if (coordinates.lat != "" && coordinates.long != "") {
                //url =BASE_URL+'?$where=within_circle('+ location +')';
                url = BASE_URL + "v1/datasf/getCircleData/1000?lat=" + coordinates.lat + "&long=" + coordinates.long;
            } else {
                url = BASE_URL + "v1/datasf/getAllData";
            }

            $http.get(url, request_config)
                .success(function (data) {
                    finalResult.success = true;
                    finalResult.response = data;
                    callback(finalResult);
                }).error(function (err) {
                    checkAuthorization(err);
                });
        };

        /**
         * createAlert - This service create different alert based on severity
         * @param severity
         * @param message
         * @param timeout
         * @author prathamesh parab
         */

        function createAlert(severity, message, timeout) {
            $("div.alert-box.active").remove();
            timeout *= 1000;
            var alert_div;
            switch (severity) {
                case 1:
                    alert_div = $("div.alert-box.alert-msg").clone();
                    break;
                case 2:
                    alert_div = $("div.alert-box.success-msg").clone();
                    break;
                case 3:
                    alert_div = $("div.alert-box.warning-msg").clone();
                    break;
                default:
                    alert_div = $("div.alert-box.alert-msg").clone();
                    break;
            }
            $(alert_div).addClass("active");
            $(alert_div).find(".alert-message").text(message);
            $("#alert-container").append(alert_div);
            $(alert_div).slideDown(animation_delay);
            if (timeout) {
                setTimeout(function () {
                    $(alert_div).slideUp(animation_delay, function () {
                        $(alert_div).remove();
                    });
                }, timeout);
            }
        }
        return{
            WEBSERVICES: WebServiceFunctions
        }
    }]
);



/**
 * This file is used to generate custome filter
 * @author Prathamesh Parab
 */

app.filter('filterMultipleForOrder', ['$filter', function ($filter) {
    return function (items, keyObj) {
        var filterObj = {
            data: items,
            filteredData: [],
            applyCustomFilter: applyCustomFilter
        };

        function applyCustomFilter(keyObj, data) {
            var myFilterData = [];
            var customCondition = {
                searchText: true,
                orderStatus: true,
                multipleOrderStatus:true,
                outlet: true,
                subarea: true,
                clientPlatform: true,
                deliveryProvider: true,
                dineinStatus:true
            };
            if (data && data.length) {
                angular.forEach(data, function (order, index) {
                    if (keyObj.orderStatus && order.order_status && order.order_status.status)
                        customCondition.orderStatus = (order.order_status.status.toLowerCase()===keyObj.orderStatus.toLowerCase());

                    if (keyObj.multipleOrderStatus && order.order_status && order.order_status.status)
                        customCondition.multipleOrderStatus =(keyObj.multipleOrderStatus.toLowerCase().indexOf(order.order_status.status.toLowerCase())>-1);

                    if (keyObj.clientPlatform && order.client_platform)
                        customCondition.clientPlatform = (order.client_platform.toLowerCase().indexOf(keyObj.clientPlatform.old_name.toLowerCase()) > -1);

                    if (keyObj.outlet && order.outlet && order.outlet.name)
                        customCondition.outlet = (order.outlet.name.toLowerCase().indexOf(keyObj.outlet.name.toLowerCase()) > -1);

                    if (keyObj.subarea && order.user && order.user.address) {
                        if (order.user.address.subarea_name)
                            customCondition.subarea = (order.user.address.subarea_name.toLowerCase().indexOf(keyObj.subarea.toLowerCase()) > -1);
                        else if (order.user.address.area_name)
                            customCondition.subarea = (order.user.address.area_name.toLowerCase().indexOf(keyObj.subarea.toLowerCase()) > -1);
                    }
                    if (keyObj.deliveryProvider && order.delivery_provider)
                        customCondition.deliveryProvider = (order.delivery_provider.toLowerCase().indexOf(keyObj.deliveryProvider.toLowerCase()) > -1);

                    if (keyObj.dineinStatus && order.reservation_status)
                        customCondition.dineinStatus = (order.reservation_status.toLowerCase()===keyObj.dineinStatus.toLowerCase());

                    if (keyObj.searchText)
                        customCondition.searchText = (JSON.stringify(order).toLowerCase().indexOf(keyObj.searchText.toLowerCase()) > -1);

                    if (customCondition.orderStatus &&
                        customCondition.outlet &&
                        customCondition.subarea &&
                        customCondition.clientPlatform &&
                        customCondition.searchText &&
                        customCondition.multipleOrderStatus &&
                        customCondition.deliveryProvider &&
                        customCondition.dineinStatus) {
                        myFilterData.push(order);
                    }
                });
            }
            return myFilterData;
        };

        if (keyObj)
            filterObj.filteredData = filterObj.applyCustomFilter(keyObj, filterObj.data);

        return filterObj.filteredData;
    }
}]);

app.filter('unique', function () {
    return function (items, filterOn) {
        if (filterOn === false) {
            return items;
        }
        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});

app.filter('zpad', function () {
    return function (input, n) {
        if (input === undefined)
            input = ""
        if (input.length >= n)
            return input
        var zeros = "0".repeat(n);
        return (zeros + input).slice(-1 * n)
    };
});

app.filter('getTotal', function () {
    return function (inputArray, additionValue, multiplyer) {
        var total = 0;
        if (inputArray !== undefined && inputArray.length >= 1)
            for (var i = 0; i < inputArray.length; i++)
                if (multiplyer !== undefined)
                    total = total + (inputArray[i][additionValue] * inputArray[i][multiplyer]);
                else
                    total = total + inputArray[i][additionValue];
        return total;
    };
});
app.filter('timeSpanStringToDate', function () {
    return function (timeSpan,customDateString) {
        if(timeSpan)
        {
            var current_time = new Date();
            if(customDateString)
            {
                current_time=Date.parse(customDateString);
            }
            var myDate = new Date(current_time.toLocaleDateString() +" "+ timeSpan);
            return myDate;
        }
        else{
            return timeSpan;
        }
    };
});

/**
 * Truck controller - This control is used to Find truck location and details of truck
 * @param $scope {object} Scope object
 * @param $location {object} location object
 * @param Utils {object} Utils object
 * @param WebService {object} WebService object
 * @param $interval {object} interval object
 * @author Prathamesh Parab
 * @constructor
 */
function ftruckCtrl($scope, $location, Utils, WebService, $interval) {

    var vm = this;
    var WEBSERVICE = WebService.WEBSERVICES;
    var SOUNDNOTIFY = Utils.SOUNDNOTIFY;
    var STORAGE = Utils.STORAGE;
    if (STORAGE.getStorage("access_token")) {
        var loginInfo = true;
        vm.loading = false;
        vm.loading_place = true;
        vm.isSearch = false;
        vm.isSearchMap = true;
        vm.place = "";
        vm.place.value = "";
        vm.truckPlaces = [];
        vm.places = [];
        vm.selectedData = null;
        vm.search = search;
        vm.searchMap = searchMap;

        var coordinates = {
            lat: "",
            long: ""
        }

        /**
         * getAllPlaces - This service is used to get all places
         * @param loginInfo {object} object of params
         * @author Prathamesh parab
         */

        WEBSERVICE.getAllPlaces(loginInfo, function (result) {
            vm.loading = false;
            vm.loading_place = false;
            vm.isSearch = false;
            vm.isSearchMap = true;
            if (result && result.success) {
                if (result && result.response.code === 2000) {
                    angular.forEach(result.response.data, function (value, key) {
                        vm.places.push({label: value.address, value: value.latitude + "," + value.longitude})
                    });
                }
                else {
                    vm.loading = false;
                }
            }
            else {
                vm.loading = false;
            }
        });

        /**
         * search - This function is used to find the list area co-ordinates which are going to search
         * @author : Prathamesh parab
         */

         function search() {
            var latlong = "";
            var myarr = [];

            if (vm.place && (vm.place != "" || vm.place != undefined)) {
                latlong = vm.place.value;
            }

            if (latlong != "" && latlong != undefined) {
                myarr = latlong.split(",");
                coordinates = {
                    lat: (myarr[0]) ? parseFloat(myarr[0]).toFixed(5) : 0.00000,
                    long: (myarr[1]) ? parseFloat(myarr[1]).toFixed(5) : 0.00000
                }
                getTruckInfo(coordinates);
            }
            else {
                WEBSERVICE.createAlert(1, "Unable to find address", 3);
                vm.isSearchMap = true;
                vm.isSearch = false;
                vm.loading = false;
            }
        }

        function searchMap() {
            var latlong = "";
            var myarr = [];
            vm.isSearch = true;

            if (vm.place && (vm.place != "" || vm.place != undefined)) {
                latlong = vm.place.value;
            }

            if (latlong != "" && latlong != undefined) {
                myarr = latlong.split(",");
                coordinates = {
                    lat: (myarr[0]) ? parseFloat(myarr[0]).toFixed(5) : 0.00000,
                    long: (myarr[1]) ? parseFloat(myarr[1]).toFixed(5) : 0.00000
                }
                getTruckInfo(coordinates);
            }
            else {
                WEBSERVICE.createAlert(1, "Unable to find address", 3);
                vm.isSearchMap = false;
                vm.isSearch = true;
                vm.loading = false;
            }
        }

        /**
         *getTruckInfo -  This function is used to find the list of trucks avaliable in specific location
         * @param coordinates {object} object of lat and lng
         * @author : Prathamesh parab
         */

        function getTruckInfo(coordinates) {
            vm.loading = true;
            if (coordinates.lat != "0.00000" && coordinates.long != "0.00000") {
                WEBSERVICE.getTruckInfoByCord(coordinates, function (result) {
                    if (result && result.success) {

                        vm.loading = false;
                        vm.isSearch = true;
                        vm.isSearchMap = false;

                        var response = result.response.data;
                        if (response && response != null) {

                            vm.truckPlaces = response;
                            var mapOptions = {
                                zoom: 15,
                                center: new google.maps.LatLng(
                                    (coordinates.lat) ? coordinates.lat : 37.773972,
                                    (coordinates.long) ? coordinates.long : -122.431297
                                )
                            }

                            $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
                            google.maps.event.trigger($scope.map, 'resize');

                            var image = '../img/location-truck-1.png';
                            var image_2 = '../img/location-truck-2.png';

                            vm.markers = [];

                            var infoWindow = new google.maps.InfoWindow({maxWidth: 320, maxHeight: 35});

                            var createMarker = function (info) {

                                var R = 6371; // Radius of the earth in km
                                var dLat = deg2rad(parseFloat(info.latitude).toFixed(5) - coordinates.lat);  // deg2rad below
                                var dLon = deg2rad(parseFloat(info.longitude).toFixed(5) - coordinates.long);
                                var a =
                                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                        Math.cos(deg2rad(coordinates.lat)) * Math.cos(deg2rad(coordinates.long)) *
                                        Math.sin(dLon / 2) * Math.sin(dLon / 2)
                                    ;
                                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                var distance = parseFloat(R * c).toFixed(5); // Distance in km

                                if(isNaN(distance))
                                {
                                    distance = "-";
                                }else{
                                    distance = distance + " Km";
                                }

                                var address = (info.address) ? info.address : "Address Info not avaliable.";
                                var fooditems = (info.fooditems) ? info.fooditems : "Fooditem Info not avaliable.";
                                var applicant = (info.applicant) ? info.applicant : "Applicant Info not avaliable.";

                                fooditems = fooditems.split(":");
                                fooditems = fooditems.join();

                                var marker = new google.maps.Marker({
                                    map: $scope.map,
                                    icon: image,
                                    position: new google.maps.LatLng(info.latitude, info.longitude)

                                });

                                marker.content =
                                    '<div id="content">' +
                                    '<div id="siteNotice">' +
                                    '</div>' +
                                    '<p id="firstHeading" class="firstHeading"><b>' + applicant + '</b></p><p>(' + address + ')</p>' +
                                    '<div id="bodyContent">' +
                                    '<p>' + fooditems + '</p>' +
                                    '<p>' + distance + '</p>' +
                                    '</div>' +
                                    '</div>';

                                google.maps.event.addListener(marker, 'mouseover', function () {
                                    infoWindow.setContent(marker.content);
                                    infoWindow.open($scope.map, marker);
                                    marker.setIcon(image_2);
                                    SOUNDNOTIFY.playTruckTone();
                                });

                                google.maps.event.addListener(marker, 'mouseout', function () {
                                    infoWindow.close($scope.map, marker);
                                    marker.setIcon(image);
                                });

                                google.maps.event.addListener(marker, 'click', function () {
                                    infoWindow.setContent(marker.content);
                                    infoWindow.open($scope.map, marker);
                                    marker.setIcon(image_2);
                                });

                            }
                            angular.forEach(vm.truckPlaces, function (value, key) {
                                createMarker(vm.truckPlaces[key]);
                            });

                        }
                        else {
                            WEBSERVICE.createAlert(1, "No records founds", 3);
                            vm.isSearch = false;
                            vm.loading = false;
                        }
                    }
                    else {
                        WEBSERVICE.createAlert(1, "Server error found", 3);
                        vm.isSearch = false;
                        vm.loading = false;
                    }
                });
            } else {
                if(vm.isSearch == true)
                {
                    vm.isSearchMap = false;
                    vm.loading = false;
                    WEBSERVICE.createAlert(1, "No Truck avaliable in this route", 3);
                }else
                {
                    vm.isSearch = false;
                    vm.isSearchMap = true;
                    vm.loading = false;
                    WEBSERVICE.createAlert(1, "No Truck avaliable in this route", 3);
                }
            }
        }

        vm.logout = function () {
            STORAGE.deleteStorage("access_token");
            $location.path('/login');
            location.reload();
        }

        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }
    } else {
        STORAGE.deleteStorage("access_token");
        $location.path('/login');
        location.reload();
    }
};
app.controller('ftruckCtrl', ['$scope', '$location', 'Utils', 'WebService', '$interval', ftruckCtrl]);


/**
 * loginCtrl - This controller is used to perform login token based operation
 * @param $scope {object} Scope object
 * @param $location {object} location object
 * @param Utils {object} Utils object
 * @param WebService {object} WebService object
 * @param $interval {object} interval object
 * @author Prathamesh Parab
 * @constructor
 */
function loginCtrl($scope, $location, Utils, WebService, $interval) {

    var vm = this;
    vm.issignup = false;
    vm.signupbtn = true;
    vm.loginbtn = false;
    vm.loading_1 = false;
    var WEBSERVICE = WebService.WEBSERVICES;
    var SOUNDNOTIFY = Utils.SOUNDNOTIFY;
    var STORAGE = Utils.STORAGE;

    vm.user = {
        uName: "",
        pwd: "",
        email:""
    };

    vm.submit = submit;
    vm.signup = signup;
    vm.logAgn = logAgn;

    /**
     * submit - This function is used to validate the user creaditial
     * @author Prathamesh Parab
     */
    if (!STORAGE.getStorage("access_token")) {
        function submit() {
            if(vm.issignup == true)
            {
                vm.signupbtn = false;
                if (vm.user.uName && vm.user.pwd && vm.user.email) {
                    WEBSERVICE.signUp(vm.user, function (result) {
                        if (result && result.response.code === 2000) {
                            vm.issignup = false;
                            vm.signupbtn = true;
                            vm.loginbtn = false;
                            WEBSERVICE.createAlert(2, "User Register Successfully", 3);
                            clearAll();
                            $location.path('/login');
                        }
                        else {
                            WEBSERVICE.createAlert(1, "User Already Exits", 3);
                        }
                    });
                } else {
                    WEBSERVICE.createAlert(1, "Please fill all mandatory details", 3);
                }
            }else{
                if (vm.user.uName && vm.user.pwd) {
                    WEBSERVICE.validatelogin(vm.user, function (result) {
                        if (result && result.response.code === 2000) {
                            STORAGE.setStorage("access_token", result.response.data.token);
                            $location.path('/graph');
                        }
                        else {
                            WEBSERVICE.createAlert(1, "Invalid username and password", 3);
                        }
                    });
                } else {
                    WEBSERVICE.createAlert(1, "Please fill all mandatory details", 3);
                }
            }
        }

        function signup()
        {
            vm.issignup = true;
            vm.signupbtn = false;
            vm.loginbtn = true;
        }

        function logAgn()
        {
            vm.issignup = false;
            vm.signupbtn = true;
            vm.loginbtn = false;
        }

        function clearAll()
        {
            vm.user = {
                uName: "",
                pwd: "",
                email:""
            };
        }

    } else {
        $location.path('/graph');
    }

};
app.controller('loginCtrl', ['$scope', '$location', 'Utils', 'WebService', '$interval', loginCtrl]);

