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

