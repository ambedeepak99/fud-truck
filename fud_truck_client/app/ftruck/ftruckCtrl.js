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

