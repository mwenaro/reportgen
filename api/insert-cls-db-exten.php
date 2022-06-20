<?php

class Multi_Insert extends SqliteDataCls {

    function __construct() {
        parent::__construct();

        function insert($data, $subId) {
            foreach ($data as $id) {
                $this->db->db->insert('sub_select', ['studentId' => $id, 'subjectId' => $subId,]);
            }
        }

    }

    function insertMult($table, $data) {
        if ($this->con->insertMany($table, $data)) {
            return true;
        }
    }

    function process_mks($mk) {
        $keys = ['term', 'form', 'examId', 'subjects', 'year', 'students'];
        foreach ($keys as $key) {
            $$key = array_key_exists($key, $mk) ? $mk[$key] : '';
        }
        $data = [];

        if ($students) {
            $n = 0;
            foreach ($students['studentId'] as $id) {
                $data[$n]['studentId'] = $id;
                $data[$n]['score'] = $students['score'][$n];
                // $data[$n]['adm'] = $students['adm'][$n];
                $data[$n]['term'] = $term;
//                $data[$n]['examId'] = "'".$examId."'";
//                $data[$n]['form'] = $form;
//                $data[$n]['year'] = "'".$year."'";
                $data[$n]['dateCreated'] = date("Y-m-d H:i:s");
                $n++;
            }
        }

        return $data;
    }

    function insertMult1($table, $data) {
        $s = '';
        $fieldNames = implode('`, `', array_keys($data[1]));
        $fieldValues = ':' . implode(', :', array_keys($data[1]));
        $sql = "INSERT INTO $table (`$fieldNames`) VALUES ($fieldValues)";

//        foreach ($data as $value) {
//            $s .= "('" . implode("','", $value) . "'), ";
//        }
//        $sql = "INSERT INTO {$table} (`" . implode('`,`', array_keys($data[1])) . "`) VALUES " . rtrim($s, ',') . "";
        if ($this->db->create($sql)->getFlag()) {
            return true;
        } else {
            return false;
        }
    }

//
//    public function insertMany($table, $data, $where1 = array(), $option = '') {
//        $where = $this->where($where1);
//        try {
//           // ksort($data);
//
//            $fieldNames = implode('`, `', array_keys($data[1]));
//            $fieldValues = ':' . implode(', :', array_keys($data[1]));
//            $sql = "INSERT INTO $table (`$fieldNames`) VALUES ($fieldValues) $where";
//            $sth = $this->prepare($sql);
//             echo '<br>' . "INSERT INTO $table (`$fieldNames`) VALUES ($fieldValues) $where";
//            $this->show($sql);
//            foreach ($data as $d) {
//                foreach ($d as $key => $value) {
//                    $sth->bindValue(":$key", $value);
//                }
//
//                $flag = $sth->execute();
//            }
//        } catch (Exception $exc) {
//            // echo $exc->getTraceAsString();
//            // print_r( 'Error '.$sth->errorInfo());
//        }
//
//
//        return $flag;
//    }
}
