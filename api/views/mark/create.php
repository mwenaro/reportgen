<?php
$pageData = isset($this->pageData) ? $this->pageData['data'] : array();
$m = isset($_GET['msg']) ? $_GET['msg'] : '';
$msg = isset($this->msg) ? $this->msg : $m;
////echo '<pre>';
//$n=0;
//var_dump($pageData['q1']);
////var_dump($pageData);
////foreach ($pageData as $key => $value) {
////    var_dump($value);
////   // echo '<h2>From Array No'.$key.'</h2>';
////  //  $n++;
////}
//////echo '</pre>';
?>



<div class="" ng-controller="dataController" ng-init="getData('request=SELECT examId,examType,year, examName FROM exams ORDER BY year$SELECT fName,lName, admNo,studentId FROM students')">
    <form action="<?php echo URL . 'course/manageCourse'; ?>" method="post"  >
        <table class="w3-table-all">
            <thead>
                <tr>
                    <th colspan="6">Chhose Oppener Mid term & Exam </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Opener</td>
                    <td>Mid Term</td>
                    <td>End Term</td>
                </tr>
                <tr >
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <select required  name="data[exam][]">
                            <option value="">Choose Opener Exam</option>
                            <?php if ($pageData['q1']): foreach ($pageData['q1']as $opener): ?>
                                    <option  value="<?php echo $opener['examId']; ?>"><?php echo $opener['examName']; ?></option>
                                <?php endforeach;
                            endif; ?>
                        </select>
                    </td>
                    <td>
                        <select required  name="data[exam][]">
                            <option value="">Choose Mid Term Exam</option>

                         <?php if ($pageData['q2']): foreach ($pageData['q2']as $opener): ?>
                                    <option  value="<?php echo $opener['examId']; ?>"><?php echo $opener['examName']; ?></option>
                                <?php endforeach;
                            endif; ?>
                        </select>
                    </td>
                    <td>
                        <select required  name="data[exam][]">
                            <option value="">Choose End Term Exam</option>

                             <?php if ($pageData['q3']): foreach ($pageData['q3']as $opener): ?>
                                    <option  value="<?php echo $opener['examId']; ?>"><?php echo $opener['examName']; ?></option>
                                <?php endforeach;
                            endif; ?>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="">
            <thead>
                <tr>
                    <th style="display: none;">id</th>
<!--                        <th style="display: none;">Form</th>-->
                    <th>#</th>
                    <th>ADM NO</th>
                    <th>Student Name</th>
                    <th>Opener</th>
                    <th>Mid Term</th>
                    <th>End Term</th>
                    <th colspan="2">Task</th>
                </tr>
            </thead>
            <tbody>

                <tr ng-repeat="student in data.q2" class="marks">
                    <td><input type="hidden" name="data[id][]" value="{{student.studentId}}">  </td>   
                    <td><label></label>{{student.admNo}}  <input type="hidden" name="data[admNo][]"> </td>
                    <td><label>{{student.fName}} {{student.lName}}</label></td>
                    <td><label></label>  <input type="number" name="data[opener][]"></td>
                    <td><label></label>  <input type="number" name="data[mid][]"></td>
                    <td><label></label>  <input type="number" name="data[end][]"> </td>
                    <td>Eddit</td>
                    <td>Delete</td>
                </tr>
            </tbody>
        </table>

        <p>

        </p>
        <p><button type="submit">Submit</button></p>
    </form>

</div>