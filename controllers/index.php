<?php
Class Controller_Index Extends Controller_Base {
    function index() {
        readfile('templates/index.html');
        $_SESSION['admin'] = false;
    }

    function newTask () {
        if (exif_imagetype($_POST['photoSrc']) == true &&
            !empty($_POST['email']) &&
            !empty($_POST['name']) &&
            !empty($_POST['photoName'])
        ) {
            $values = array(
                'task' => $_POST['text'],
                'img' => $_POST['photoName'],
                'name' => $_POST['name'],
                'email' => $_POST['email']
            );
            $fields = array("task", "img", "name", "email");

            $data = $_POST['photoSrc'];
            list($type, $data) = explode(';', $data);
            list(, $data)      = explode(',', $data);
            $data = base64_decode($data);
            if (file_put_contents('public/images/'.$_POST['photoName'], $data) != FALSE) {
                $sql = ("INSERT INTO `tasks` SET".$this->pdoSet($fields, $result, $values));
                $stm = $this->registry->get('db')->prepare($sql);
                $stm->execute($result);
            }
            else
                echo (json_encode(["status" => 200, "task" => "not added"]));
            echo (json_encode(["status" => 200, "task" => $values]));
        } else (json_encode(["status" => 200, "task" => "not added"]));
    }

    function logIn () {
        if ($_POST['login'] === "admin" && $_POST['pass'] === "123") {
            $_SESSION['admin'] = true;
            echo (json_encode(["status" => 200, "logged" => true]));
        } else echo (json_encode(["status" => 200, "logged" => false]));
    }

    function getList () {
        $stmt = $this->registry->get('db')->prepare('SELECT `id`, `task`, `img`, `name`, `email`, `checked` FROM `tasks`');
        $stmt->execute();

        $res = array();
        $i = 0;
        while (1) {
            $row = $stmt->fetch(PDO::FETCH_LAZY);
            if ($row == false)
                break ;
            foreach ($row as $key => $value) {
                $res[$i][$key] = $value;
            }
            $i++;
        }

        echo (json_encode(["status" => 200, "tasks" => $res, 'admin' => $_SESSION['admin']]));
    }

    function updateTask () {
        $allowed = array("checked");
        $_POST['checked'] = 1;
        $sql = "UPDATE tasks SET ".$this->pdoSet($allowed,$values)." WHERE id = :id";
        $stm = $this->registry->get('db')->prepare($sql);
        $values["id"] = $_POST['task'];
        $stm->execute($values);
        echo (json_encode(["status" => 200, "task" => 'updated']));
    }

    function pdoSet($allowed, &$values, $source = array()) {
        $set = '';
        $values = array();
        if (!$source) $source = &$_POST;
        foreach ($allowed as $field) {
            if (isset($source[$field])) {
                $set.="`".str_replace("`","``",$field)."`". "=:$field, ";
                $values[$field] = $source[$field];
            }
        }
        return substr($set, 0, -2);
    }

}
?>

