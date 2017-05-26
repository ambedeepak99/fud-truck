/**
 * This File is used to redirect applicates state.
 * @author Prathamesh
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

