<?php

class Api extends Controller {

    function __construct() {
        parent::__construct();
//        Session::init();
    }

    function getPple($_id = null) {
        $data = '{
  "data":  [
           
    {"id":1, "name":"mwero", "age":30},
    {"id":2, "name":"rashid", "age":4},
    {"id":3, "name":"saum", "age":3}, 
    {"id":4, "name":"hussein", "age":1},
    {"id":5, "name":"mlongo", "age":3},
    {"id":6, "name":"nyawa", "age":1}, 
    {"id":7, "name":"konza", "age":40}
    ]
}';
        echo $data;
//        $user = [
//            [
//                'id' => 1,
//                'name' => 'mwero',
//                'age' => 30
//            ],
//            [
//                'id' => 2,
//                'name' => 'rashid',
//                'age' => 30
//            ],
//            [
//                'id' => 3,
//                'name' => 'saum',
//                'age' => 30
//            ]
//        ];
//        $user2 = [
//            1 => [
//                'id' => 1,
//                'name' => 'mwero',
//                'age' => 30
//            ],
//            2 => [
//                'id' => 2,
//                'name' => 'rashid',
//                'age' => 30
//            ],
//            3 => [
//                'id' => 3,
//                'name' => 'saum',
//                'age' => 30
//            ]
//        ];
//$data=is_null($_id)?$user:$user[$_id];
//        echo json_encode($data);
//        echo json_encode(json_decode($data, true));
//        echo json_encode(['data'=>$data]);
    }
    function is_ok() {
        
    }
    
    function get($_tbl = null, $_id = null) {
        $post = _Request::post();
        $request = '';
        if (!empty($post)):
            $request = array_key_exists('request', $post) ? $post['request'] : '';
        endif;
        $handle = is_null($_id) && is_null($_tbl) ? $this->db->select($request) : $this->db->row($_tbl, ["" . rtrim($_tbl, 's') . "Id" => $_id]);
        _Request::response($handle);
    }

    function update() {
        $post = _Request::init();
        $data = $post['data'];
        $table = $post['table'];
        $table_short = rtrim($table, 's');
        $where = array_key_exists('where', $post) ? $post['where'] : ["{$table_short}Id" => $data["{$table_short}Id"]];
        $data['dateUpdated'] = date("Y-m-d H:i:s");
        $data['updatorId'] = Session::get('isLoggedIn') ? Session::get('userId') : 1;
        $this->mult_model->update($table, $data, $where);
    }

    function exists() {
        $post = _Request::post();
        $table = $post['table'];
        $watu = $this->db->exists($table, [$post['property'] => $post['value']]);
        echo json_encode(['isUnique' => !$watu]);
    }

    function del() {
        $post = _Request::post();
        $request = $post['request'];
        $return = [];
        $handle = $this->db->cmd($request);
        if (!$handle->getFlag()) {
            $return = $handle->getError();
        }
        echo json_encode(['flag' => empty($return), 'return' => $return]);
    }

    function save() {
        $post = _Request::post();
        $data = $post['data'];
        $table = $post['table'];
        $data['dateCreated'] = date("Y-m-d H:i:s");
        $data['creatorId'] = Session::get('isLoggedIn') ? Session::get('userId') : 1;
        $this->mult_model->insert($table, $data);
    }

    function delete() {
        $post = _Request::init();
        $data = [];
        $data = $post['data'];
        $id = $post['post']['id'];
        $table = $post['post']['table'];
        $table_short = rtrim($table, 's');
        $data['dateDeleted'] = date("Y-m-d H:i:s");
        $data['deletorId'] = Session::get('isLoggedIn') ? Session::get('userId') : 1;
        if (in_array(Session::get('isLoggedIn') ? Session::get('role') : '', ['admin', 'super_user', 'developer'])) {
            $this->mult_model->delete($table, ["{$table_short}Id" => $id]);
        } else {
            $this->mult_model->update($table, $data, ["{$table_short}Id" => $id], 'delete');
        }
    }

}
