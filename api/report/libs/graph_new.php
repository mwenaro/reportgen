<?php

//error_reporting(1);

require_once 'libs/fpdf/fpdf.php';
require_once 'student_new.php';
require_once 'commentor.php';
require_once 'maths.php';
//require_once 'insertexceldata_try.php';


class PDF extends FPDF {

// Page header
    private $trsIn = array(
        "eng" => array(1 => "M.M", 2 => "F.N", 3 => "M.M", 4 => "M.M"),
        "mat" => array(1 => "H.K", 2 => "S.K", 3 => "H.K", 4 => "M.A"),
        "kis" => array(1 => "R.M", 2 => "R.M", 3 => "R.M", 4 => "R.M"),
        "bio" => array(1 => "P.S", 2 => "C.L", 3 => "C.L", 4 => "P.S"),
        "che" => array(1 => "S.K", 2 => "S.K", 3 => "S.K", 4 => "C.L"),
        "phy" => array(1 => "M.A", 2 => "M.A", 3 => "M.A", 4 => "M.A"),
        "geo" => array(1 => "K.S", 2 => "K.S", 3 => "K.S", 4 => "K.S"),
        "his" => array(1 => "K.S", 2 => "K.S", 3 => "R.M", 4 => "G.O"),
        "cre" => array(1 => "G.O", 2 => "G.O", 3 => "G.O", 4 => "G.O"),
        "agr" => array(1 => "P.S", 2 => "P.S", 3 => "P.S", 4 => "P.S"),
        "bst" => array(1 => "H.K", 2 => "H.K", 3 => "H.K", 4 => "H.K"),
    );
    private $colHeight = 8;
    private $colWidth = 25;
    private $markColName = array('Oppener', 'End Term');
    private $data = array('eng' => array(15, 58, 75), 'kis' => array(0, 0, 8), 'mat' => array(50, 62, 79), 'bio' => array(20, 30, 50), 'chem' => array(30, 30, 30), 'phy' => array(19, 30, 60), 'geo' => array(30, 30, 30), 'his' => array(30, 30, 30), 're' => array(30, 30, 30), 'b/st' => array(15, 30, 46), 'agr' => array(90, 19, 76));
    private $school_level = 'level';
    private $school_motto = 'school motto';
    private $school_name = 'This School';
    private $reportTitle = 'Student Terminal Report Form';
    private $school_box = 'xx, TOWN';
    private $school_tel = '+2547xxxxxxxxx';
    //Report Frame Details
    private $reportFrameTopY; //Upper Y value of Big Rect
    private $reportFrameBottomY; //Bottom Y value of Big Rect
    private $reportFrameWidth; //Width of Big Rect
    private $reportFrameLeftX; //Left X of Big Rect
    private $reportFrameHeight; //Heigh of Big Rect
    //Student Details Frame
    private $studentFrameTopY; //Upper Y value of student Rect
    private $studentFrameBottomY; //Bottom Y value of student Rect
    private $studentFrameWidth; //Width of student Rect
    private $studentFrameHeight; //Heigh of student Rect
    //Results Table Frame
    private $resultsFrameTopY; //Upper Y value of Results  Rect
    private $resultsFrameBottomY; //Bottom Y value of Results  Rect
    private $resultsFrameLeftX; //Left X of Big Rect
    private $resultsFrameWidth; //Width of Results  Rect
    private $resultsFrameHeight; //Heigh of Big Rect
    //Comments  Frame
    private $commentsFrameTopY; //Upper Y value of Comments  Rect
    private $commentsFrameBottomY; //Bottom Y value of Comments  Rect
    private $commentsFrameWidth; //Width of Comments  Rect
    private $commentsFrameLeftX; //Left X of Big Rect
    private $commentsFrameHeight; //Heigh of Big Rect
    //Graph (Result Analysis)  Frame
    private $graphFrameTopY; //Upper Y value of Graph  Rect
    private $graphFrameBottomY; //Bottom Y value of Graph  Rect
    private $graphFrameLeftX; //Left X of Big Rect
    private $graphFrameWidth; //Width of Graph  Rect
    private $graphFrameHeight; //Heigh of Big Rect
    //Updates  Frame - Fee balance & Openning Dates
    private $updatesFrameTopY; //Upper Y value of Graph  Rect
    private $updatesFrameBottomY; //Bottom Y value of Graph  Rect
    private $updatesFrameLeftX; //Left X of Big Rect
    private $updatesFrameWidth; //Width of Graph  Rect
    private $updatesFrameHeight; //Heigh of Big Rect
    // Page Diemensions
    private $pageWith;
    private $pageHeight;
    private $headerFrameHeigt;
    //Path of the logo
    private $logoPath = null;
    private $defaultLogoPath;
    private $init_info = array();
    private $sch_defaults = array(
        //'school' =>     array(
        'name' => 'this school', 'level' => 'secondary', 'tel' => '+2547xxxxxxxxx', 'box' => 'xxxx - code, town', 'motto' => 'school motto'
        //)
        , 'logo' => array('logo.jpg'
    ));

    function __construct($in_put = array()) {
        parent::__construct();
        $this->mat = new Maths();
        $this->init_info = $in_put;
         $this->fillColour = array(200, 200, 200);
        $this->init();
    }

    function init() {
        // $this->initArrayVars($this->sch_defaults, $this->init_info, 'inst', 'school');
        $this->myfillcolour = array(200, 200, 200);
       
        foreach ($this->sch_defaults as $var => $value) {
            if (array_key_exists($var, $this->init_info)):
                $n = 'school_' . $var;
                $this->$n = $this->init_info[$var];
            else:
                $n = 'school_' . $var;
                $this->$n = $value;
            endif;
        }
        $this->student_total_mks = $this->student_total_pts = array();
        //Report title
        $this->reportTitle = 'Student Terminal Report Form';
        //Report Frame
        $this->reportFrameTopY = 10;
        $this->reportFrameHeight = $this->h - 30;
        $this->reportWidth = $this->reportFrameWidth = $this->w - 20;
        $this->reportFrameLeftX = 10;
        $this->reportFrameBottomY = $this->reportFrameTopY + $this->reportFrameHeight;

        //header height
        $this->headerFrameHeigt = 32;

        //Students Details
        //$this->studentFrameTopY = $this->reportFrameTopY + 30;
        $this->studentFrameTopY = $this->reportFrameTopY + $this->headerFrameHeigt;
        $this->studentFrameWidth = $this->reportFrameWidth;
        $this->studentFrameLeftX = $this->reportFrameLeftX;
        $this->studentFrameHeight = 25;
        $this->studentFrameBottomY = $this->studentFrameTopY + $this->studentFrameHeight;

        //Results Frame
        $this->resultsFrameTopY = $this->studentFrameBottomY;
        $this->resultsFrameWidth = $this->reportFrameWidth;
        $this->resultsFrameLeftX = $this->reportFrameLeftX;
        $this->resultsFrameHeight = 78;
        $this->resultsFrameBottomY = $this->resultsFrameTopY + $this->resultsFrameHeight;

        //Graph Frame
        $this->graphFrameTopY = $this->resultsFrameBottomY;
        $this->graphFrameWidth = $this->resultsFrameWidth;
        $this->graphFrameLeftX = $this->resultsFrameLeftX;
        $this->graphFrameHeight = 57;
        $this->graphFrameBottomY = $this->graphFrameTopY + $this->graphFrameHeight;


        //Comments Frame
        $this->commentsFrameTopY = $this->graphFrameBottomY;
        $this->commentsFrameWidth = $this->graphFrameWidth;
        $this->commentsFrameLeftX = $this->graphFrameLeftX;
        $this->commentsFrameHeight = 50;
        $this->commentsFrameBottomY = $this->commentsFrameTopY + $this->commentsFrameHeight;


        // Page Diemensions
        $this->pageWith;
        $this->pageHeight = $this->reportFrameHeight;

        //Column
        $this->colWidth = (200 / 9) + 2.6;
        //   $this->colHeight = (100 / 12);
        //logo path
        // $this->logoPath = !is_null($this->logoPath) ? $this->logoPath : $this->defaultLogoPath;
        $this->logoPath = array_key_exists('logo', $this->init_info) ? $this->init_info['logo'][0] : $this->sch_defaults['logo'][0];
    }

