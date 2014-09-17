<?php
/*
 * Copyright (c) Codiad & Andr3as, distributed
 * as-is and without warranty under the MIT License. 
 * See http://opensource.org/licenses/MIT for more information.
 * This information must remain intact.
 */
    error_reporting(0);

    require_once('../../common.php');
    checkSession();
    
    switch($_GET['action']) {
        
        case 'getConfig':
            if (isset($_GET['project']) && isset($_GET['path'])) {
                $project    = getWorkspacePath($_GET['project']);
                $path       = getWorkspacePath($_GET['path']);
                while ($project !== $path) {
                    $path   = dirname($path);
                    if (file_exists($path . '/.jshintrc')) {
                        $content = json_decode(file_get_contents($path . '/.jshintrc'), true);
                        $content = array("status" => "success", "data" => $content);
                        echo json_encode($content);
                        break 2;
                    }
                }
                $content = array("status" => "success", "data" => array());
                echo json_encode($content);
            } else {
                echo '{"status":"error","message":"Missing parameter"}';
            }
            break;
        
        default:
            echo '{"status":"error","message":"No Type"}';
            break;
    }
    
    
    function getWorkspacePath($path) {
		//Security check
		if (!Common::checkPath($path)) {
			die('{"status":"error","message":"Invalid path"}');
		}
        if (strpos($path, "/") === 0) {
            //Unix absolute path
            return $path;
        }
        if (strpos($path, ":/") !== false) {
            //Windows absolute path
            return $path;
        }
        if (strpos($path, ":\\") !== false) {
            //Windows absolute path
            return $path;
        }
        return "../../workspace/".$path;
    }
?>