<?php
    function __autoload($class_name) {
        $filename = 'Class.' . ucfirst($class_name) . '.php';
        $file = site_path . 'classes' . DIRSEP . $filename;

        if (file_exists($file) == false) {return false;}

        include ($file);
    };
?>