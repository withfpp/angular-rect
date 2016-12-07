'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}])
.service('helperService', helperService)
.controller('View1Ctrl', CrownCtrl)

function CrownCtrl(helperService) {

    var intersection;
    var stage;
    var SIZE = 100;
    var squareOne;
    var squareTwo;

    var vm = this;
    vm.hello = 'Hi, There'

    vm.init = init;
    vm.drag = drag;
    vm.intersect = intersect

    vm.init()


    function init() {
        var canvas = document.getElementsByTagName('canvas')[0];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stage = new createjs.Stage("canvas");

        squareOne = helperService.drawRect(100, 100, SIZE, SIZE, "#e67e22", vm.drag);
        squareTwo = helperService.drawRect(300, 200, SIZE, SIZE, "#e74c3c", vm.drag);
        stage.addChild(squareOne);
        stage.addChild(squareTwo);

        intersection = vm.intersect(squareOne, squareTwo);

        stage.update();
    }

    function drag(evt) {

        evt.currentTarget.x = evt.stageX - SIZE;
        evt.currentTarget.y = evt.stageY - SIZE;

        intersection.graphics.clear();
        intersection = vm.intersect(squareOne, squareTwo);

        stage.update();   
    }

    function intersect(r1, r2) {
        var leftMost = (r1.x < r2.x) ? r1 : r2;
        var rightMost = (r1.x > r2.x) ? r1 : r2;
        var upMost = (r1.y < r2.y) ? r1 : r2;
        var downMost = (r1.y > r2.y) ? r1 : r2;

        var upperLeft = [rightMost.x, downMost.y];
        var upperRight = [leftMost.x + leftMost._bounds.width, downMost.y];
        var lowerLeft = [rightMost.x, upMost.y + upMost._bounds.height];
        var lowerRight = [leftMost.x + leftMost._bounds.width, upMost.y + upMost._bounds.height];

        var x = upperLeft[0];
        var y = upperLeft[1];

        var width = upperRight[0] - upperLeft[0];
        var height = lowerLeft[1] - upperLeft[1];

        if (width < 0 || height < 0) {
            width = 0;
            height = 0;
        }
        
        var square = helperService.drawRect(x, y, width, height, '#27ae60', drag);
        stage.addChild(square);

        return square;
    }

}

CrownCtrl.$inject = ['helperService'];

function helperService() {
    
    function drawRect(x, y, width, height, fill, eventCB) {
        var graphics = new createjs.Graphics()
            .beginFill(fill)
            .drawRect(0, 0, width, height)
            .endFill();
        var square = new createjs.Shape(graphics);
        square.name = "square"
        square.on("pressmove", eventCB);
        square.setBounds(0, 0, width, height);
        square.x = x;
        square.y = y;
        return square;
    }

    return { drawRect }
}




