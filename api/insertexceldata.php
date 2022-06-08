<?php

require_once 'student.php';
require_once  'http://127.0.0.1:7173/api/config.php';
$db = new Database("sqlite");
$fields = array('name', '', '', '', '', '', '', '', '', '');
//echo '<pre>';
//var_dump($db->select("SELECT oppener.adm,oppener.name,oppener.form,oppener.bio as bio1,mid.bio as bio2 FROM oppener INNER JOIN mid "
//        . "ON oppener.adm=mid.adm WHERE oppener.form='1'")->getData());
//var_dump($db->errorInfo());

//$d1 = $db->select("SELECT * FROM oppener WHERE form ='1' ORDER BY adm LIMIT 2")->getData();
//$d2 = $db->select("SELECT * FROM mid WHERE form ='1' ORDER BY adm")->getData();

//var_dump($d1);
$s="(oppener.eng+oppener.mat+ oppener.kis+ oppener.bio+oppener.che+oppener.phy+oppener.geo+oppener.his+oppener.bst+oppener.agr+oppener.cre+"
        . "mid.mat+mid.kis+ mid.bio+mid.che+mid.phy+mid.geo+mid.his+mid.bst+mid.agr+mid.cre+end.eng+end.mat+end.kis+end.bio+end.che+end.phy+end.geo+end.his+end.bst+end.agr+end.cre)";
//$k="mks.total,mks.mp,mks.mg,";
$k=' as total,';
//$student_data = [];
$form1 = $db->select("SELECT DISTINCT ".$s.$k."oppener.kcpe,oppener.kcpe_points,oppener.gen,oppener.adm,oppener.name,oppener.form,oppener.eng as eng1,oppener.mat as mat1, oppener.kis as kis1, oppener.bio as bio1,oppener.che as che1,oppener.phy as phy1,oppener.geo as geo1, oppener.his as his1,oppener.bst as bst1,oppener.agr as agr1,oppener.cre as cre1,"
        . "mid.eng as eng2,mid.mat as mat2, mid.kis as kis2, mid.bio as bio2,mid.che as che2,mid.phy as phy2,mid.geo as geo2, mid.his as his2,mid.bst as bst2,mid.agr as agr2,mid.cre as cre2,end.eng as eng3,end.mat as mat3, end.kis as kis3, end.bio as bio3,end.che as che3,end.phy as phy3,end.geo as geo3, end.his as his3,end.bst as bst3,end.agr as agr3,end.cre as cre3 FROM oppener JOIN mid ON oppener.adm=mid.adm JOIN end ON oppener.adm=end.adm JOIN mks ON  oppener.adm=mks.adm  WHERE oppener.form='1' AND ".$s.">0 ORDER BY total DESC")->getData();
$form2 = $db->select("SELECT DISTINCT ".$s.$k."oppener.kcpe,oppener.kcpe_points,oppener.gen, oppener.adm,oppener.name,oppener.form,oppener.eng as eng1,oppener.mat as mat1, oppener.kis as kis1, oppener.bio as bio1,oppener.che as che1,oppener.phy as phy1,oppener.geo as geo1, oppener.his as his1,oppener.bst as bst1,oppener.agr as agr1,oppener.cre as cre1,"
        . "mid.eng as eng2,mid.mat as mat2, mid.kis as kis2, mid.bio as bio2,mid.che as che2,mid.phy as phy2,mid.geo as geo2, mid.his as his2,mid.bst as bst2,mid.agr as agr2,mid.cre as cre2,end.eng as eng3,end.mat as mat3, end.kis as kis3, end.bio as bio3,end.che as che3,end.phy as phy3,end.geo as geo3, end.his as his3,end.bst as bst3,end.agr as agr3,end.cre as cre3 FROM oppener JOIN mid ON oppener.adm=mid.adm JOIN end ON oppener.adm=end.adm JOIN mks ON oppener.adm=mks.adm  WHERE oppener.form='2' AND ".$s.">0 ORDER BY total DESC")->getData();
$form3 = $db->select("SELECT DISTINCT ".$s.$k."oppener.kcpe,oppener.kcpe_points,oppener.gen, oppener.adm,oppener.name,oppener.form,oppener.eng as eng1,oppener.mat as mat1, oppener.kis as kis1, oppener.bio as bio1,oppener.che as che1,oppener.phy as phy1,oppener.geo as geo1, oppener.his as his1,oppener.bst as bst1,oppener.agr as agr1,oppener.cre as cre1,"
        . "mid.eng as eng2,mid.mat as mat2, mid.kis as kis2, mid.bio as bio2,mid.che as che2,mid.phy as phy2,mid.geo as geo2, mid.his as his2,mid.bst as bst2,mid.agr as agr2,mid.cre as cre2,end.eng as eng3,end.mat as mat3, end.kis as kis3, end.bio as bio3,end.che as che3,end.phy as phy3,end.geo as geo3, end.his as his3,end.bst as bst3,end.agr as agr3,end.cre as cre3 FROM oppener JOIN mid ON oppener.adm=mid.adm JOIN end ON oppener.adm=end.adm JOIN mks ON  oppener.adm=mks.adm  WHERE oppener.form='3' AND ".$s.">0 ORDER BY total DESC")->getData();
