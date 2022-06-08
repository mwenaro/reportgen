<?php
$msg = isset($_GET['msg']) ? $_GET['msg'] : '';
?>
<div class="w3-responsive" ng-controller="dataController">
    <form action="<?php echo URL . 'mark/addMark'; ?>" method="post"  ng-init="getData('request=SELECT examId,examType,year, examName FROM exams  WHERE examType=\'o\' ORDER BY year $SELECT examId,examType,year, examName FROM exams WHERE examType=\'m\' ORDER BY year $SELECT examId,examType,year, examName FROM exams WHERE examType=\'e\' ORDER BY year $SELECT fName,lName,formId, admNo,studentId FROM students$SELECT subjectId,subjectName FROM subjects$SELECT form From forms$SELECT courseId,courseName,form FROM courses');form1 =false">
        <table class="w3-table-all w3-responsive " id="tbl-head">

            <thead>
                <tr id="txt-center">
                    <th colspan="6">Chhose Oppener Mid term  Exam </th>
                </tr>
            </thead>
            <tbody>
                <tr id="txt-center">
                    <td class="">Opener</td>
                    <td>Mid Term</td>
                    <td>End Term</td>
                    <td class="">Subject & Form</td>

                </tr>
                <tr class="" id="txt-center">

                    <td >
                        <select required  name="data[examId][o]">
                            <option value="">--Choose Opener Exam--</option>
                            <option ng-repeat="exam in data.q1" value="{{exam.examId}}">{{exam.examName}}</option>

                        </select>
                        <p> <input placeholder="Out of" type="number" min="0" max="100" name="data[outof][o]" required ng-model="maxo"></p>
                    </td>
                    <td>
                        <select required  name="data[examId][m]">
                            <option value="">--Choose Mid Term Exam--</option>

                            <option ng-repeat="exam in data.q2" value="{{exam.examId}}">{{exam.examName}}</option>
                        </select>
                        <p><input placeholder="Out of" type="number" min="0" max="100" name="data[outof][m]" required ng-model="maxm"></p>
                    </td>
                    <td>
                        <select required  name="data[examId][e]">
                            <option value="">--Choose End Term Exam--</option>

                            <option ng-repeat="exam in data.q3" value="{{exam.examId}}">{{exam.examName}}</option>

                        </select>
                        <p> <input placeholder="Out of" type="number" min="0" max="100" name="data[outof][e]" required  ng-model="maxe"></p>
                    </td>

                    <td >
                        <select required  name="data[courseId]">
                            <option value="">--Choose Course--</option>
                            <!--                            <option ng-repeat="subject in data.q5" value="{{subject.subjectId}}">{{subject.subjectName}}</option>-->
                            <option ng-repeat="course in data.q7" value="{{course.courseId}}">{{course.courseName}}</option>

                        </select>
                        <p>
                            <select ng-model="form1" required  name="data[form]"   >
                                <option value="0">--Choose Form--</option>
                                <option ng-repeat="form in data.q6"  value="{{form.form}}">Form {{form.form}}</option>

                            </select>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class=" w3-table-all w3-responsive" id="disgo1" ng-show="!form1 ===false">
            <thead>
                <tr id="txt-center">
                    <th>#</th>
                    <th>Form</th>
                    <th>ADM NO</th>
                    <th colspan="2">Student Name</th>
                    <th id="marks">Opener</th>
                    <th id="marks">Mid Term</th>
                    <th id="marks">End Term</th>
                    <th colspan="2">Task</th>
                </tr>
            </thead>
            <tbody >
                <tr ng-repeat="student in data.q4|orderBy:'formId'|filter:{'formId':form1}" id="txt-center">            
            <input type="hidden" name="data[studentId][]" value="{{student.studentId}}"> 
            <td>{{$index + 1}}</td>
            <td><input type="hidden" name="data[form][]" value="{{student.formId}}">{{student.formId}}</td>
            <td >{{student.admNo}}  <input type="hidden" name="data[admNo][]" value="{{student.admNo}}" ></td>
            <td colspan="2" style="text-align:left">{{student.fName|uppercase}} {{student.lName|uppercase}}</td>
            <td id="marks"> <input  min="0" max="{{maxo}}" type="number" name="data[mark][o][]"></td>
            <td id="marks">  <input  min="0" max="{{maxm}}"  type="number" name="data[mark][m][]"></td>
            <td id="marks">  <input  min="0" max="{{maxe}}"  type="number" name="data[mark][e][]"></td>
            <td>Eddit</td>
            <td>Delete</td>
            </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="10" ><button class="w3-btn w3-xlarge w3-round" type="submit" id="btn-submit" style="float: right">Submit</button><span style="display: none;clear: all"></span></td>
                </tr>
            </tfoot>
        </table>
        <?php if (!empty($msg)): ?>
        <p class="w3-green"><?php echo $msg; ?></p>
        <?php endif; ?>
        <?php $ngdata="".
        '{{data}}'
        . "";
        $ngdata= json_decode($ngdata);
echo '<pre>';
var_dump($ngdata);
        ?>
    </form>

</div>
