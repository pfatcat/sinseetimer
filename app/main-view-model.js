var Observable = require("data/observable").Observable;
var sound = require("nativescript-sound");
var bell = sound.create("~/media/bell.mp3"); // preload the audio file
const ValueList = require("~/valuelist.js");
const frameModule = require("ui/frame");

function createViewModel() {
    var viewModel = new Observable();
    var countDown;
    var clock;

    const topmost = frameModule.topmost();

    onLoad(viewModel);

    var decrementTimer = function() {
        countDown.setSeconds(countDown.getSeconds() - 1);
        viewModel.set("message", formatTime());

        //TODO: add warning sound to let user know when meditation is almost over

        if(countDown <= new Date("1/1/2018 00:00:00")){
            clearInterval(clock);
            bell.play(); //play end of meditation bell
            viewModel.set("message", "Done");
        }
    }

    var startTimer = function() {

        //TODO: add warmup countdown, then play start bell
        clearInterval(clock);

        var timerValue = viewModel.get("timerValue");

        var index = viewModel.timerValue;
        var timerValue = 1; //viewModel.timerMinutes.getValue(index);

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

    viewModel.doTheThing = function (eventData) {
        // console.log("Thing is done!");
        // console.dir(eventData);
        topmost.navigate("video-page");
      };

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