$form4 = $db->select("SELECT DISTINCT ".$s.$k."oppener.kcpe,oppener.kcpe_points,oppener.gen, oppener.adm,oppener.name,oppener.form,oppener.eng as eng1,oppener.mat as mat1, oppener.kis as kis1, oppener.bio as bio1,oppener.che as che1,oppener.phy as phy1,oppener.geo as geo1, oppener.his as his1,oppener.bst as bst1,oppener.agr as agr1,oppener.cre as cre1,"
        . "mid.eng as eng2, mid.mat as mat2, mid.kis as kis2, mid.bio as bio2,mid.che as che2,mid.phy as phy2,mid.geo as geo2, mid.his as his2,mid.bst as bst2,mid.agr as agr2,mid.cre as cre2,end.eng as eng3,end.mat as mat3, end.kis as kis3, end.bio as bio3,end.che as che3,end.phy as phy3,end.geo as geo3, end.his as his3,end.bst as bst3,end.agr as agr3,end.cre as cre3 FROM oppener JOIN mid ON oppener.adm=mid.adm JOIN end ON oppener.adm=end.adm JOIN mks ON  oppener.adm=mks.adm  WHERE oppener.form='4' AND ".$s.">0 ORDER BY total DESC")->getData();

//define('form1_no',$db->select("SELECT DISTINCT COUNT( adm)as no FROM oppener WHERE form=1 ")->getData()[0]['no']);
//define('form2_no',$db->select("SELECT  DISTINCT COUNT( adm)as no FROM oppener WHERE form=2 ")->getData()[0]['no']);
//define('form3_no',$db->select("SELECT  DISTINCT COUNT( adm)as no FROM oppener WHERE form=3 ")->getData()[0]['no']);
//define('form4_no',$db->select("SELECT  DISTINCT COUNT( adm)as no FROM oppener WHERE form=4 ")->getData()[0]['no']);

define('form1_no',  count($form1));
define('form2_no',  count($form2));
define('form3_no',  count($form3));
define('form4_no',  count($form4));



//echo '<br>'."SELECT DISTINCT ".$k.$s."oppener.kcpe,oppener.kcpe_points,oppener.gen,oppener.adm,oppener.name,oppener.form,oppener.eng as eng1,oppener.mat as mat1, oppener.kis as kis1, oppener.bio as bio1,oppener.che as che1,oppener.phy as phy1,oppener.geo as geo1, oppener.his as his1,oppener.bst as bst1,oppener.agr as agr1,oppener.cre as cre1,"
//        . "mid.eng as eng2,mid.mat as mat2, mid.kis as kis2, mid.bio as bio2,mid.che as che2,mid.phy as phy2,mid.geo as geo2, mid.his as his2,mid.bst as bst2,mid.agr as agr2,mid.cre as cre2,end.eng as eng3,end.mat as mat3, end.kis as kis3, end.bio as bio3,end.che as che3,end.phy as phy3,end.geo as geo3, end.his as his3,end.bst as bst3,end.agr as agr3,end.cre as cre3 FROM oppener JOIN mid ON oppener.adm=mid.adm JOIN end ON oppener.adm=end.adm JOIN mks ON  oppener.adm=mks.adm  WHERE oppener.form='1' ORDER BY total DESC";
////$marks="SELECT oppener.eng+oppener.mat+ oppener.kis+ oppener.bio+oppener.che+oppener.phy+oppener.geo+oppener.his+oppener.bst+oppener.agr+oppener.cre+"
////        . "mid.mat+mid.kis+ mid.bio+mid.che+mid.phy+mid.geo+mid.his+mid.bst+mid.agr+mid.cre+end.eng+end.mat+end.kis+end.bio+end.che+end.phy+end.geo+end.his+end.bst+end.agr+end.cre as total FROM oppener JOIN mid ON oppener.adm=mid.adm JOIN end ON oppener.adm=end.adm ORDER BY adm ";


//var_dump($form2);
//var_dump($form3[0]);
define('FORM1_DATA',  $form1);
define('FORM2_DATA',$form2);
define('FORM3_DATA',$form3);
define('FORM4_DATA',$form4);
define("DATA",array(
    '1'=>$form1,
    '2'=>$form2,
    '3'=>$form3,
    '4'=>$form4,
));
define('TERM',2);
define("YEAR", "2018");
//echo count(FORM2_DATA);
//print_r(FORM1_DATA);

var_dump(['name'=>45]);
//$st=new Student(FORM3_DATA[0]);
//
//var_dump($st->marks);