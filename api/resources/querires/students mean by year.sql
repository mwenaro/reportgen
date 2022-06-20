SELECT DISTINCT adm,name,form,year,SUM(score) AS tMarks,COUNT(sub) AS subjects,SUM(points) AS total_points ,ROUND(AVG(points),3) AS mp FROM(
SELECT DISTINCT students.adm, students.gen, exams.type AS exam_type,exams.term,exams.year,exams.examId, students.name, oppener.kcpe, students.form, subjects.short_name as sub, students.adm, COUNT(exams.examId) as exams, (marks.score*100/tests.max_score) as score
, case WHEN round(marks.score*100/tests.max_score) >= 80 then 'A' WHEN round(marks.score*100/tests.max_score) >= 75 AND round(marks.score*100/tests.max_score) < 80 then 'A-'
WHEN round(marks.score*100/tests.max_score) >= 70 AND round(marks.score*100/tests.max_score) < 75 then 'B+' 
WHEN round(marks.score*100/tests.max_score) >= 65 AND round(marks.score*100/tests.max_score) < 70 then 'B' 
WHEN round(marks.score*100/tests.max_score) >= 60 AND round(marks.score*100/tests.max_score) < 65 then 'B-' 
WHEN round(marks.score*100/tests.max_score) >= 55 AND round(marks.score*100/tests.max_score) < 60 then 'C+'
WHEN round(marks.score*100/tests.max_score) >= 50 AND round(marks.score*100/tests.max_score) < 55 then 'C' 
WHEN round(marks.score*100/tests.max_score) >= 45 AND round(marks.score*100/tests.max_score) < 50 then 'C-' 
WHEN round(marks.score*100/tests.max_score) >= 40 AND round(marks.score*100/tests.max_score) < 45 then 'D+' 
WHEN round(marks.score*100/tests.max_score) >= 35 AND round(marks.score*100/tests.max_score) < 40 then 'D' 
WHEN round(marks.score*100/tests.max_score) >= 30 AND round(marks.score*100/tests.max_score) < 35 then 'D-' 
WHEN round(marks.score*100/tests.max_score) < 30 then 'E' 
END as grade, 
case WHEN round(marks.score*100/tests.max_score) >= 80 then '12'
WHEN round(marks.score*100/tests.max_score) >= 75 AND round(marks.score*100/tests.max_score) < 80 then '11' 
WHEN round(marks.score*100/tests.max_score) >= 70 AND round(marks.score*100/tests.max_score) < 75 then '10' 
WHEN round(marks.score*100/tests.max_score) >= 65 AND round(marks.score*100/tests.max_score) < 70 then '9' 
WHEN round(marks.score*100/tests.max_score) >= 60 AND round(marks.score*100/tests.max_score) < 65 then '8' 
WHEN round(marks.score*100/tests.max_score) >= 55 AND round(marks.score*100/tests.max_score) < 60 then '7' 
WHEN round(marks.score*100/tests.max_score) >= 50 AND round(marks.score*100/tests.max_score) < 55 then '6' 
WHEN round(marks.score*100/tests.max_score) >= 45 AND round(marks.score*100/tests.max_score) < 50 then '5'
WHEN round(marks.score*100/tests.max_score) >= 40 AND round(marks.score*100/tests.max_score) < 45 then '4'
WHEN round(marks.score*100/tests.max_score) >= 35 AND round(marks.score*100/tests.max_score) < 40 then '3' 
WHEN round(marks.score*100/tests.max_score) >= 30 AND round(marks.score*100/tests.max_score) <35 then '2' 
WHEN round(marks.score*100/tests.max_score) <30 then '1' END as points, 
(SELECT COUNT( DISTINCT e1.examId) FROM exams e1
		JOIN marks m ON e1.examId = m.examId 
		JOIN students s ON m.studentId = s.studentId
		WHERE m.studentId = students.studentId
		GROUP BY s.studentId ) no_exam, ( SELECT
CASE WHEN s.form < '2' THEN round(sum(m.score)/(11*COUNT( DISTINCT e.examId))) 
WHEN s.form> '1' AND count(m.score) >= 7*COUNT( DISTINCT e.examId) THEN round(avg(m.score))
WHEN s.form > '1' AND count(m.score) <7*COUNT( DISTINCT e.examId) THEN round(sum(m.score)/(8*COUNT(DISTINCT e.examId))) 
END FROM marks m 
JOIN students s ON m.studentId = s.studentId 
JOIN exams e ON m.examId = e.examId 
WHERE s.studentId = students.studentId 
GROUP BY s.studentId ) mean FROM marks
JOIN students ON marks.studentId = students.studentId
JOIN subjects ON marks.subjectId = subjects.subjectId
JOIN tests ON tests.testId = marks.testId 
JOIN courses ON tests.courseId = courses.courseId 
JOIN exams ON tests.examId = exams.examId
JOIN oppener ON students.adm = oppener.adm 

GROUP BY students.adm, exams.examId, marks.markId
ORDER BY mean DESC, students.adm, sub
) GROUP BY adm,form,year
ORDER BY year,form,mp  DESC