    function Header() {
        // positioning the Header
        $this->SetY($this->reportFrameTopY + 2);
        //Report Frame

        $this->Rect($this->reportFrameLeftX, $this->reportFrameTopY, $this->reportFrameWidth, $this->reportFrameHeight);

        //Students Details
        $this->Rect($this->studentFrameLeftX, $this->studentFrameTopY, $this->studentFrameWidth, $this->studentFrameHeight);

        //Results
        $this->Rect($this->resultsFrameLeftX, $this->resultsFrameTopY, $this->resultsFrameWidth, $this->resultsFrameHeight);

        //Graph
        $this->Rect($this->graphFrameLeftX, $this->graphFrameTopY, $this->graphFrameWidth, $this->graphFrameHeight);

        //Comments
        //  $this->Rect($this->commentsFrameLeftX, $this->commentsFrameTopY, $this->commentsFrameWidth, $this->commentsFrameHeight);
        // $this->SetY(10);//    // Logo
        //  $this->Image($file, $x, $y, $w);
        $this->Image($this->logoPath, $this->reportFrameLeftX + 2, $this->reportFrameTopY, '', $this->headerFrameHeigt - 2);

        //    // Arial bold 15
        //    $this->SetFont('Arial','B',15);
        //    // Move to the right
        $this->Cell($this->colWidth);


        $this->SetFont('Arial', 'B', 20);
        // Calculate width of title and position
        $w = $this->GetStringWidth($this->school_name . ' ' . $this->school_level . ' School') + 6;
        $this->SetX((30 + 210 - $w) / 2);
        // Colors of frame, background and text
        $this->SetDrawColor(0, 80, 180);
        $this->SetFillColor(230, 230, 0);
        $this->SetTextColor(220, 50, 50);
        // Thickness of frame (1 mm)
        // $this->SetLineWidth(1);
        // Title
        $this->Cell($w, 9, ucwords($this->school_name . ' ' . $this->school_level . ' School'), 0, 1, 'C');
        $this->SetFont('Arial', '', 13);

        $this->Ln(1);
        $w = $this->GetStringWidth($this->school_box);
        $this->SetX((30 + $this->reportFrameWidth - $w) / 2);
        $this->SetTextColor(50, 50, 50);
        $this->Cell($w, 5, 'P.O. BOX ' . strtoupper($this->school_box), 0, 1, 'C');
        // $this->Cell(0, 9, 'P.O. BOX 126-80105, KALOLENI', 0, 1, 'C');
        // $this->Ln(1);
        $this->Ln(1);
        $this->SetFont('Arial', 'I', 12);
        $this->Cell($this->colWidth);
        $this->SetTextColor(50, 50, 50);
        //$this->Cell(0, 9, 'TEL: 0701687982', 0, 1, 'C');
        $this->Cell(0, 5, 'TEL. ' . $this->school_tel, 0, 1, 'C');
        $this->Ln(1);
        //Motto
        $this->SetFont('Arial', 'BIU', 12);
        $this->Cell($this->colWidth);
        $this->SetTextColor(50, 50, 50);
        $this->Cell(0, 5, 'Motto: ' . ucfirst($this->school_motto), 0, 1, 'C');

        // $this->Ln(10);
    }

//    function functionName($param) {
//        
//    }
    function studentDetails($data = array()) {
        //graphY($topX, $topY, $w, $h, $data = array(), $X_axis_Label = array(), $Y_axis_Label = array(),$fillColour=array())
        //$this->graphY($topX, $topY, $w, $h, $dependances);
//        $t = 'F' . $this->student->form . 'T' . TERM;
        $t = 'F' . $this->student->form . 'T' . '3';
        $this->graphY($this->graphFrameLeftX, $this->graphFrameTopY, $this->w * 0.6, $this->graphFrameHeight, array('data' => array(
                'KCPE' => $this->mat->grade($this->student->kcpe >= 0 ? round($this->student->kcpe / 5, 0) : 1)['p'],
                //$t => $this->mat->grade($this->student->mean)['p'],
                $t => $this->student->mp,
            ), 'font' => array('style' => 'B')));
        $this->graphY(($this->graphFrameLeftX + $this->w * 0.58), $this->graphFrameTopY, $this->w * 0.35, $this->graphFrameHeight, array(
            'xLabels' => array('KCPE' => 1, 'F1' => 2, 'F 2' => 3, 'F3' => 4, 'F4' => 5, 'KCSE' => 6),
            'title' => 'A Histogram Showing Anual Mean Grades',
            'data' => array(
                'KCPE' => $this->mat->grade($this->student->kcpe >= 0 ? round($this->student->kcpe / 5, 0) : 1)['p']
            )
        ));
        //$this->Rect($this->graphFrameLeftX, $this->graphFrameTopY, $this->w * 0.6, $this->graphFrameHeight);
        $this->SetY($this->studentFrameTopY);
        $this->SetX($this->reportFrameLeftX);
//        $defaults = array('name' => ' mwero the webmaker', 'term' => '1', 'adm' => 7173, 'year' => '', 'form' => '2', 'stream' => 'p');
//        foreach ($defaults as $var => $value) {
//
//            if (array_key_exists($var, $data)):
//                $phrase = 'student_' . $var;
//                $this->$phrase = $$var = $data[$var];
//
//            else:
//                $phrase = 'student_' . $var;
//                $this->$phrase = $$var = $value;
//            endif;
//        }
        $w = $this->GetStringWidth($this->reportTitle);
        $this->SetX(($this->reportFrameWidth - $w) / 2);
        $this->SetTextColor(0, 255, 0);
        $this->SetFont('Arial', 'BUI', 15);
        $this->Cell($w, 7, $this->reportTitle, 0, 1, 'C');
        $this->Ln(1);
        $colH = 3.5;
        // if (1):
        $boda = 0;
        $this->SetX($this->reportFrameLeftX);
        $width = $this->reportFrameWidth / 9;
//Row 1 name,adm,form,term,year
        $this->SetTextColor(0, 0, 0);
        $this->SetFont('Arial', '', 8);
        $this->Cell($width * 1.2, $colH, 'STUDENT NAME :', 0, 0, '');

        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * 2.5, $colH, strtoupper($this->student->name), 'B', 0, 'C');

