<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of query_creator
 *
 * @author amd
 */
class Query_Creator {

    private $db;
    private $tables = [];
    private $sql = null;
    private $def_main_table = null;

    //put your code here
    function __construct(Database $db) {
        $this->db = $db;
    }

    function _is_valid_join_tb($table) {
        return $table !== $this->def_main_table && strpos($this->sql, "JOIN {$table} ON ") === null;
    }

    function get_data_from_many($table, $coloumns, $options = []) {
        $join = $where = $by = $group = $order = $limit = null;
//        $joining_fields = $where = $by = $order = $limit = null;
        extract($options, EXTR_OVERWRITE);

        $this->join_init()
                ->selected_coloumns($coloumns);
//        if ($where):
//        if ($table):
        $this->from($table);
//        endif;
//        endif;
        if ($join):
            $this->join($join);
        endif;

        if ($where):
            $this->where($where);
        endif;

        if ($group):
            $this->groupBy($group);
        endif;

        if ($by):
            $this->orderBy($by, $order);
        endif;

        if ($limit):
            $this->limit($limit);
        endif;

        return $this->exec();
    }

    function join_init($op = null) {
        $this->sql .= " SELECT {$op} ";
        return $this;
    }

    function main_tbl_extractor($coloumns = []) {
        $str_tbl = array_keys($coloumns);
        $this->tables = $str_tbl ? $str_tbl : [];
        $this->def_main_table = !empty($str_tbl) ? array_shift($str_tbl) : null;
    }

    /**
     * 
     * @param type $fields
     * @return $this
     */
    function selected_coloumns($fields = []) {
        $sql = '';
//        $array_has_kyes = !empty(array_keys($fields)) ? true : false;
//        if ($array_has_kyes) {
//            $this->main_tbl_extractor($fields);
//            foreach ($fields as $table => $flds) {
//                if (is_string($flds)):
//                    $flds = explode(',', $flds);
//                endif;
//                foreach ($flds as $val) :
//                    $sql .= " {$table}.{$val},";
//                endforeach;
//            }
//        }else {
//            $sql = implode(',', $fields);
//        }
        $sql = implode(',', $fields);
        $this->sql .= rtrim($sql, ',');
        return $this;
    }

    function from($table = null) {
        $this->def_main_table = !is_null($table) ? $table : $this->def_main_table;
        $this->sql .= " FROM {$this->def_main_table} ";
        return $this;
    }

    /**
     * 
     * @param type $join_conditions - in the form 
     * [
     * ['tab1.field']='tab2.field'
     * ]
     */
    function join($join_conditions) {
        $join = '';
        foreach ($join_conditions as $tbl1_field => $tbl2_field) {

            $tbl_n_field = explode('.', $tbl1_field);
            $tbl_n2_field = explode('.', $tbl2_field);
            $tbl = array_shift($tbl_n_field);
            $tbl2 = array_shift($tbl_n2_field);
//            $join .= $this->_is_valid_join_tb($tbl) ? "\n JOIN {$tbl} ON {$tbl1_field}={$tbl2_field} " : "\n JOIN {$tbl2} ON {$tbl2_field}={$tbl1_field} ";
            $join .= "\n JOIN {$tbl} ON {$tbl1_field}={$tbl2_field} ";

            $this->tables[] = $tbl;
            $this->tables[] = $tbl2;
            $this->tables = array_unique($this->tables);
        }

        $this->sql .= ($this->tables && count($this->tables) > 1) ? " {$join}\n" : '';
        return $this;
    }

    /**
     * 
     * @param type $where
     * @return $this
     */
    function where($where = []) {
        $str_where = null;
        if (!empty($where)):
            $str_where = $this->db->where($where);
        endif;
        $this->sql .= "$str_where";
        return $this;
    }

    function orderBy($by, $order = null) {
//        $by = $this->filter_unwated_fields($by);
//        $this->sql .= !is_null($group) ? " \n GROUP BY {$group} " : null;
        $this->sql .= !is_null($by) ? " \n ORDER BY {$by} {$order}" : null;
        return $this;
    }

    function groupBy($group) {
//        $group = $this->filter_unwated_fields($group);
        $this->sql .= !is_null($group) ? " \n GROUP BY {$group} " : null;
        return $this;
    }

    function limit($limit) {
        $this->sql .= " \n LIMIT {$limit} ";
        return $this;
    }

    function exec() {
        $handle = $this->db->select($this->sql);
        $data = [
            'res' => $handle->getData(),
            'errors' => $handle->getError(),
            'sql' => $this->sql
        ];
        return $data;
    }

    function filter_unwated_fields($fields, $return_array = 0) {
        $orders = is_array($fields) ? $fields : explode(',', $fields);
        $box = [];
        foreach ($this->tables as $tbl) :
            foreach ($orders as $order) {
                $ord = explode('.', $order);
                if (in_array($tbl, $ord)):
                    $box[] = $order;
                endif;
            }
        endforeach;

        return empty($box) ? implode(',', $box) : null;
    }

}
