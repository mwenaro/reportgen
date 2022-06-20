<?php

//header('Access-Control-Allow-Origin:*');
//header('Content-Type:application/json');

require_once 'output/data_configs.php';
require_once 'database.exten.php';

$db = new SqliteDataCls();

$post = json_decode(file_get_contents("php://input"), true);
if (!empty($post)) {
    $keys = array_keys($post);
    //initialization
    //Getting request string
    $req = in_array('request', $keys) ? $post['request'] : '';
    //getting orderBy string
    $orderBy = in_array('orderBy', $keys) ? " ORDER BY " . $post['orderBy'] : '';
    //getting table string
    $table = in_array('table', $keys) ? $post['table'] : '';
    //user_where
    $user_where = in_array('where', $keys) ? $post['where'] : '';
    //getting table string
    $table_short = rtrim(in_array('table', $keys) ? $post['table'] : '', 's');

    //getting data to be inserted
    $data = in_array('data', $keys) ? $post['data'] : array();
    //getting row id if exits
    $id = array_key_exists("{$table_short}Id", $data) && !empty($data) ? $data[$table_short . 'Id'] : (in_array('id', $keys) ? $post['id'] : '');


    //getting the condition , where

    $where1 = array_key_exists("where", $data) && !empty($data) ? $data['where'] : (in_array('where', $keys) ? $post['where'] : []);
    $where = !empty($where1) ? $where1 : ('' !== $id ? array("{$table_short}Id" => $id) : array());
    // var_dump($where);
    //Detrmining the request source
    $req_cliet = in_array('from_cliet', $keys) ? $post['from_cliet'] : false;

    //Forming sql
    $sql1 = '' === $table ? '' : $configs[$table]['all'] . ' ' . $orderBy;
    $sql = '' === $table ? '' : $configs[$table]['all'];

    switch ($req) {
        case 'all':
            $sql = $sql1;
            //echo ''.$sql;
            $flag = $db->con->select($sql)->getFlag();
            if ($flag):
                $data = $db->getData($sql, false, false);
                print_r(json_encode(array('data' => $data ? $data : [], 'flag' => $flag)));
            else:
                print_r(json_encode(array('sql' => $sql, 'flag' => $flag, 'msg' => $db->db->getError())));
            endif;
            break;
        case 'get_row' && !empty($where):
            $sql = rtrim($sql1 . ' AND ' . $db->db->valuePair($where, '=', ' AND '), ' AND ');
            //echo '<br>'.$sql;
            $flag = $db->con->select($sql . ' LIMIT 1')->getFlag();
            if ($flag):
                $d = $db->con->select($sql)->getData();
                $data = !empty($d) ? $d[0] : [];
                // print_r($d);
                print_r(json_encode(array('data' => $data, 'flag' => $flag)));
            else:
                print_r(json_encode(array('sql' => $sql, 'flag' => $flag, 'msg' => 'an error occured')));
            endif;
            break;
        case 'delete':

            $flag = $db->update($table, $data, $where);
            if ($flag):
                $sql = $sql1;
                $data = $db->getData($sql, false, false);
                print_r(json_encode(array('data' => $data, 'flag' => $flag, 'msg' => ucfirst($table_short) . '  Successfully Deleted! ')));
            else:
                // echo 'error';
                print_r(json_encode(array('flag' => $flag, 'msg' => $db->db->getError())));
            endif;
            break;
        case 'update':
            $flag = $db->update($table, $data, $where);

            //var_dump($data);
            if ($flag):
//                $dat = $db->getData($sql, false, false);
                $dat = $db->getData($configs[$table]['all'], false, false);
//                print_r(json_encode(array('sql'=>sql1,'data' => $data, 'flag' => $flag)));
//                print_r(json_encode(array('sql' => sql1, 'data' => $dat, 'flag' => 'ndio')));
                print_r(json_encode(array('sql' => sql, 'data' => $dat, 'flag' => 'ndio')));

            else:

                print_r(json_encode(array('data' => [], 'sql' => sql1, 'flag' => $flag, 'msg' => $db->db->getError())));
            endif;

            break;
        case 'insert':
            $flag = $db->insert($table, $data);
            if ($flag):
                $data = $db->getData($sql1, false, false);
                print_r(json_encode(array('data' => $data, 'flag' => $flag)));

            else:
            // echo 'error';
            // print_r(json_encode(array('flag' => $flag, 'msg' => $db->db->getError())));
            endif;
            break;
        case 'get':
//         print_r(json_encode(array('data' => [4545,4545], 'flag' => true)));         exit();
            $watu = $db->exists($table, $user_where);
            if ($watu):
                // $data = $db->getData($sql1, false, false);
                print_r(json_encode(array('data' => $watu, 'existst' => $watu, 'flag' => true, 'cpont' => ($watu))));

            else:
                print_r(json_encode(array('data' => $watu, 'flag' => false)));

            endif;
            break;

        case 'exists':
//         print_r(json_encode(array('data' => [4545,4545], 'flag' => true)));         exit();
            $watu = $db->exists($table, [$post['property'] => $post['value']]);
            echo json_encode(['isUnique' => $watu]);
            break;

        case 'get1':
//         print_r(json_encode(array('data' => [4545,4545], 'flag' => true)));         exit();
            $watu = $db->getRow($table, $user_where);
            if (count($watu) > 0):
                // $data = $db->getData($sql1, false, false);
                print_r(json_encode(array('data' => $watu, 'flag' => true, 'existst' => true, 'cpont' => count($watu))));

            else:
                print_r(json_encode(array('data' => $watu, 'flag' => false)));

            endif;
            break;
        default :
            $handle = $db->con->select($req);
            $errors = [];
            if ($handle->getFlag()):
                $errors[] = $handle->getError();
            endif;
            print_r(json_encode(['errors' => $errors, 'flag' => empty($errors), 'data' => $handle->getData()]));
    }
}

//$db->getData('SELECT * FROM users', true, true);
//print_r($db->db->select('SELECT * FROM users')->getData());

