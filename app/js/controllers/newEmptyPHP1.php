<?php

(8, 41),
 (8, 42),
 (8, 43),
 (8, 44),
 (8, 45),
 (8, 46),
 (8, 47),
 (8, 48),
 (8, 49),
 (8, 50),
 case WHEN ROUND(AVG(points), 0) == 12 THEN 'A'
WHEN ROUND(AVG(points), 0) >= '11.0 then  'A-' 
                 WHEN ROUND(AVG(points),0) ==10.0 then  'B+' 
                WHEN ROUND(AVG(points),0) ==9.0 then  'B' 
                WHEN ROUND(AVG(points),0)  ==8.0 then  'B-' 
                WHEN ROUND(AVG(points),0) ==7.0 then  'C+' 
                WHEN ROUND(AVG(points),0) ==6.0 then  'C' 
                WHEN ROUND(AVG(points),0) ==5.0 then  'C-' 
                WHEN ROUND(AVG(points),0) ==4.0 then  'D+' 
                WHEN ROUND(AVG(points),0) ==3.0 then  'D' 
                WHEN ROUND(AVG(points),0) ==2.0 then  'D-' 
                WHEN ROUND(AVG(points),0) ==1.0  then 'E' 
                END as mg
				