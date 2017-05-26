/**
 * This file is used to define constants, services
 * @author Prathamesh Parab
 */
app.factory('Utils', function () {

    var constants = {
        BASE_URL: "http://localhost:3001/",
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


    return {
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
        function checkAuthorization(err) {
            if (err)
                if (err.code == 401 || err.code == 402) {
                    createAlert(1, "your session has been expire please try to login again", 3);
                    Utils.STORAGE.deleteStorage("access_token");
                    $location.path('/login');
                } else {
                    createAlert(1, Utils.CONSTANTS.SERVER_ERROR, 3);
                    //$location.path('/login');
                }
        }

        /**
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

            var request_config = {
                headers: {
                    "Content-Type": 'application/json',
                    "authorization": Utils.STORAGE.getStorage("access_token")
                }
            };

            $http.post(BASE_URL + "user/signin", post_request, request_config)
                .success(function (data) {
                    finalResult.success = true;
                    finalResult.response = data;
                    callback(finalResult);
                }).error(function (err) {
                checkAuthorization(err);
                finalResult.success = false;
                finalResult.response = err;
                callback(finalResult);
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

            var request_config = {
                headers: {
                    "Content-Type": 'application/json',
                    "authorization": Utils.STORAGE.getStorage("access_token")
                }
            };

            $http.post(BASE_URL + "user/signup", post_request, request_config)
                .success(function (data) {
                    finalResult.success = true;
                    finalResult.response = data;
                    callback(finalResult);
                }).error(function (err) {
                checkAuthorization(err);
                finalResult.success = false;
                finalResult.response = err;
                callback(finalResult);
            });
        };

        /**
         * getAllPlaces - This service get all places which are present in SF
         * @param loginInfo
         * @param callback
         * @author prathamesh parab
         */

        function getAllPlaces(loginInfo, callback) {
            var request_config = {
                headers: {
                    "Content-Type": 'application/json',
                    "authorization": Utils.STORAGE.getStorage("access_token")
                }
            };

            $http.get(BASE_URL + "v1/datasf/getAllData", request_config)
                .success(function (data) {
                    finalResult.success = true;
                    finalResult.response = data;
                    callback(finalResult);
                }).error(function (err) {
                checkAuthorization(err);
                finalResult.success = false;
                finalResult.response = err;
                callback(finalResult);
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

            var request_config = {
                headers: {
                    "Content-Type": 'application/json',
                    "authorization": Utils.STORAGE.getStorage("access_token")
                }
            };

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
                finalResult.success = false;
                finalResult.response = err;
                callback(finalResult);
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

        return {
            WEBSERVICES: WebServiceFunctions
        }
    }]
);


