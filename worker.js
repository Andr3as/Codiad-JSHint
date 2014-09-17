/*jshint worker:true*/
/*
 * Copyright (c) Andr3as
 * as-is and without warranty under the MIT License.
 * See http://opensource.org/licenses/MIT for more information.
 * This information must remain intact.
 */
importScripts('jshint.js');

self.addEventListener('message', function(e) {
    var code    = e.data.code;
    var options = e.data.options;
    var globals = e.data.globals;
    //Run jshint
    var result  = JSHINT(code, options, "");
    var data    = JSON.stringify(JSHINT.data());
    var errors  = JSHINT.errors;
    //Post result
    postMessage({result: result, data: data, errors: errors});
}, false);