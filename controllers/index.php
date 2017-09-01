<?php
Class Controller_Index Extends Controller_Base {
    function index() {
        readfile('templates/index.html');
    }
}
?>

