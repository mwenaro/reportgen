<?php

class RestApiModel {

    private $q_builder = null;
    private $init_vars = [
    ];

    function __construct($db) {
        $this->db = $db;
        $this->q_builder = new Query_Creator($this->db);
        Session::init();
    }

    function insert($table, $data) {
        $fields = array_keys($this->selectAll($table, [], null, null, 1)->getData()[0]);
        $def = [
            'dateCreated' => date("Y-m-d Hh:i:s"),
            'creatorId' => Session::get('isLoggedIn') ? Session::get('userId') : 1,
            'session' => Session::get('isLoggedIn') ? Session::get('userId') : 1,
        ];
//        print_r(json_encode(['table' => $table, 'fields' => $fields]));        exit();
//        return $this->db->insert($table, $data);
        print_r(json_encode([
            'ar_keys' => $fields,
            'ar2' => array_keys($def),
            'ar4' => $def,
//            'ar3'=>array_intersect_key([1,2,3,4,5],[3,5,6,7,8]);
            'ar3' => array_intersect($fields, array_keys($def))
//            'ar3'=>array_intersect_uassoc(["one","two","three","four","five"], ["three","four","five","six",'7','8'], "strcmp")
        ]));

        exit();

        return ['table' => $table, 'fields' => $fields];
    }

    function selectAll($table, $where = [], $by = null, $order = null, $limit = null) {
//        $rwa=$limit;
        $where = $this->db->where($where);
        $by = !is_null($by) ? " ORDER BY {$by}" : null;
        $order = !is_null($order) ? strtoupper(" $order") : null;
        $limit = !is_null($limit) ? " LIMIT {$limit}" : null;
        $sql = "SELECT * FROM {$table} {$where}  {$by} {$order} {$limit}";
        return $this->db->select($sql);
    }

    function selectOne($table, $where = []) {
        $tbl = rtrim($table, 's');
        return $this->db->row(
            $table,
             [
                strtolower($table) === 'classes' ?
                 'classId'
                 : 
                 "{$tbl}Id" => $where['id']
                ]
            );
    }

    function update($table, $data, $where) {
      return $this->db->update($table, $data, $where);
    }

    function delete($table, $where) {
        return $this->db->delete(table, $where);
    }

    function data_from_many($table, $coloumns = [], $joining_fields, $where = [], $by = null, $order = null, $limit = null) {


        $this->q_builder->join_init()
                ->selected_coloumns($coloumns)
//        if ($where):
                ->from($table);
//        endif;
        if ($joining_fields):
            $this->q_builder->join($joining_fields);
        endif;

        if ($where):
            $this->q_builder->where($where);
        endif;
        if ($by):
            $this->q_builder->orderBy($by);
        endif;
        $this->q_builder->exec();
//            echo json_encode(['data' => $this->data]);
//            exit();
    }

}
