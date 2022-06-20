<?php
$m = isset($_GET['msg']) ? $_GET['msg'] : '';
$msg = isset($this->msg) ? $this->msg : $m;
$pageData = $this->pageData['flag'] ? $this->pageData ['data'] : array('data' => array());
?>

<form action="<?php echo URL . 'exam/addExam'; ?>" method="post"  class="w3-form w3-card-4 ">
    <fieldset w3-container>

        <h2>Create Exam</h2><br><br>
        <table class="w3-table-all">
            <tr class="">

                <td>
                    <span class="" style="font-weight: bold ;width:100px;"> Exam Type: </span> 
                </td>
                <td>
                    <input type="radio" class="w3-radio" required value="o" name="examType"> Opener </td>
                <td>
                    <input type="radio" class="w3-radio" required value="m" name="examType"> Mid Term
                </td>
                <td>
                    <input type="radio" class="w3-radio" required value="m" name="examType"> End Term 
                </td>

            </tr>

            <tr>
                <td>   <p>  <span style="font-weight: bold ;width:100px;">Term: </span></td>

                <td> <input type="radio" class="w3-radio" name="term" required value="1" > 1 </td>

                <td> <input type="radio" class="w3-radio" name="term" required value="2">2 </td>

                <td> <input type="radio" class="w3-radio" name="term" required value="3">  3 </td>
                
            </tr>
            <tr>
           
                <td>  <span style="font-weight: bold ;width:100px;">Year: </span>   </td>
                <td colspan="3">
                    <select name="year" class="w3-select" required>
                        <option value="">---select Year --</option>
                        <?php
                        $n = 10;
                        while (--$n > 0): $v = date('Y') - 5 + $n;
                            ?>   
                            <option  value="<?php echo $v; ?>"><?php echo $v; ?></option>
                        <?php endwhile; ?>

                </td>
            
            </tr>
            <tr><td colspan="3">
            <div>
                <button class="w3-btn w3-red" required type="submit">Create Exam</button>
                </div>
                </td>
                <td>
                  <p style= "color:green;background:inherit" > <?php echo $msg; ?></p>  
                </td>
            </tr>
        </table>
      
       
    </fieldset>
</form><br>

<table class="w3-table-all w3-card-2 ">
        <thead>
            <tr>
                <th style="display: none">id</th>
                <th>#</th>
                <th>Exam Name</th>
                <th>Exam Type</th>
                <th>Term</th>
                <th>Year</th>
                
                <th colspan=""></th>

            </tr>
        </thead>
        <tbody>
            <?php   $n=1;  foreach ($pageData as $exam) { ?>
                <tr>
                    <td style="display: none"><?php echo $exam['examId']; ?></td>
                    <td><?php echo $n++; ?></td>
                    <td><?php echo ucwords($exam['examName']); ?></td>
                    <td><?php echo ucwords(rtrim($this->pageData['typeArr'][$exam['examType']],'of')); ?></td>
                    <td><?php echo $exam['term']; ?></td>
                    <td><?php echo $exam['year']; ?></td>
                    

                    <td style="margin-left: 140px;"><a href="<?php echo URL . "exam/edditExam?examId={$exam['examId']}"; ?>">Eddit</a></td>
                    <td><a href="<?php echo URL . "exam/deleteExam?examId={$exam['examId']}"; ?>">Delete</a></td>
                </tr>
            <?php } ?>
    </tbody>
</table>
