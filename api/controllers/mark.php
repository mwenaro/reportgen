<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of marks
 *
 * @author Tsagwa Secondary
 */
class Mark extends Controller {

    private $term;
    private $type;

    //put your code here
    function __construct() {
        parent::__construct();
        Session::init();
//        if (true !== Session::get('loggedIn')) {
//            header('location:' . URL . 'login');
//        }
//        $this->type = array('e' => 'end of', 'o' => 'opener', 'm' => 'mid of');
//        $this->term = array('1' => ' term one ', '2' => 'term two', '3' => 'term three');
//        $this->view->title = __CLASS__ . 's';
//        $this->view->pageData = array('flag' => true);
    }

    function fetch() {
        $post = _Request::post();
        $request = $post ['request'];
        $hanle = $this->db->select($request);
        $errors = [];
        if (!$hanle->getFlag()) {
            $errors = $hanle->getError();
        }

        echo json_encode(['data' => $hanle->getData(), 'flag' => empty($errors), 'errors' => $errors]);
    }
    function getFilledMarks() {
        $post = _Request::post();
        $request = $post ['request'];
        $hanle = $this->db->select($request);
        $errors = [];
        if (!$hanle->getFlag()) {
            $errors = $hanle->getError();
        }

        echo json_encode(['data' => $hanle->getData(), 'flag' => empty($errors), 'errors' => $errors]);
    }

    function isLoggedIn() {
        $post = _Request::post();
        if (true === Session::get('isLoggedIn')) {
            print_r(json_encode(array(
                'post' => $post,
                'role' => Session::get('role'),
                'userId' => Session::get('userId'),
                'flag' => true)));
        } else {
            print_r(json_encode(array('post' => $post, 'flag' => false)));
        }
    }

    function update() {
        // $post = _Request::post();
        $post = _Request::init();
        $data = $post['data'];
        $table = $post['table'];
        $table_short = rtrim($table, 's');

        $data['dateUpdated'] = date("Y-m-d H:i:s");
        $data['updatorId'] = Session::get('isLoggedIn') ? Session::get('userId') : 1;
        $this->mult_model->update($table, $data, ["{$table_short}Id" => $data["{$table_short}Id"]]);
    }

    function getto() {
        echo json_encode(['flag' => [true]]);
    }

    function exits() {
        $post = _Request::post();
        $where = $post['data'];
        $table = $post['table'];
        $where = $post['where'];

        echo json_encode(['flag' => [true]]);
//        $data = $this->db->getRow($table, $where);
//        echo json_encode(['flag'=>!empty($data)?false:true]);
        echo json_encode(['flag' => []]);
    }

    function process_mks($data_keys, $data) {
        $keys = explode('$', $data_keys);
        $students = [];
//        $p=0;
        foreach ($data as $key => $value) {
            $std['score'] = $value;
            $std['dateCreated'] = date("Y-m-d H:i:s");
            $std['creatorId'] = Session::get('isLoggedIn') ? Session::get('userId') : 1;
            $scores = explode('$', $key);
            $n = 0;
            foreach ($scores as $mk) {
                $std[$keys[$n]] = $mk;
                $n++;
            }
            $students[] = $std;
        }
        return $students;
    }

    function add() {
        $post = _Request::post();
        $data_keys = $post['data']['mykeys'];
        $data = $post['data']['scores'];
        $table = "marks";
        $d = $this->process_mks($data_keys, $data);
        $return = [];
        $return[] = '';
        foreach ($data as $value) {

            $handle = $this->db->insert($table, $value, []);
            if (!$handle->getFlag()) {
                $return[] = $handle->getErrors();
            }
        }
        echo json_encode([
            'errors' => $return,
            'flag' => !$return ? false : true
        ]);
//        $this->mult_model->insert($table, $d);
    }

    function postMarks() {
        $post = _Request::post();
        $table = array_key_exists('table', $post) ? $post['table'] : 'marks';
        $data = array_key_exists('data', $post) ? $post['data'] : [];

        $return = [];
        foreach ($data as $value) {
            $value['dateCreated'] = date("Y-m-d H:i:s");
            $value['uk'] = uniqid();
            $value['creatorId'] = Session::get('isLoggedIn') ? Session::get('userId') : 1;
            $handle = $this->db->insert($table, $value, []);
            if (!$handle->getFlag()) {
                $return[] = $handle->getErrors();
            }
        }
        echo json_encode([
            'errors' => $return,
            'flag' => !empty($return) ? false : true
        ]);
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

    function getMaxADM() {
        //echo '<br>FRM GET max ADM'.var_dump($this->model->getMaxADM());
        return $this->model->getMaxADM();
    }

}
