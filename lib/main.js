/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

/*

* pref to track "last upload"
* storage location
* actual study
* collection (over channel)
* decide what else to collect?

* ui to opt-in out user during first collection
* ui to show data?


12:39 <@canuckistani> gregglind: there are doorhangers in NativeWindow
12:39 <@canuckistani> gregglind: and toasts
12:40 -!- Mossop [mossop@moz-C03D0C61.vlan426.asr1.sfo1.gblx.net] has quit [Ping timeout]
12:40 <@canuckistani> both are mostly un-like a panel
12:40 <@canuckistani> https://developer.mozilla.org/en-US/docs/DOM/window.NativeWindow

12:49 < gregglind> (we are testing a really cut down testpilot heatmap of common pages and chrome elements)
12:50 <@canuckistani> gregglind: that will not work
12:50 < KWierso> gregglind: you might need to find the actual URL that about:home maps to
12:52 <@canuckistani> KWierso: IIRC we don't page-mod non-web-content, period.
12:52 <@canuckistani> that was a bug we fixed
12:53 -!- John-Galt [kris@moz-104CC309.mv.mozilla.com] has joined #jetpack
12:56 < clarkbw> gregglind: i've got an initial version up and running now: https://github.com/clarkbw/indexed-db-storage
12:57 < KWierso> I'm in ur release process docs, making sure I don't forget what I just had to do
12:57 < clarkbw> need to do lots of cleanups and more tests but i'm pretty close to done
12:57 < clarkbw> gregglind: also wrote up some docs: https://github.com/clarkbw/indexed-db-storage/blob/master/doc/indexed-db-storage.md
12:57 < gregglind> clarkbw, KWierso, canuck, thanks!

*/

let tabs = require('tabs');
let timers = require("timers");
let {tpobserve,tpnotify} = require('tpchannel');

let heatmap = require('heatmap-android');

let alldata = [];

let O = tpobserve(function(data){
    console.log(JSON.stringify(data));
    alldata.push(data);
});


let main = function(options,reason){
  if (options.staticArgs.debug) {
    ["http://mozilla.com","about:config", "about:addons",
        "chrome://global/content/console.xul"].forEach(
        function(x){tabs.open(x)});
  }
}





