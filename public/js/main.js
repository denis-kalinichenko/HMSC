/**
 * Created by Denis Kalinichenko on 2015-02-09.
 */


/* youtube player */

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: 'L6iWoGS0iGo',
        playerVars: { 'autoplay': 1, 'controls': 0, 'disablekb': 1, 'fs': 0, 'loop': 1, 'modestbranding': 1, 'rel': 0, 'showinfo': 0, 'iv_load_policy': 3 },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo().mute().setPlaybackRate(0.5);
    //console.clear();
    //console.log(event.target.getAvailablePlaybackRates());
}

/* ready */
document.addEventListener('DOMContentLoaded', function(){
    /* pages */
    var mySwiper = new Swiper('.swiper-container',{
        mode: 'horizontal',
        loop: false,
        height: "auto"
    });

    /* init time */
    updateTime();

    /* init track */
    $("audio").volume="0.1";

    /* data via websockets */
    var socket = io.connect(window.location.href);
    socket.emit('getData');
    socket.on('data', function (data) {
        console.log(data);
        if(data.cost == 0) {
            $("error").style.display = "block";
        } else {
            $("info").innerHTML = data.cost;
            $("url").innerHTML = '("'+data.name+'")';
            $("url").setAttribute("href", data.url);
            $("cost_month").innerHTML = data.cost_month;
            $("error").style.display = "none";
        }
        updateTime();
    });


}, false);


function $(id) {
    return document.getElementById(id); /* jQuery shit */
}

/* simple stupid time functions from w3schools examples, lol */
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function updateTime() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    var time = h + ":" + m + ":" + s;
    $("time").innerHTML = time;
}

