<?php
try {
    // $db = new PDO($DB_DSN, $DB_USER, $DB_PASS, $DB_OPT);
    session_start();
    $db = new PDO($DB_DSN, $DB_USER, $DB_PASSWORD);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
?>