        $this->SetFont('Arial', '', 8);
        $this->Cell($width * .8, $colH, 'ADM NO :', 0, 0, 'R');

        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * .5, $colH, strtoupper($this->student->adm), 'B', 0, 'C');

        $this->SetFont('Arial', '', 8);
        $this->Cell($width * 0.8, $colH, 'FORM :', $boda, 0, 'R');
        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * 0.5, $colH, strtoupper($this->student->form), 'B', 0, 'C');

        $this->SetFont('Arial', '', 8);
        $this->Cell($width * .8, $colH, 'TERM :', $boda, 0, 'R');
        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * 0.5, $colH, $this->student->term, 'B', 0, 'C');

        $this->SetFont('Arial', '', 8);
        $this->Cell($width * 0.8, $colH, 'YEAR :', $boda, 0, 'R');
        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * 0.5, $colH, $this->student->year, 'B', 1, 'C');

        $this->SetX($this->reportFrameLeftX);
        $this->Ln(2);

//row 2 : mean score, mean grade, points,pos, out of,

        $this->SetFont('Arial', '', 8);
        $this->Cell($width * 1.2, $colH, 'TOTAL MARKS :', 0, 0, '');
        //$this->student->mean=round(FORM<3?$this->mat->sum($this->student->marks)['s']/3*11:$this->mat->sum($this->student->marks)['s']/3*8);
        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * 1.1, $colH, round($this->student->total, 0), 'B', 0, 'C');

        $this->SetFont('Arial', '', 8);
        $this->Cell($width * 1.2, $colH, 'MEAN GRADE:', 0, 0, 'R');

        $this->SetFont('Arial', 'B', 8);
        // $this->Cell($width * 1.0, $colH,  $this->mat->grade($this->student->mean)['g'], 'B', 0, 'C');
        $this->Cell($width * 1.0, $colH, $this->student->mg, 'B', 0, 'C');

        $this->SetFont('Arial', '', 8);
        $this->Cell($width * 0.8, $colH, 'POINTS:', $boda, 0, 'R');
        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * 0.8, $colH, $this->student->mp, 'B', 0, 'C');
        //  $this->points = $this->mat->grade($this->student->mp)['p'];
        $this->SetFont('Arial', '', 8);
        $this->Cell($width * .8, $colH, 'POS:', $boda, 0, 'R');
        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * 0.5, $colH, $this->student->rank, 'B', 0, 'C');

        $this->SetFont('Arial', '', 8);
        $this->Cell($width * 1.0, $colH, 'OUT OF :', $boda, 0, 'R');
        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * 0.5, $colH, $this->student->form_no, 'B', 1, 'C');


        $this->SetX($this->reportFrameLeftX);
        $this->Ln(2);

//row 3 : kcpe, kcpe grade, points,pos, out of,

        $this->SetFont('Arial', '', 8);
        $this->Cell($width * 1.2, $colH, 'KCPE MARKS :', 0, 0, '');

        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * 1.1, $colH, is_numeric($this->student->kcpe) && $this->student->kcpe > 0 ? $this->student->kcpe : '-', 'B', 0, 'C');

        $this->SetFont('Arial', '', 8);
        $this->Cell($width * 1.2, $colH, 'MEAN GRADE:', 0, 0, 'R');

        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * 1.0, $colH, is_numeric($this->student->kcpe) && $this->student->kcpe > 0 ? $this->mat->grade($this->student->kcpe / 5)['g'] : '-', 'B', 0, 'C');

        $this->SetFont('Arial', '', 8);
        $this->Cell($width * 0.8, $colH, 'POINTS:', $boda, 0, 'R');
        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * 0.8, $colH, is_numeric($this->student->kcpe) && $this->student->kcpe > 0 ? $this->mat->grade($this->student->kcpe / 5)['p'] : '-', 'B', 0, 'C');

        $this->SetFont('Arial', '', 8);
        $this->Cell($width * .8, $colH, 'POS:', $boda, 0, 'R');
        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * 0.5, $colH, '-', 'B', 0, 'C');

        $this->SetFont('Arial', '', 8);
        $this->Cell($width * 1.0, $colH, 'OUT OF :', $boda, 0, 'R');
        $this->SetFont('Arial', 'B', 8);
        $this->Cell($width * 0.5, $colH, '-', 'B', 1, 'C');

//        $this->Ln(3);
        // endif;
    }

    function putPair($data = array()) {
        $width = $data['width'];
        $boder = '';
        $n = 0;
        foreach ($data as $key => $data_pair) {
            $n === count($data) - 1 ? $boder = '1' : '';
            $this->putCell($width[$n], $h, $txt, $setings);
        }
    }

