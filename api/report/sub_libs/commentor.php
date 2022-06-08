<?php

class Commentor {

    private $kcpe = 0;
    private $student;
    private $rank = 0;
    private $grade = null;
    private $sub_grades = [];
    private $gen = null;
    private $poor_grades = array("E", "D-");
    private $trs_comments = array("well behaved", "desciplined", "good");
    private $prc_p_com = array(
        "This is  a poor performance, you need to put more effort in your studies",
        "This is  a poor performance, work hard to improve",
        "This is  an unpleasant performance, put more effort in your studies",
        "Your Performance is not pleasing at all, concentrate in your studies for improvent"
    );
    private $ability = "average";

//    private $kcpe=0;
//    private $kcpe=0;


    function __construct(Student $student) {
        $this->student=$student;
        $this->init($student);
        
    }

    private function init($student) {
        $this->kcpe = !empty($student->kcpe) && !empty($student->kcpe) !== 0 ? $student->kcpe : $this->kcpe;
        $this->rank = $student->rank;
        $this->mg = $student->mg;
        $this->grade= $student->mg;
        $this->sub_grades = $student->sub_com_grades;
        $this->gen = strtoupper(trim($student->gen));
       
    }

    private function create() {

        if ($this->kcpe < 35 * 5 && in_array($this->grade, $this->poor_grades)) {
            $this->ability = "si";
        }
//       if($this->kcpe) {
//            case 0&& in_array($this->grade, $this->poor_grades):
//
//                break;
//
//            default:
//                break;
//        }
//        
    }

    function class_teacher() {
        $max = count($this->trs_comments) - 1;
        $com = "";
        $com .= $this->gen === "M" ? "He" : "She";
        $com .= " is a " . $this->trs_comments[rand(0, $max)];
        $com .= " student";
        return $com;
    }

    function principal() {
        $max = count($this->prc_p_com) - 1;
        $grads = [];
        $com = "";
        $reduce = "";
        $work_hard = "";
        $be_sereous = "";
        $N = 0;
        foreach ($this->sub_grades as $sub => $grad) {
            if (in_array(strtoupper($grad), $this->poor_grades)) {
                $grads[$sub] = $grad;
                        $reduce .= $grad . "'s" . ",";
            }
        }
        
//        var_dump($grads);        
        $reduce = $reduce !== "" ? rtrim($reduce, ",") : "";
        if (in_array($this->grade, $this->poor_grades)) {
//        if (in_array($this->mg, $this->poor_grades)) {
            return $this->prc_p_com[rand(0, $max)];
        } elseif (in_array($this->grade, array("D+", "D", "C-", "C"))) {
            $s1 = $reduce !== "" ? "You can do better than this, but you need to redude grade " . implode(",", array_unique($grads)) : "You can do better than this, more effort is required";
            return $s1;
        } elseif (in_array($this->grade, array("B", "B-", "C+"))) {
            $s2 = $reduce !== "" ? "This is a goog performance, but more effort is required in " . implode(",", array_keys($grads)) . " in order to better your performance." :
                    "Good performance, aim higher.";
            return $s2;
        } elseif (in_array($this->grade, array("A", "A-", "B+"))) {
            $s3 = $reduce !== "" ? "Excellent performance, but more effort is required in " . implode(",", array_keys($grads)) . " in order to better your performance." :
                    "Excellent performance! Keep it up";
            return $s3;
        }
    }

}
