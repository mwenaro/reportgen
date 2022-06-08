<?php

class _Sta {

    static $system_year_latest = null;
    static $year_latest = null;
    static $year_latest_all = null;

    function __construct() {
        $this->year_latest;
       
       
        self::$year_latest=date('Y');  
    }
    function get_yet() {
        
    }
    
    /**
     * 
     * @param type $val
     * @param type $data
     * @return int
     */
    static function rank_one($val, $data) {

        $in_val = $val;
        $val = is_array($val) ? array_sum($val) : $val;
        $pro_data = [];
        if (is_array($in_val)) {

            foreach ($data as $_v) {
                $pro_data[] = array_sum($_v);
            }
        }
        $w_data = is_array($in_val) ? $pro_data : $data;

        if (in_array($val, $w_data)) {
            rsort($w_data);
            $pre_value = $cur_value = 0;
            $rank = 1;
            $count = 1;
            foreach ($w_data as $value) {
                if ($pre_value !== 0) {
                    if ($value < $pre_value):
                        $rank = $count;
                    endif;
                }

                $pre_value = $value;
                if ($val === $value) {
                    return $rank;
                }
                $count += 1;
            }
        }
    }

    static function _rank_one1($val, $data) {
        $w_data = $data;
        $rank = -1;
        if (in_array($val, $w_data)) {
            rsort($w_data);
            $pre_value = $cur_value = 0;
            $rank = 1;
            $count = 1;
            foreach ($w_data as $value) {
                if ($pre_value !== 0) {
                    if ($value < $pre_value):
                        $rank = $count;
                    endif;
                }

                $pre_value = $value;
                if ($val === $value) {
                    return $rank;
                }
                $count += 1;
            }
        }
    }
    

}
