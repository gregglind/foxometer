/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/* things to watch */

// http://mxr.mozilla.org/mozilla-central/source/mobile/android/chrome/content/browser.xul

"use strict";

console.log("WE MADE IT INTO THE HEATMAP");

const activeWindow = require("windows").activeWindow;
const data = require('self').data;
const observer = require("observer-service");
const self = require('self');
const windows = require("windows").browserWindows;
const windowUtils = require("window-utils");

let {tpobserve,tpnotify} = require("tpchannel");

let ee = [
  "MozSwipeGesture","MozMagnifyGestureStart","MozMagnifyGestureUpdate","MozMagnifyGesture","MozRotateGestureStart",
  "MozRotateGestureUpdate","MozRotateGesture",'click'
];

var trackpad_swipes = ["MozSwipeGesture","MozMagnifyGesture","MozRotateGesture"];

var allpagetracker = new windowUtils.WindowTracker({
  onTrack: function(window) {
    console.log("tracking",window.location);
    window.addEventListener('command',function(evt){
      console.log('command',evt.target.id);  // https://developer.mozilla.org/en/XUL/List_of_commands
      tpnotify({"group":"command",target:evt.target.id})
      /*for (let i in evt){
         console.log('  ',i);
      }*/
    });

    // swipes
    trackpad_swipes.forEach(
      function(etype,ii){
        let myetype = etype;
        window.addEventListener(etype,function(evt){
          let direction = "";
          let delta = "";
          if (etype == "MozSwipeGesture") {
          //SimpleGestureEvent constants defined here: https://developer.mozilla.org/En/NsIDOMSimpleGestureEvent
            switch(evt.direction) {
                case 4:
                  direction = "left";
                  break;
                case 8:
                  direction = "right";
                  break;
                case 1:
                  direction = "up";
                  break;
                case 2:
                  direction = "down";
                  break;
                default:
                  direction = "undefined";
              }
            }
            else if (etype == "MozMagnifyGesture"){
              if (evt.delta > 0) {
                direction = "out";
              } else {
                direction = "in";
              }
            }
            else {
              if (evt.direction == 1) {
                direction = "counterclockwise";
              } else {
                direction = "clockwise";
              }
            }
            console.log('window:',myetype,direction);
            tpnotify({group:"guesture",etype:myetype, direction: direction,rawdirection:evt.direction});
          },true);
       }
      )
  }
});


// inspired by: https://github.com/erikvold/menuitems-jplib/blob/master/lib/menuitems.js
var contextMenuTracker = new windowUtils.WindowTracker({
    onTrack: function(window) {
        console.log("tracking",window.location);
        if ("chrome://browser/content/browser.xul" != window.location) return;
        let contextMenu = window.document.getElementById("contentAreaContextMenu");
        if (! contextMenu) {
          console.log("no context menu on mobile!");
          return false;
        }
        contextMenu.addEventListener("command", function(evt) {
            if (evt.target && evt.target.id) {
                tpnotify(["contentAreaContextMenu", evt.target.id, "click"]);
            }
        }, true);
    }
});

/*  Various page mods for pages


*/


var pageMod = require("page-mod");
var aboutHomeSearch = pageMod.PageMod({
  include: ["about:home"],
  contentScriptWhen: 'ready',
  contentScriptFile: [data.url('jquery.min.js')],
  contentScript: '$("#searchForm").submit(function() {self.port.emit("abouthomesearch"); return true;});',
  onAttach: function(worker) {
    worker.port.on("abouthomesearch", function(msg) {tpnotify({group:'about:home search'})});
  }
});



