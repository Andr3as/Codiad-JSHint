<!--
    Copyright (c) Codiad & Andr3as, distributed
    as-is and without warranty under the MIT License. 
    See http://opensource.org/licenses/MIT for more information.
    This information must remain intact.
-->
<form class="settings-jshint">
    <label><span class="icon-gauge big-icon"></span> JSHint options</label>
    <table class="jshint-options">
        <tr><th colspan="2"><label>Enforcing options</label></th></tr>
        <?php
            $enforcing = array("bitwise","camelcase","curly","eqeqeq","es3","forin","freeze","immed","latedef","newcap","noarg","noempty","nonbsp","nonew","plusplus","undef","unused","strict");
            for ($i = 0; $i < count($enforcing); $i++) {
                ?>
                <tr>
                    <td>
                        <label><?php echo $enforcing[$i]; ?></label>
                    </td>
                    <td>
                        <select class="jshint-setting" data-setting="<?php echo "codiad.plugin.jshint.option.".$enforcing[$i]; ?>">
                            <option value="default">default</option>
                            <option value="true">true</option>
                            <option value="false">false</option>
                        </select>
                    </td>
                </tr>
                <?php
            }
        ?>
        <tr>
            <td><label>quotmark</label></td>
            <td>
                <select class="jshint-setting" data-setting="codiad.plugin.jshint.option.quotmark">
                    <option value="default">default</option>
                    <option value="true">true</option>
                    <option value="false">false</option>
                    <option value="single">single</option>
                    <option value="double">double</option>
                </select>
            </td>
        </tr>
        <?php
            $inputs = array("maxerr","maxparams","maxdepth","maxstatements","maxcomplexity","maxlen");
            for ($i = 0; $i < count($inputs); $i++) {
                ?>
                <tr>
                    <td><label><?php echo $inputs[$i]; ?></label></td>
                    <td>
                        <input type="number" class="jshint-setting jshint-setting-number" data-setting="<?php echo "codiad.plugin.jshint.option.".$inputs[$i] ?>">
                    </td>
                </tr>
                <?php
            }
        ?>
    </table>
    <table class="jshint-options">
        <tr><th colspan="2"><label>Relaxing options</label></th></tr>
        <?php
            $relaxing = array("asi","boss","debug","eqnull","esnext","evil","expr","funcscope","globalstrict","iterator","lastsemic",
                                "laxbreak","laxcomma","loopfunc","moz","multistr","notypeof","proto","scripturl","shadow","sub","supernew","validthis","noyield");
            for ($i = 0; $i < count($relaxing); $i++) {
                ?>
                <tr>
                    <td><label><?php echo $relaxing[$i]; ?></label></td>
                    <td>
                        <select class="jshint-setting" data-setting="<?php echo "codiad.plugin.jshint.option.".$relaxing[$i]; ?>">
                            <option value="default">default</option>
                            <option value="true">true</option>
                            <option value="false">false</option>
                        </select>
                    </td>
                </tr>
                <?php
            }
        ?>
    </table>
    <table class="jshint-options">
        <tr>
            <th colspan="4"><label>Assume</label></th>
        </tr>
        <?php
            $assume = array("browser","couch","devel","dojo","jquery","mootools","node","nonstandard","phantom","prototypejs","rhino","worker","wsh","yui");
            for ($i = 0; $i < count($assume); $i++) {
                ?>
                <tr>
                    <td><label><?php echo $assume[$i]; ?></label></td>
                    <td>
                        <select class="jshint-setting" data-setting="<?php echo "codiad.plugin.jshint.option.".$assume[$i]; ?>">
                            <option value="default">default</option>
                            <option value="true">true</option>
                            <option value="false">false</option>
                        </select>
                    </td>
                    <td><label><?php echo $assume[++$i]; ?></label></td>
                    <td>
                        <select class="jshint-setting" data-setting="<?php echo "codiad.plugin.jshint.option.".$assume[$i]; ?>">
                            <option value="default">default</option>
                            <option value="true">true</option>
                            <option value="false">false</option>
                        </select>
                    </td>
                </tr>
                <?php
            }
        ?>
        <td colspan="2"><label style="width: 200px;">Global variables</label></td>
        <td colspan="2"><input class="jshint-globals" type="text" style="width: 220px;"></td>
    </table>
    <p>Check <a href="http://jshint.com/docs/options">JSHint</a> for more details.</p>
	<p>Global settings are overwritten by local .jshintrc files.</p>
</form>