var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
// var ValueList = require("nativescript-drop-down").ValueList;

function createViewModel() {
    var viewModel = new Observable();
    var countDown;
    var clock;

    onLoad(viewModel);

    var decrementTimer = function() {
        countDown.setSeconds(countDown.getSeconds() - 1);
        viewModel.set("message", formatTime());

        if(countDown <= new Date("1/1/2018 00:00:00")){
            clearInterval(clock);
            viewModel.set("message", "Done");
        }
    }
    var startTimer = function() {
        var timerValue = viewModel.get("timerValue");

        var index = viewModel.timerValue;
        var timerValue = viewModel.timerMinutes.getValue(index);

        countDown = new Date("1/1/2018 00:" + timerValue + ":01")
        clock = setInterval(decrementTimer, 1000);
    }

    var formatTime = function() {
        seconds =  countDown.getSeconds() < 10 ? "0" +  countDown.getSeconds() :  countDown.getSeconds();
        return countDown.getMinutes() + ":" + seconds;
    }

    viewModel.onTap = function() {
        startTimer();        
    }

    return viewModel;
}

exports.createViewModel = createViewModel;

function onLoad(viewModel)
{
    var items = [];

    for (var loop = 5; loop < 60; loop += 5) {
        items.push({ValueMember: loop, DisplayMember: loop.toString() + " minutes"} );
    }

    var itemsSource = new ValueList(items);

    viewModel.set("timerMinutes", itemsSource);
    viewModel.timerValue = 2; //default to 15 minutes
}

//https://github.com/PeterStaev/NativeScript-Drop-Down/issues/2
var ValueList = (function () {
    function ValueList(array) {
        this._array = array;
    }
    Object.defineProperty(ValueList.prototype, "length", {
        get: function () { return this._array.length; },
        enumerable: true,
        configurable: true
    });
    ValueList.prototype.getItem = function (index) {
        return this.getText(index);
    };
    ValueList.prototype.getText = function (index) {
        if (index < 0
            || index >= this._array.length) {
            return "";
        }
        return this._array[index].DisplayMember;
    };
    ValueList.prototype.getValue = function (index) {
        if (index < 0
            || index >= this._array.length) {
            return null;
        }
        return this._array[index].ValueMember;
    };
    ValueList.prototype.getIndex = function (value) {
        var loop;
        for (loop = 0; loop < this._array.length; loop++) {
            if (this.getValue(loop) == value) {
                return loop;
            }
        }
        return -1;
    };
    return ValueList;
})();