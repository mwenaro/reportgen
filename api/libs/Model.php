<?php

class Model {

    function __construct() {
        //parent::__construct('sqlite', DB_PATH);
        $this->db = new Database('sqlite', DB_PATH);
        // print_r($this->db->select('SELECT * FROM users'));
    }

    function emptyArray($array) {
        $error = [];
        foreach ($array as $value) {
            if ($value === '' || $value === null) {
                $error[] = 'Empty Fields';
            }
        }
        return empty($array) ? false : !empty($error) ? false : true;
    }

    function getData($request, $show = false, $json = false, $keys = null) {
        exit();
        //  $db = new mysqli( 'localhost','root','','project');
        $requests = explode('$', $request);
        if (!empty($keys)) {
            $requests = array_combine($keys, $requests);
        }

        $bData = [];
        $n = $loop = 1;
        foreach ($requests as $key => $req) {
            $b2data = [];
            $n = $loop;
            // $q = mysqli_query($this->db, $req);
            while ($row = mysqli_fetch_assoc($q)) {

                $b2data[] = $row;
            }

            $bData['q' . $n++] = $b2data;
            if (!empty($keys)) {
                $bData[$key] = $b2data;
            }

            $loop++;
        }
        mysqli_close($this->db);
        if ($show) {
            echo json_encode($bData);
        }
        return $json ? json_encode($bData) : $bData;
    }

}
