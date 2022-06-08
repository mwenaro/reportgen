<?php
require_once 'report/libs/fpdf/fpdf.php';
//require_once 'report/maths.php';
//require_once 'report/insertexceldata.php';
//require_once 'report/commentor.php';


$pdf= new FPDF('P','mm',array(100,150));
$pdf->AddPage();
$pdf->SetFont('arial', '', 20);
$pdf->Cell(100, 8,"HELLO PDF", 1);

$pdf->Output();
