<?php

require_once 'sub_libs/repo_gen.php';


/* * **************************************************************************************************** */

//$pdf = new PDF(
//        array(
//    // 'school' => array(
//    'name' => 'tsagwa', 'tel' => '0714-050682', 'level' => 'secondary', 'box' => '236 - 80105, kaloleni', 'motto' => 'Success By Effort'
//    // )
//    ,
//    'logo' => array('images/tsagwa_logo.png')
//        )
//);

$pdf->AliasNbPages();
$students = [
    [
        'adm' => '504',
        'name' => 'faith malingi',
        'gen' => 'f',
        'kcpe' => '231',
        'form' => '1',
        'rank' => '6',
        'marks' => [
            'mat' => [53, 55],
            'eng' => [52, 61],
            'kis' => [30, 36],
            'bio' => [70, 70],
            'che' => [69, 69],
            'phy' => [45, 52],
            'geo' => [34, 36],
            'his' => [72, 72],
            'bst' => [60, 60],
            'cre' => [72, 72],
            'agr' => [60, 60]
        ]
    ],
    [
        'adm' => '494',
        'name' => 'emmanuel mrengi',
        'gen' => 'm',
        'form' => '1',
        'kcpe' => '233',
        'rank' => '',
        'marks' => [
            'mat' => [40, 42],
            'eng' => [54, 80],
            'kis' => [66, 50],
            'bio' => [69, 28],
            'che' => [45, 30],
            'phy' => [17, 31],
            'geo' => [48, 57],
            'his' => [50, 63],
            'bst' => [40, 54],
            'cre' => [54, 33],
            'agr' => [33, 87]
        ]
    ],

    [
        'adm' => '525',
        'name' => 'edward mwembe',
        'gen' => 'm',
        'kcpe' => '206',
        'form' => '1',
        'rank' => '',
        'marks' => [
            'mat' => [55, 48],
            'eng' => [30, 53],
            'kis' => [66, 58],
            'bio' => [58, 83],
            'che' => [44, 66],
            'phy' => [33, 43],
            'geo' => [38, 48],
            'his' => [45, 67],
            'bst' => [76, 60],
            'cre' => [40, 20],
            'agr' => [57, 83]
        ]
    ],

    [
        'adm' => '502',
        'name' => 'mercy mwadzombo',
        'gen' => 'f',
        'kcpe' => '333',
        'form' => '2',
        'rank' => '',
        'marks' => [
            'mat' => [53, 56],
            'eng' => [80, 85],
            'kis' => [88, 70],
            'bio' => [40, 59],
            'che' => [52, 57],
            'his' => [70, 86],
            'bst' => [92, 79],
            'cre' => [80, 81],
        ]
    ]
];
$created = [];
//    $d = un_vals(DATA[$form]);
//$d = un_vals(FORM4_DATA);

$d = !empty($post['data']) ? $data : $students;
//$d =  $students;


//var_dump($d);
//exit();
//    while ($n < count($d)) {
$n=0;
$stdnt_cls="";
foreach ($d as $value) {
    

    $pdf->AddPage();
//        define("FORM_DATA", $d);
    $stdnt = new Student($d, $value, $n);
//    var_dump($stdnt);

//       if (count($stdnt->marks) >= 7 && !in_array($stdnt->adm, $created)) {
//            $created[] = $stdnt->adm;
//    $stdnt_cls="Form_".$value['form'];
    $stdnt_cls="Form_".$stdnt->class.'_term_'.$stdnt->term.'_';
    $pdf->initData($stdnt);
    $pdf->studentDetails($value);
    $pdf->pageContent();
    $pdf->comments();
//        }0
//    }
    $n++;
}
//for ($n = 0; $n < count($d); $n++) {
//    $pdf->AddPage();
////        define("FORM_DATA", $d);
//    $stdnt = new Student($d, $d[$n], $n);
//
//
////       if (count($stdnt->marks) >= 7 && !in_array($stdnt->adm, $created)) {
////            $created[] = $stdnt->adm;
//    $pdf->initData($stdnt);
//    $pdf->studentDetails($data[$n]);
//    $pdf->pageContent();
//    $pdf->comments();
////        }
////    }
//}
//    $pdf->Output('i', 'report.pdf');
    $pdf->Output('i',  $stdnt_cls.'_report_'.date('Y_m_d_H_i_s').'.pdf');
//$pdf->Output();
//   $s=  $pdf->Output('s');
//   $handle= fopen('file.pdf','a+');
//   if($handle){
//       file_put_contents('file.pdf', $s);
//   }
     