// Page footer
    function Footer() {
        // Position at 1.5 cm from bottom
        $this->SetY(-15);

        //  $this->Cell(0, 10, $this->foot, 0, 0, 'C');
        // Arial italic 8
//        $this->SetFont('Arial', 'I', 8);
//        // Page number
        $this->Cell(0, 10, 'Page ' . $this->PageNo() . '/{nb}', 0, 0, 'C');
    }

    function average($param) {
        return $this->mat->average($param);
    }

    function pageContent($data = array()) {
        $sub_names = array(
            'mat' => 'mathematics',
            'bio' => 'biology',
            'che' => 'chemistry',
            'geo' => 'geography',
            'kis' => 'kiswahili',
            'eng' => 'english',
            'his' => 'history',
            'bst' => 'b/studies',
            'agr' => 'agriculture',
            'cre' => 'cre',
            'phy' => 'physics'
        );
        //  $this->SetFont('Arial', '', 7);
//        $this->studentDetails();
        $this->SetY($this->studentFrameBottomY);
        $this->setx($this->reportFrameLeftX);
        $data = !empty($data) ? $data : $this->student->marks;
        $this->student_total_mks = $this->student_total_pts = $this->student_grades = array();
        $this->student->sub_grades = [];
        if (!empty($data)) {

//            $markRound = count($data[array_keys($data)[2]]);
            $markRound = $this->student->no_exam;
            $subNumber = count($data);

            $this->colHeight = 5;
            //(($this->resultsFrameHeight-16) / ($subNumber+1));
            $this->colWidth = $markRound === 1 ? $this->reportFrameWidth / 7 : $this->reportFrameWidth / (7 + $markRound);
            $this->SetFont('Arial', 'B', 12);
            $this->SetTextColor(50, 50, 50);
            $this->Cell($this->colWidth + 2 + 4 + 3, $this->colHeight, 'Subject', 1, 0, 'C');
            //$this->Cell($this->colWidth);
            // $markRound = count(array_keys($data['eng']));

            $n = 0;
            while ($n < $markRound) {
//                $this->Cell($this->colWidth, $this->colHeight, $this->markColName[$markRound - $n - 1], 1, 0, 'C');
//                $n++;
                $k = $n;
                if ($markRound !== 1 && $n < $markRound) {
                    // $this->Cell($this->colWidth, $this->colHeight, $mark[$n], 1, 0, 'C');
                    $this->Cell($this->colWidth, $this->colHeight, $this->markColName[$markRound - $n - 1], 1, 0, 'C');
                }
                if ($k == $markRound - 1):
                    $this->Cell($this->colWidth, $this->colHeight, '% Mark', 1, 0, 'C');
                    $this->Cell($this->colWidth - 5, $this->colHeight, 'Grade', 1, 0, 'C');
                    $this->Cell($this->colWidth - 5, $this->colHeight, 'Points', 1, 0, 'C');

                endif;
                $n++;
            }

            $this->Cell($this->colWidth - 8, $this->colHeight, 'Pos', 1, 0, 'C');
            $this->Cell($this->colWidth + 10 + 3, $this->colHeight, 'Remark', 1, 0, 'C');

            $this->Cell($this->colWidth - 4, $this->colHeight, 'Initials', 1, 1, 'C');
            foreach ($data as $sub => $mark) {

                $this->setx($this->reportFrameLeftX);
                $this->SetFont('Arial', '', 10);
                $this->Cell($this->colWidth + 2 + 4 + 3, $this->colHeight, strtoupper($sub_names[$sub]), 1, 0);

                //$this->Cell($this->colWidth);
                $n = 0;
                while ($n < $markRound) {
                    $k = $n;
                    if ($markRound !== 1 && $n < $markRound) {
                        $this->Cell($this->colWidth, $this->colHeight, !is_numeric($mark[$n]) || empty($mark[$n]) ? '-' : $mark[$n], 1, 0, 'C');
                    }

                    if ($k == $markRound - 1):
                        $this->putCell($this->colWidth, $this->colHeight, $this->mat->grade($mark, false, false, $this->student->no_exam)['m'], array('border' => 1, 'align' => 'C', 'ln' => 0));
                        // $this->Cell($this->colWidth, $this->colHeight, $this->mat->grade($mark)['m'], 1, 0, 'C');
                        $this->Cell($this->colWidth - 5, $this->colHeight, $this->mat->grade($mark, false, false, $this->student->no_exam)['g'], 1, 0, 'C');
                        $this->student->sub_grades[] = $this->mat->grade($mark)['g'];
                        $this->Cell($this->colWidth - 5, $this->colHeight, $this->mat->grade($mark, false, false, $this->student->no_exam)['p'], 1, 0, 'C');
                    endif;
                    $n++;
                }

                $this->student_total_mks[] = $this->mat->grade($mark)['m'];
                $this->student_total_pts[] = $this->mat->grade($mark)['p'];
                $this->student_grades[] = $this->mat->grade($mark)['g'];
                $this->Cell($this->colWidth - 8, $this->colHeight, '-', 1, 0, 'C');
                if (strtolower($sub) == 'kis'):
                    $this->Cell($this->colWidth + 10 + 3, $this->colHeight, $this->mat->grade(($mark))['k'], 1, 0, '');
                else:
                    $this->Cell($this->colWidth + 10 + 3, $this->colHeight, $this->mat->grade(($mark))['c'], 1, 0, '');
                endif;
                $this->Cell($this->colWidth - 4, $this->colHeight, $this->trsIn[strtolower($sub)][$this->student->form], 1, 1, 'C');

                //End of Results table
            }
            $yr = $this->student->term;
            //Analysis table
            $colsdata = array(
                'header' => array('term', 'year', 'Marks', 'points', 'mean', 'class', 'stream', 'dev'),
                'header1' => array('', '', 'total', 'of', 'total', 'of', 'p', 'g', 'pos', 'of', 'pos', 'of', ''),
                '1' => array(
                    $this->student->term, //term1
                    $this->student->year, //year2
                    round($this->student->total, 0) //mks total3
                    , $this->student->sub_no * 100//mks of4
                    , $this->student->points//points5
                    , $this->student->sub_no * 12
                    , $this->student->mp
                    //,  $this->student->mg
                    , $this->mat->grade($this->student->mp, false, true)['g']
                    , $this->student->rank,
                    $this->student->form_no
                    , '-'
                    , '-'
                    , '-'
                )
////                '2' => array($yr + 2, 'y', 't', 'f', 't', 'f', 'm.p', 'm.g', 'p', 'f', 'p', 'f', ''),
////                '3' => array($yr + 1, 'y', 't', 'f', 't', 'f', 'm.p', 'm.g', 'p', 'f', 'p', 'f', '')
            );

            $width = $this->reportFrameWidth / count($colsdata['header']);
            $this->SetX($this->reportFrameLeftX);
            $h = ($this->resultsFrameHeight - 5 * ($subNumber + 1)) / 6;

            $this->Ln($h);
            //\ $h = 3;
            $this->SetTextColor(0, 0, 0);
            $ftyle = '';
            $ln = '';
            //   $this->SetFont('Arial', '', 10);
            // $this->Cell($width, $this->colHeight, 'This Term :', 1, 0, '');
            $r = 0;
            foreach ($colsdata as $row => $cols) {
                $n = 0;
                $fstyle = '';
                $fsize = 8;
                $fname = 'Times';
                $ln = '';
                $w = $width;
                $this->SetX($this->reportFrameLeftX);
                $cols = $this->changeCase($cols, 'sen');
                foreach ($cols as $value) {
                    $w1 = $width;
                    $border = 1;
                    $border = strtolower($row) === 'header' ? 'TLR' : $border;
                    $border = $r === 1 ? 'BLR' : $border;
                    $fstyle = strtolower($row) === 'header' ? 'B' : $fstyle;
                    $fsize = strtolower($row) === 'header' ? 8 : $fsize;
                    $width = strtolower($row) !== 'header' && in_array($n, array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11)) ? ($w / 2) : $w;
                    $border = $width === ($w / 2) ? 1 : $border;
                    // $width=strtolower($row) !== 'header'&&in_array($n,array(3,4,5,6)) ?  ($w/2):$width;
                    // $fname = strtolower($row) === 'header' ? 'arial' : $fname;
                    $ln = $n + 1 === count($cols) ? 1 : 0;

                    $this->putCell($width, $h, ($value), array('border' => $border, 'ln' => $ln, 'align' => 'C', 'fname' => $fname, 'fstyle' => $fstyle, 'fsize' => $fsize));
                    $n++;
                }
                $r++;
            }
            $this->Ln(1);
        } else {
            $this->Cell(0, 10, 'No data Given ', 0, 1, 'C');
        }
    }

    function graph($data = array()) {
        $this->SetXY($this->reportFrameLeftX, $this->graphFrameTopY);
        $this->graphPading = 8;
        $this->graphWith = ($this->graphFrameWidth / 2) - 2 * $this->graphPading;
        $this->graphHeight = $this->graphFrameHeight - 2 * $this->graphPading - 5;

        //X-axis
        $this->graphX_axisLeftX = $this->reportFrameLeftX + $this->graphPading + 10;
        $this->graphX_axisY = $this->graphFrameBottomY - $this->graphPading;
        $this->graphX_axislength = $this->graphWith;
        $this->graphX_axisRightX = ($this->w - $this->graphPading - $this->reportFrameLeftX) / 2;

        //Draw X-axis
        $this->Line($this->graphX_axisLeftX, $this->graphX_axisY, $this->graphX_axisRightX, $this->graphX_axisY);

        //Y-axis
        $this->graphY_axisTopY = $this->graphFrameTopY + $this->graphPading;
        $this->graphY_axisBottomY = $this->graphX_axisY;

        //Draw Y-axis
        $this->Line($this->graphX_axisLeftX, $this->graphY_axisTopY - 4, $this->graphX_axisLeftX, $this->graphY_axisBottomY);



        $this->Ln(1);
        $this->putCell($this->graphFrameWidth, 5, 'A Bargraph Showing Student Termly Grades', array('ln' => 1, 'border' => 0, 'align' => 'C', 'fname' => 'Times', 'fstyle' => 'BUI', 'fsize' => 14));
        $this->SetXY($this->graphFrameLeftX, $this->graphFrameBottomY - 10);
        $l = array('E', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A');
        $Y_scale = (($this->graphY_axisBottomY - $this->graphY_axisTopY) / count($l));

        $x = $Y_scale;
        $y = $n = 0;
        foreach ($l as $value) {
            $this->SetFont('Times', 'B', 6);
            $h1 = $Y_scale / 2;
            //Labels
            $this->SetXY($this->graphX_axisLeftX - 6, $this->graphFrameBottomY - 10 - $y - $Y_scale);
            $this->Cell(2, 4, $value, 0, 1);
            //Scale
            $this->SetLineWidth(0.1);
            $this->SetXY($this->graphX_axisLeftX - 2, $this->graphFrameBottomY - 10 - $y - $h1);
            $this->Line($this->graphX_axisLeftX - 2, $this->graphFrameBottomY - 10 - $y - $h1, $this->graphX_axisRightX - 4, $this->graphFrameBottomY - 10 - $y - $h1);
            $this->Cell(2, 4, '', 'T', 1);
            $n++;
            $y += $x;
        }
        //
        $w = (($this->graphX_axisRightX - $this->graphX_axisLeftX - 5) / 13);
        $this->SetXY($this->graphX_axisLeftX, $this->graphY_axisBottomY);
        $ln = $m = 0;
        foreach ($l as $key => $value) {
            $this->SetFont('Times', 'B', 6);
            $ln = $m === count($l) - 1 ? 1 : 0;
            $this->Cell($w, 1, '', 'R', $ln, 'C');
            $m++;
        }
        $dataLabels = array('KCPE' => 1, 'F1T1' => 2, 'F1T2' => 3, 'F1T3' => 4, 'F2T1' => 5, 'F2T2' => 6, 'F2T3' => 7, 'F3T1' => 8, 'F3T2' => 9, 'F3T3' => 10, 'F4T1' => 11, 'F4T2' => 12, 'KCSE' => 13);
        $this->SetX($this->graphX_axisLeftX);
        $ln = $m = 0;
        foreach ($dataLabels as $label => $labelValue) {
            $this->SetFont('Times', 'B', 9);
            $ln = $m === count($dataLabels) - 1 ? 1 : 0;
            $this->Cell($w, 2, $label, 0, $ln, 'C');
            $m++;
        }

        //Dimmensions of the bars

        $this->graphBarWidth = $w;
        $this->graphY_scale = $Y_scale;
        $data = array('kcpe' => 6, 'F1T1' => 5, 'F1T2' => 11, 'F1T3' => 5, 'F2T1' => 8, 'f3t2' => 2, 'F2T2' => 5, 'f2t3' => 3);
        // Drawing Bars
        $counter = 0;
        $x1 = $this->graphX_axisLeftX;

        foreach ($data as $key => $value) {

            $w = $x_factor = 0;

            $h = $this->graphY_scale * $value;
            $y1 = $this->graphY_axisBottomY - $h;

            if (array_key_exists($key, $dataLabels)):

                $this->myfillcolour = !empty($this->myfillcolour) ? $this->myfillcolour : $this->barFillColour(count($data));

                $c = $this->myfillcolour[$counter];
                $this->SetFillColor($c[0], $c[1], $c[2]);
                $x_factor = $dataLabels[strtoupper($key)] - 1;
                $w = $this->graphBarWidth;
                $x1 = $this->graphX_axisLeftX + $this->graphBarWidth * $x_factor;

                $this->Rect($x1, $y1, $w, $h, 'FD');

            endif;
            $counter++;
        }
    }

    function loadDefaults($default_vars, $input_vars) {
        foreach ($defaults as $key => $default) {
            if (array_key_exists($key, $input_vars)):
                $$key = $input_vars[$key];
            else :
                $$key = $default;
            endif;
        }
    }

    function graphY($topX, $topY, $w, $h, $dependances = array()) {
//defaults
        $defaults = array(
            'xLabels' => array('KCPE' => 1, 'F1T1' => 2, 'F1T2' => 3, 'F1T3' => 4, 'F2T1' => 5, 'F2T2' => 6, 'F2T3' => 7, 'F3T1' => 8, 'F3T2' => 9, 'F3T3' => 10, 'F4T1' => 11, 'F4T2' => 12, 'F4T3' => 13, 'KCSE' => 14),
            'yLabels' => array('E', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A'),
            'data' => array('kcpe' => 6, 'F1T1' => 5, 'F1T2' => 11, 'F1T3' => 5, 'F2T1' => 8, 'f3t2' => 2, 'F2T2' => 5, 'f2t3' => 3),
            'fill' => array(200, 200, 200),
            'font' => array(),
            'title' => 'A Histogram Showing Termly Mean Grades'
        );
//Intials
        //$this->loadDefaults($defaults, $dependances);
        foreach ($defaults as $key => $default) {
            if (array_key_exists($key, $dependances)):
                $$key = $dependances[$key];
            else :
                $$key = $default;
            endif;
        }
        $l = $yLabels;
        $dataLabels = $xLabels;

        // var_dump($dataLabels);
        $default_fonts = array('name' => 'Times', 'style' => 'B', 'size' => 8);
        //$this->initArrayVars($default_font, $font, 'font');

        foreach ($default_fonts as $key => $default) {
            if (array_key_exists($key, $font)):
                $p = 'font_' . $key;
                $$p = $font[$key];
            else :
                $p = 'font_' . $key;
                $$p = $default;
            endif;
        }

        $graphFrameLeftX = $topX;
        $graphFrameTopY = $topY;
        $graphFrameWidth = $w;
        $graphFrameHeight = $h;
        $graphFrameBottomY = $topY + $graphFrameHeight;
        $graphFrameRightX = $graphFrameLeftX + $graphFrameWidth;



        $this->SetXY($graphFrameLeftX, $graphFrameTopY);
        $graphPading = 8;
        $graphWith = $graphFrameWidth - 2 * $graphPading;
        $graphHeight = $graphFrameHeight - 2 * $graphPading - 5;

        //X-axis
        // $graphX_axisLeftX = $graphFrameLeftX + $graphPading + 10;
        $graphX_axisLeftX = $graphFrameLeftX + $graphPading;
        $graphX_axisY = $graphFrameBottomY - $graphPading;
        $graphX_axislength = $graphWith;
        //$graphX_axisRightX = $graphFrameRightX - $graphPading - $graphFrameLeftX;
        $graphX_axisRightX = $graphX_axisLeftX + $graphX_axislength + $graphPading;

        //Draw X-axis
        $this->Line($graphX_axisLeftX, $graphX_axisY, $graphX_axisRightX - $graphPading, $graphX_axisY);

        //Y-axis
        $graphY_axisTopY = $graphFrameTopY + $graphPading;
        $graphY_axisBottomY = $graphX_axisY;

        //Draw Y-axis
        $this->Line($graphX_axisLeftX, $graphY_axisTopY - 4, $graphX_axisLeftX, $graphY_axisBottomY);


        //title
        $this->Ln(1);
        $this->SetXY($graphFrameLeftX, $graphFrameTopY);
        $this->putCell($graphFrameWidth, 5, $title, array('ln' => 1, 'border' => 0, 'align' => 'C', 'fname' => 'Times', 'fstyle' => 'BUI', 'fsize' => $font_size * 1.1));
        $this->SetXY($graphFrameLeftX, $graphFrameBottomY - 10);

        $Y_scale = (($graphY_axisBottomY - $graphY_axisTopY) / count($l));

        $x = $Y_scale;
        $y = $n = 0;

        foreach ($l as $value) {
            $this->SetFont(ucfirst($font_name), $font_style, $font_size * 0.8);
            $h1 = $Y_scale / 2;
            //Labels
            $this->SetXY($graphX_axisLeftX - 6, $graphFrameBottomY - 10 - $y - $Y_scale);
            $this->Cell(2, 4, $value, 0, 1);
            //Scale
            $this->SetLineWidth(0.1);
            $this->SetXY($graphX_axisLeftX - 2, $graphFrameBottomY - 10 - $y - $h1);
            $this->Line($graphX_axisLeftX - 2, $graphFrameBottomY - 10 - $y - $h1, $graphX_axisRightX - $graphPading, $graphFrameBottomY - 10 - $y - $h1);
            $this->Cell(2, 4, '', 'T', 1);
            $n++;
            $y += $x;
        }
        //
        // $w = (($graphX_axisRightX - $graphX_axisLeftX - 5) / count($l));
        //xCalibiration/scales
        $w = (($graphX_axisRightX - $graphX_axisLeftX - $graphPading) / count($dataLabels));
        // $this->SetXY($graphX_axisLeftX, $graphY_axisBottomY);
        $ln = $m = $p = 0;
        foreach ($dataLabels as $key => $value) {
            $this->SetXY($graphX_axisLeftX + $p, $graphY_axisBottomY);
            // $this->SetFont('Times', 'B', 6);
            $ln = $m === count($l) ? 1 : 0;
            $this->Cell($w, 1, '', 'R', $ln, 'C');
            $m++;
            $p += $w;
        }
        //xLabels
        $this->SetX($graphX_axisLeftX);
        $ln = $m = 0;
        foreach ($dataLabels as $label => $labelValue) {
            $this->SetFont(ucfirst($font_name), $font_style, $font_size * 0.8);
            $ln = $m === count($dataLabels) - 1 ? 1 : 0;
            $this->Cell($w, 2, $label, 0, $ln, 'C');
            $m++;
        }

        //Dimmensions of the bars

        $graphBarWidth = $w;
        $graphY_scale = $Y_scale;

        // Drawing Bars
        $counter = 0;
        $x1 = $graphX_axisLeftX;

        foreach ($data as $key => $value) {

            $w = $x_factor = 0;

            $h = $graphY_scale * $value;
            $y1 = $graphY_axisBottomY - $h;
            

            if (array_key_exists($key, $dataLabels) && ( is_numeric($value) && $value > 0)):



                $c = count($data) !== count($this->fillColour) ? array(200, 200, 200) : $this->fillColour[$counter];
//                $c = count($data) !== count($fillColour) ? array(200, 200, 200) : $fillColour[$counter];
                $this->SetFillColor($c[0], $c[1], $c[2]);
                $x_factor = $dataLabels[strtoupper($key)] - 1;
                $w = $graphBarWidth;
                $x1 = $graphX_axisLeftX + $graphBarWidth * $x_factor;
                $bit = 0.2 * $w;
                $this->Rect($x1 + $bit, $y1, $w - $bit * 2, $h, 'FD');

            endif;
            $counter++;
        }
    }

    function barFillColour($noBars = 1) {
        $colors = [];
        for ($n = 0; $n < $noBars; $n++):
            $d = [];
            for ($i = 0; $i < 3; $i++) {
                $d[] = rand(0, 255);
            }
            $colors[] = $d;
        endfor;
        return $colors;
    }

    function initData(Student $student) {
        $this->student = $student;
    }

    function comments() {
        $this->com = new Commentor($this->student);
        $this->SetXY($this->reportFrameLeftX, $this->commentsFrameTopY);
        $w = $this->reportFrameWidth;
        $border = '0';
        $height = 5;
        $trs = array(
            '1' => 'G.O',
            '2' => 'M.A',
            '3' => 'P.S',
            '4' => 'C.L',
        );
        $fname = 'Helvetica'; // $fname = 'Arial';//$fname = 'Courier';

        $class_tr__comments = 'A good student of average ability';
        $princ_comments = 'Can do better, all you need is to put more effort in your academics';

        //$closing_comment='This is a pleasant performance but aim higher because you have a great pontential for success';
        //class teachers comments
        $this->Ln(1);
        $this->cell($w * 0.7);
        $this->putCell($w * 0.3 / 2, $height, "SIGN: ", array('align' => 'C', 'ln' => 1, 'fname' => $fname, 'fstyle' => 'BU', 'fsize' => 9, 'border' => $border));
        //$this->putCell($w * 0.3 / 2, $height, "DATE: ", array('ln' => 1, 'fname' => $fname, 'fstyle' => 'BU', 'fsize' => 9, 'border' => $border));
        $this->Ln(1);
        $this->putCell($w * 0.3 - 5, $height, "CLASS TEACHER'S REMAKRS: ", array('ln' => 1, 'fname' => $fname, 'fstyle' => 'B', 'fsize' => 9, 'border' => $border));
        $this->putCell($w * 0.7, $height, $class_tr__comments, array('ln' => 0, 'align' => 'C', 'fname' => $fname, 'fstyle' => 'U', 'fsize' => 10, 'border' => ''));
        $this->putCell($w * 0.3 / 2, $height, $trs[$this->student->form], array('ln' => 1, 'align' => 'C', 'fname' => $fname, 'fstyle' => 'i', 'fsize' => 9, 'border' => "B"));
        // $this->cell($w * 0.7);
        $this->Ln(2);
        $this->putCell($w * 0.3 - 5, $height, "PRINCIPAL'S REMARKS: ", array('ln' => 1, 'fname' => $fname, 'fstyle' => 'B', 'fsize' => 9, 'border' => $border));
        $this->putCell($w * 0.7, $height, $princ_comments, array('ln' => 0, 'align' => 'C', 'fname' => $fname, 'fstyle' => 'U', 'fsize' => 10, 'border' => ''));
        $this->putCell($w * 0.3 / 2, $height, 'R.K', array('ln' => 1, 'align' => 'C', 'fname' => $fname, 'fstyle' => 'i', 'fsize' => 9, 'border' => "B"));
//        $this->putCell($w * 0.3 / 2, $height, "SIGN: ", array('ln' => 0, 'fname' => $fname, 'fstyle' => 'BU', 'fsize' => 9, 'border' => $border));
//        $this->putCell($w * 0.3 / 2, $height, "DATE: ", array('ln' => 1, 'fname' => $fname, 'fstyle' => 'BU', 'fsize' => 9, 'border' => $border));
//        $this->putCell($w * 0.3 - 5, $height, "PRINCIPAL'S REMARKS : ", array('ln' => 1, 'fname' => $fname, 'fstyle' => 'B', 'fsize' => 9, 'border' => $border));
//        $this->cell($w * 0.7);
//        $this->putCell($w * 0.3 / 2, $height, "SIGN: ", array('ln' => 0, 'fname' => $fname, 'fstyle' => 'BU', 'fsize' => 9, 'border' => $border));
//        $this->putCell($w * 00.3 / 2, $height, "DATE: ", array('ln' => 1, 'fname' => $fname, 'fstyle' => 'BU', 'fsize' => 9, 'border' => $border));

        $this->Ln(5);
        $this->Cell($w * 0.25);
        $this->putCell($w * 0.5, 20, "School Stamp", array('ln' => 1, 'align' => 'C', 'fname' => $fname, 'fstyle' => 'B', 'fsize' => 9, 'border' => 1));

        $this->Ln(10);
//Closing Comments
        $this->putCell($w * 0.38, $height, "The School has been officially closed today Wednesday, 24/10/2018 and Next Term begins  on 02/01/2019", array('ln' => 0, 'fname' => 'Times', 'fstyle' => '', 'fsize' => 11, 'border' => $border));
        //  $this->Cell($w * 0.19, $height - 1, '', 'B', 0);
        // $this->putCell($w * 0.25, $height, "and Next Term begins  _______________________", array('ln' => 0, 'fname' => 'Times', 'fstyle' => '', 'fsize' => 11, 'border' => $border));
        //$this->Cell($w * 0.15, $height - 1, '', 'B', 1);
    }

    function tableOfCells($w, $h, $data, $style = array(), $align = array(), $Xvalue) {
        $defaults = array();

        $h = 4;
        $this->SetTextColor(0, 0, 0);

        foreach ($colsdata as $row => $cols) {
            $n = 1;
            $fstyle = '';
            $ln = '';
            $fname = 'Times';
            $this->SetX($this->reportFrameLeftX);
            $cols = $this->changeCase($cols, 'sen');
            foreach ($cols as $value) {
                $fstyle = strtolower($row) === 'header' ? 'B' : $fstyle;
                $fname = strtolower($row) === 'header' ? 'arial' : $fname;
                $ln = $n === count($cols) ? 1 : 0;

                $this->putCell($width, $h, ($value), array('ln' => $ln, 'align' => 'C', 'fname' => $fname, 'fstyle' => $fstyle, 'fsize' => 10));
                $n++;
            }
        }
    }

    /*     * *
     * 
     */

    function initArrayVars($default_vars, $input_vars, $var_type = 'local', $phrase = '') {
        $phrase = (!$phrase == '' ) ? $phrase . '_' : '';
        foreach ($default_vars as $key => $default_var) {

            if (array_key_exists($key, $input_vars)):

                if ($var_type !== 'local') {
                    $phrase = $phrase . $key;
                    $this->$phrase = $input_vars[$key];
                    //var_dump($phrase);
                } else {
                    $phrase = $phrase . $key;
                    $$phrase = $input_vars[$key];
                }

            else:
                if ($var_type !== 'local') {
                    $phrase = $phrase . $key;
                    $this->$phrase = $default_var;
                } else {
                    $phrase = $phrase . $key;
                    $$phrase = $default_var;
                    //print_r($$phrase);
                }
            endif;
        }
    }

    function changeCase($str, $case = 'cap') {
        $output = '';
        if (!is_array($str)):
            $options = array('cap' => ucwords($str), 'ucase' => strtoupper($str), 'sen' => ucfirst($str), 'lcase' => strtolower($str));
            $output = $options[$case];
        else:
            $output = $this->changeCaseOfArrayItems($str, $case);
        endif;
        return $output;
    }

    function changeCaseOfArrayItems($str, $case = '') {
        $n = 0;
        $output = array();
        foreach ($str as  $value) {
//            $key = (empty(array_keys($str)) || $key === '' || $key === null) ? $n : $key;
            if (!is_array($value)):
                $options = array('cap' => ucwords($value), 'ucase' => strtoupper($value), 'sen' => ucfirst($value), 'lcase' => strtolower($value));
                $output[] = $options[$case];
            else:
                $output[] = $this->changeCase($value, $case);
            endif;
            $n++;
        }
        return $output;
    }

    function putCell($w = 0, $h = '', $txt = '', $setings = array()) {
        $defaults = array('fname' => 'Arial', 'fstyle' => '', 'fsize' => 12, 'border' => 1, 'align' => '', 'ln' => 1, 'fill' => false);

        foreach ($defaults as $var => $value) {
            if (array_key_exists($var, $setings)):

                $$var = $setings[$var];

            else:
                $$var = $value;
            endif;
        }
        // if (array_key_exists('fname', $setings)) {
        $this->SetFont($fname, $fstyle, $fsize);
        // }
        $this->Cell($w, $h, $txt, $border, $ln, $align, $fill);
    }

}

// Instanciation of inherited class
//$defaults = array(
//    'xLabels' => array('KCPE' => 1, 'F1T1' => 2, 'F1T2' => 3, 'F1T3' => 4, 'F2T1' => 5, 'F2T2' => 6, 'F2T3' => 7, 'F3T1' => 8, 'F3T2' => 9, 'F3T3' => 10, 'F4T1' => 11, 'F4T2' => 12, 'F4T3' => 13, 'KCSE' => 14),
//    'yLabels' => array('E', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A'),
//    'data' => array('kcpe' => 6, 'F1T1' => 5, 'F1T2' => 11, 'F1T3' => 5, 'F2T1' => 8, 'f3t2' => 2, 'F2T2' => 5, 'f2t3' => 3),
//    'fill' => array(200, 200, 200),
//    'font' => array()
//);
//
//$pdf->initArrayVars($defaults, array());
//
//print_r($xLabels);
//$n = 0;
//$data = array(
//    //array('name' => 'patience kenga', 'adm' => '4171', 'year' => 2010, 'stream' => 's', 'form' => 4),
//    array('name' => 'mwatamaa salim mwagamboga', 'adm' => '448', 'year' => 2018, 'stream' => '', 'form' => 2),
//    array('name' => 'mangale abdalla mwero', 'stream' => '', 'form' => 2)
//);
//$marks = array(
//    array('eng' => array(20, 45, 90), 'kis' => array(50, 90, 78), 'mat' => array(50, 62, 79), 'bio' => array(20, 30, 50), 'chem' => array(30, 80, 30), 'phy' => array(19, 30, 60), 'geo' => array(30, 30, 30), 'his' => array(30, 30, 30), 're' => array(30, 30, 30), 'b/st' => array(15, 30, 46), 'agr' => array(90, 19, 76))
//    , array('eng' => array(15, 58, 75), 'kis' => array(60, 70, 38), 'mat' => array(50, 62, 79), 'bio' => array(20, 30, 50), 'chem' => array(60, 30, 70), 'phy' => array(19, 30, 60), 'geo' => array(30, 30, 30), 'his' => array(30, 30, 30), 're' => array(30, 30, 30), 'b/st' => array(15, 30, 46), 'agr' => array(90, 19, 76))
//    , array('eng' => array(36, 69, 12), 'kis' => array(40, 50, 88), 'mat' => array(50, 62, 79), 'bio' => array(20, 30, 50), 'chem' => array(50, 30, 90), 'phy' => array(19, 30, 60), 'geo' => array(30, 30, 30), 'his' => array(30, 30, 30), 're' => array(30, 30, 30), 'b/st' => array(15, 30, 46), 'agr' => array(90, 19, 76))
//);


$p = json_decode(file_get_contents("php://input"), true);

//$p = json_decode(file_get_contents("php://input"), true);

$p1 = (empty($p) || is_null($p)) ? $_REQUEST : $p;
$data1 = json_decode($p1['data'], true);

$post= is_array($p1)?$p1:[];

//
if (!empty($post)):

/* * **************************************************************************************************** */
$keys = array_keys($post);
//initialization
//Getting request string
$req = in_array('request', $keys) ? $post['request'] : '';

//getting table string
$table = in_array('table', $keys) ? $post['table'] : '';

//getting table string
$table_short = rtrim(in_array('table', $keys) ? $post['table'] : '', 's');

//getting data to be inserted
$data1 = in_array('data', $keys) ? $post['data'] : array();
$data = is_array($data1)? $data1 :(is_string($data1)?json_decode($data1,true): array());

//getting row id if exits
$id = array_key_exists("{$table_short}Id", $data) && !empty($data) ? $data[$table_short . 'Id'] : (in_array('id', $keys) ? $post['id'] : '');

//getting row id if exits
$form = array_key_exists("form", $data) && !empty($data) ? $data['form'] : (in_array('form', $keys) ? $post['form'] : 1);

//    $id = in_array('id', $keys) ? $post['id'] :'';
//    $id1 = array_key_exists("{$table_short}Id", $data)? $data[$table_short.'Id']:'';
//getting the condition , where
$where = '' !== $id ? array(rtrim($table, 's') . 'Id' => $id) : array();

endif;

/* * **************************************************************************************************** */

$pdf = new PDF(
        array(
    // 'school' => array(
    'name' => 'tsagwa', 'tel' => '0714-050682', 'level' => 'secondary', 'box' => '236 - 80105, kaloleni', 'motto' => 'Success By Effort'
    // )
    ,
    'logo' => array('images/tsagwa_logo.png')
        )
);

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
//    [
//        'adm' => '515',
//        'name' => 'raphael mkare',
//        'gen' => 'm',
//        'form' => '1',
//        'rank' => '',
//        'marks' => [
//            'mat' => [47, 38],
//            'eng' => [41, 73],
//            'kis' => [64, 38],
//            'bio' => [46, 62],
//            'che' => [30, 30],
//            'phy' => [20, 27],
//            'geo' => [4, 13],
//            'his' => [35, 27],
//            'bst' => [38, 20],
//            'cre' => [29, 27],
//            'agr' => [50, 53]
//        ]
//    ],
//    [
//        'adm' => '488',
//        'name' => 'eunice everton',
//        'gen' => 'f',
//        'form' => '1',
//        'kcpe' => '247',
//        'rank' => '',
//        'marks' => [
//            'mat' => [54, 62],
//            'eng' => [53, 67],
//            'kis' => [73, 72],
//            'bio' => [75, 100],
//            'che' => [40, 45],
//            'phy' => [43, 38],
//            'geo' => [52, 67],
//            'his' => [38, 50],
//            'bst' => [72, 59],
//            'cre' => [61, 33],
//            'agr' => [38, 80]
//        ]
//    ],
//    ,
//    [
//        'adm' => '499',
//        'name' => 'judith chirongo',
//        'gen' => 'f',
//        'form' => '1',
//        'kcpe' => '210',
//        'rank' => '',
//        'marks' => [
//            'mat' => [30, 38],
//            'eng' => [37, 57],
//            'kis' => [47, 68],
//            'bio' => [57, 77],
//            'che' => [40, 27],
//            'phy' => [17, 37],
//            'geo' => [50, 37],
//            'his' => [35, 53],
//            'bst' => [48, 48],
//            'cre' => [27, 33],
//            'agr' => [54, 77]
//        ]
//    ],
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
//    [
//        'adm' => '526',
//        'name' => 'elias nguma',
//        'gen' => 'm',
//        'form' => '1',
//        'kcpe' => '191',
//        'rank' => '',
//        'marks' => [
//            'mat' => [30, 22],
//            'eng' => [53, 70],
//            'kis' => [84, 60],
//            'bio' => [75, 86],
//            'che' => [30, 62],
//            'phy' => [23, 30],
//            'geo' => [36, 33],
//            'his' => [30, 30],
//            'bst' => [52, 64],
//            'cre' => [64, 37],
//            'agr' => [63, 87]
//        ]
//    ],
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
//    [
//        'adm' => '544',
//        'name' => 'mercy charo',
//        'gen' => 'f',
//        'kcpe' => '206',
//        'form' => '1',
//        'rank' => '',
//        'marks' => [
//            'mat' => [50, 29],
//            'eng' => [47, 63],
//            'kis' => [64, 68],
//            'bio' => [73, 94],
//            'che' => [90, 32],
//            'phy' => [37, 42],
//            'geo' => [30, 27],
//            'his' => [43, 43],
//            'bst' => [43, 39],
//            'cre' => [29, 50],
//            'agr' => [56, 77]
//        ]
//    ],
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
for ($n = 0; $n < count($d); $n++) {
    $pdf->AddPage();
//        define("FORM_DATA", $d);
    $stdnt = new Student($d, $d[$n], $n);


//       if (count($stdnt->marks) >= 7 && !in_array($stdnt->adm, $created)) {
//            $created[] = $stdnt->adm;
    $pdf->initData($stdnt);
    $pdf->studentDetails($data[$n]);
    $pdf->pageContent();
    $pdf->comments();
//        }
//    }
}
//    $pdf->Output('f', 'report.pdf');
//    $pdf->Output('f', 'report_'.date('Y_m_d_H_i_s').'.pdf');
$pdf->Output();
//   $s=  $pdf->Output('s');
//   $handle= fopen('file.pdf','a+');
//   if($handle){
//       file_put_contents('file.pdf', $s);
//   }
     


