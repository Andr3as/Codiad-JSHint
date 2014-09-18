/*jshint browser:true*/
/*
 * Copyright (c) Codiad & Andr3as, distributed
 * as-is and without warranty under the MIT License.
 * See http://opensource.org/licenses/MIT for more information. 
 * This information must remain intact.
 */

(function(global, $){

    var codiad = global.codiad,
        scripts = document.getElementsByTagName('script'),
        path = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/';

    $(function() {
        codiad.JSHINT.init();
    });

    codiad.JSHINT = {

        path:     curpath,
        result:   false,
        config:   [],
        globals:  [],
        worker:   null,

        init: function() {
            var _this = this;
            //Load lib
            this.worker = new Worker(this.path+'worker.js');
            this.worker.addEventListener('message', this.getWorkerResult.bind(this));
            //Add panel
            $('#editor-bottom-bar').before('<div class="jshint-panel"><div class="jshint-data"></div>'+
                                                '<span class="jshint-panel-close icon-cancel"></span></div>');
            $('.jshint-panel').hide();
            //Add indicator
            $('#current-file').after('<div class="divider jshint"></div><div class="jshint jshint-indicator"></div>');
            $('.jshint-indicator').click(function(){
                _this.togglePanel();
            });
            $('.jshint-panel-close').click(function(){
                _this.togglePanel();
            });
            //Click on lines
            $('.jshint-table .line-number').live('click', function(){
                _this.navigateToLine(this);
            });
            $('.jshint-table .message').live('click', function(){
                _this.navigateToLine(this);
            });
            //Register listeners
            amplify.subscribe('active.onFocus', function(path){
                path = path || codiad.active.getPath();
                if (/(\.js)$/.test(path)) {
                    $('.jshint').show();
                    setTimeout(function(){
                        _this.lint();
                    }, 10);
                    //Load config
                    var project = _this.getProject();
                    $.getJSON(_this.path + "controller.php?action=getConfig&project="+project+"&path="+path, function(json){
                        if (json.status == "success") {
                            _this.config = json.data;
                            _this.lint();
                        }
                    });
                } else {
                    $('.jshint').hide();
                    $('.jshint-panel').hide();
                }
            });
            amplify.subscribe('active.onSave', function(path){
                path = path || codiad.active.getPath();
                if (/(\.js)$/.test(path)) {
                    setTimeout(function(){
                        _this.lint();
                    }, 10);
                }
            });
            amplify.subscribe('active.onClose', function(path){
                $('.jshint').hide();
                $('.jshint-panel').hide();
            });
            amplify.subscribe('settings.dialog.tab_loaded', function(file){
                if (/jshint/i.test(file)) {
                    _this._loadGlobalSettings();
                }
            });
            amplify.subscribe('settings.dialog.save', function(){
                _this._saveGlobalSettings();
            });
        },

        lint: function() {
            var options = this.getOptions();
            var globals = this.getGlobals();
            var code    = codiad.editor.getContent();
            this.worker.postMessage({code: code, options: options, globals: globals});
        },

        getWorkerResult: function(e) {
            this.result = e.data.result;
            var data    = JSON.parse(e.data.data);
            var errors  = e.data.errors;
            if (errors.length === 0 && this.result) {
                $('.jshint-indicator').html('<span class="icon-check"></span>');
            } else {
                $('.jshint-indicator').html('<span class="icon-attention"></span>');
            }
            //Parse errors and warnings
            var table   = '<table class="jshint-table">';
            if (errors.length !== 0) {
                table  += '<th class="title" colspan="2">Errors</th>';
            }
            for (var i = 0; i < errors.length; i++) {
                table += this.createLine(errors[i].line, errors[i].character, errors[i].reason);
            }
            data.unused = data.unused || [];
            if (data.unused.length !== 0) {
                table += '<th class="title" colspan="2">Unused</th>';
            }
            for (var j = 0; j < data.unused.length; j++) {
                table += this.createLine(data.unused[j].line, data.unused[j].character, data.unused[j].name);
            }
            table += '</table>';
            //Insert data
            $('.jshint-data').html(table);
        },

        getOptions: function() {
            var global_config = localStorage.getItem('codiad.plugin.jshint.config');
            if (global_config === null) {
                global_config = {};
            } else {
                global_config = JSON.parse(global_config);
            }

            $.each(this.config, function(i, item){
                global_config[i] = item;
            });
            return global_config;
        },

        getGlobals: function() {
            /*Format {"amplify": true, "JSHINT": true}*/
            var globals = localStorage.getItem('codiad.plugin.jshint.globals');
            if (globals === null) {
                globals = {};
            } else {
                globals = JSON.parse(globals);
            }
            return globals;
        },

        togglePanel: function() {
            $('.jshint-panel').toggle();
        },

        createLine: function(line, col, msg) {
            return '<tr><td class="line-number" data-line="'+line+'" data-col="'+col+'">'+
                    line+'</td><td class="message" data-line="'+line+'" data-col="'+col+'">'+msg+'</td></tr>';
        },

        navigateToLine: function(element) {
            var line = parseInt($(element).attr('data-line'), 10) - 1;
            var col = parseInt($(element).attr('data-col'), 10) - 1;
            codiad.editor.getActive().moveCursorToPosition({"row":line, "column":col});
            codiad.editor.getActive().clearSelection();
            codiad.editor.getActive().focus();
        },

        getProject: function() {
            return $('#project-root').attr('data-path');
        },

        _loadGlobalSettings: function() {
            //Settings
            var settings = localStorage.getItem('codiad.plugin.jshint.config');
            if (settings !== null) {
                settings = JSON.parse(settings);
                $.each(settings, function(i, item){
                    $('.jshint-setting[data-setting="codiad.plugin.jshint.option.'+i+'"]').val(item);
                });
            }
            //Globals
            var globals = localStorage.getItem('codiad.plugin.jshint.globals');
            if (globals !== null) {
                $('.jshint-globals').val(globals);
            }
        },

        _saveGlobalSettings: function() {
            if ($('.settings-jshint:visible').length !== 0) {
                //Configs
                var val, key, options = {}, globals;
                $('.jshint-setting').each(function(i, item){
                    val = $(item).val();
                    if (val !== "default" && val !== "" && val !== undefined) {
                        if ($(item).hasClass('number')) {
                            if (isNaN(val)) return;
                        }
                        key = $(item).attr('data-setting');
                        key = key.replace('codiad.plugin.jshint.option.', "");
                        options[key] = val;
                    }
                });
                options = JSON.stringify(options);
                localStorage.setItem('codiad.plugin.jshint.config', options);
                //Globals
                globals = $('.jshint-globals').val();
                if (globals === "") {
                    return;
                }
                try {
                    JSON.parse(globals);
                    localStorage.setItem('codiad.plugin.jshint.globals', globals);
                } catch (e) {
                    codiad.message.error("JSHint Globals: Wrong Syntax!");
                }
            }
        }
    };
})(this, jQuery);
