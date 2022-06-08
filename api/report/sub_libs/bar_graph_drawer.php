<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of bar_graph_drawer
 *
 * @author marashy
 */
class BarGraphDrawer {

    private $pdf = null;

//    function __construct(PDF $pdf,$topX, $topY, $w, $h, $dependances = array()) {
    function __construct(PDF $pdf) {
        $this->pdf= $pdf;
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
        //$this->pdf->loadDefaults($defaults, $dependances);
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
        //$this->pdf->initArrayVars($default_font, $font, 'font');

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



        $this->pdf->SetXY($graphFrameLeftX, $graphFrameTopY);
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
        $this->pdf->Line($graphX_axisLeftX, $graphX_axisY, $graphX_axisRightX - $graphPading, $graphX_axisY);

        //Y-axis
        $graphY_axisTopY = $graphFrameTopY + $graphPading;
        $graphY_axisBottomY = $graphX_axisY;

        //Draw Y-axis
        $this->pdf->Line($graphX_axisLeftX, $graphY_axisTopY - 4, $graphX_axisLeftX, $graphY_axisBottomY);


        //title
        $this->pdf->Ln(1);
        $this->pdf->SetXY($graphFrameLeftX, $graphFrameTopY);
        $this->pdf->putCell($graphFrameWidth, 5, $title, array('ln' => 1, 'border' => 0, 'align' => 'C', 'fname' => 'Times', 'fstyle' => 'BUI', 'fsize' => $font_size * 1.1));
        $this->pdf->SetXY($graphFrameLeftX, $graphFrameBottomY - 10);

        $Y_scale = (($graphY_axisBottomY - $graphY_axisTopY) / count($l));

        $x = $Y_scale;
        $y = $n = 0;

        foreach ($l as $value) {
            $this->pdf->SetFont(ucfirst($font_name), $font_style, $font_size * 0.8);
            $h1 = $Y_scale / 2;
            //Labels
            $this->pdf->SetXY($graphX_axisLeftX - 6, $graphFrameBottomY - 10 - $y - $Y_scale);
            $this->pdf->Cell(2, 4, $value, 0, 1);
            //Scale
            $this->pdf->SetLineWidth(0.1);
            $this->pdf->SetXY($graphX_axisLeftX - 2, $graphFrameBottomY - 10 - $y - $h1);
            $this->pdf->Line($graphX_axisLeftX - 2, $graphFrameBottomY - 10 - $y - $h1, $graphX_axisRightX - $graphPading, $graphFrameBottomY - 10 - $y - $h1);
            $this->pdf->Cell(2, 4, '', 'T', 1);
            $n++;
            $y += $x;
        }
        //
        // $w = (($graphX_axisRightX - $graphX_axisLeftX - 5) / count($l));
        //xCalibiration/scales
        $w = (($graphX_axisRightX - $graphX_axisLeftX - $graphPading) / count($dataLabels));
        // $this->pdf->SetXY($graphX_axisLeftX, $graphY_axisBottomY);
        $ln = $m = $p = 0;
        foreach ($dataLabels as $key => $value) {
            $this->pdf->SetXY($graphX_axisLeftX + $p, $graphY_axisBottomY);
            // $this->pdf->SetFont('Times', 'B', 6);
            $ln = $m === count($l) ? 1 : 0;
            $this->pdf->Cell($w, 1, '', 'R', $ln, 'C');
            $m++;
            $p += $w;
        }
        //xLabels
        $this->pdf->SetX($graphX_axisLeftX);
        $ln = $m = 0;
        foreach ($dataLabels as $label => $labelValue) {
            $this->pdf->SetFont(ucfirst($font_name), $font_style, $font_size * 0.8);
            $ln = $m === count($dataLabels) - 1 ? 1 : 0;
            $this->pdf->Cell($w, 2, $label, 0, $ln, 'C');
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



                $c = count($data) !== count($this->pdf->fillColour) ? array(200, 200, 200) : $this->pdf->fillColour[$counter];
//                $c = count($data) !== count($fillColour) ? array(200, 200, 200) : $fillColour[$counter];
                $this->pdf->SetFillColor($c[0], $c[1], $c[2]);
                $x_factor = $dataLabels[strtoupper($key)] - 1;
                $w = $graphBarWidth;
                $x1 = $graphX_axisLeftX + $graphBarWidth * $x_factor;
                $bit = 0.2 * $w;
                $this->pdf->Rect($x1 + $bit, $y1, $w - $bit * 2, $h, 'FD');

            endif;
            $counter++;
        }
    }

}
