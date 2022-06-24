<?php
$m = isset($_GET['msg']) ? $_GET['msg'] : '';
$msg = isset($this->msg) ? $this->msg : $m;
//$pageData = $this->pageData['flag'] ? $this->pageData ['data'] : array('data' => array());
?>
<div  ng-controller="dataController" ng-init="getData('request=SELECT subjectId,subjectName FROM subjects$SELECT teacherId,fName,lName FROM teachers$SELECT * FROM students ORDER BY admNo$SELECT * FROM courses ORDER BY courseName')">
<form action="<?php echo URL . 'course/addCourse'; ?>" method="post"  class="w3-form w3-card-4 ">
    <fieldset w3-container>

        <h3>Create Course</h3><br><br>
        <table class="w3-table-all">
            <tr>
                <th>Select Subject</th>
                <th>Select Subect Teacher</th>
                <th>select Form</th>

            </tr>
            <tr>
                <td> <select  class="w3-selct" name="subjectId" required  >
                        <option value="">--select Subject--</option>
                        <option ng-repeat="subject in data.q1" value="{{subject.subjectId}}%{{subject.subjectName}}">{{subject.subjectName|uppercase}} </option>
                    </select>
                </td>

                <td> <select  class="w3-selct" name="teacherId" required  >
                        <option value="">--select Teacher--</option>
                        <option value='null'>None</option>
                     <option ng-repeat="teacher in data.q2" value="{{teacher.teacherId}}">{{teacher.fName|uppercase}} {{teacher.lName|uppercase}}</option>
                    </select>
                </td>
               <td>
                    <select name="form" class="w3-select" required ng-model="form">
                        <option value="">---select Form --</option>
                        <?php
                        $n = 0;
                        while ($n++ < 4): $v = $n;
                            ?>   
                            <option  value="<?php echo $v; ?>">Form <?php echo $v; ?></option>
                        <?php endwhile; ?>

                </td>

            </tr>
<!--            <tr><td><input type="hidden" name="courseName" value="{{data.q1.}} Form {{form}}"></td>-->
                <td colspan="2">
                    <div>
                        <button class="w3-btn w3-red" required type="submit">Create Course</button>
                    </div>
                </td>
                
                <td>
                    <p style= "color:green;background:inherit" > <?php echo $msg; ?></p>  
                </td>
            </tr>
        </table>


    </fieldset>
</form><br>

<!--<table class="w3-table-all w3-card-2 ">
    <thead>
        <tr>
            <th style="display: none">id</th>
            <th>#</th>
            <th>Course Name</th>
            <th>Course Type</th>
            <th>Term</th>
            <th>Year</th>

            <th colspan=""></th>

        </tr>
    </thead>
    <tbody>

    </tbody>
</table>-->

<div>
    <table class="w3-table-all">
        <thead>
            <tr>        
                <th>#</th>
                <th>Course Name</th>
                <th>Subject</th>
               

            <tr>
        </thead>
        <tbody>
            <tr ng-repeat="course in data.q4">
                <td >{{$index + 1}}</td>
<!--                <td ng-show="false">{{course.courseId}}</td>-->
                <td >{{course.courseName|uppercase}}</td>
                


            </tr>
        </tbody>
    </table>

</div>


  <?php
 // json_encode(array(q1=SELECT subjectId,subjectName FROM subjects,q2=SELECT teacherId,fName,lName FROM subjects))