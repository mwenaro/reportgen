<table class="w3-table-all w3-card-2 w3-responsive" >
    <thead>
    <tr>
        <th style="display: none">id</th>
        <th>Adm No</th>
        <th>First Name</th>
        <th>Surname</th>
        <th>Other Name</th>
        <th>Form</th>
        <th>Gender</th>
        <th></th>
        <th></th>
        
    </tr>
    </thead>
    <tbody>
   <?php foreach ($this->stdnts as $student) {?>
        <tr>
        <td style="display: none"><?php echo $student['studentId'];?></td>
        <td><?php echo $student['adm'];?></td>
        <td><?php echo $student['first_name'];?></td>
        <td><?php echo $student['last_name'];?></td>
        <td><?php echo $student['middle_name'];?></td>
        <td><?php echo $student['form'];?></td>
        <td><?php echo $student['gen'];?></td>
        
        <td style="margin-left: 140px;"><a href="<?php echo URL."student/edditStudent?studentId={$student['studentId']}";?>">Eddit</a></td>
        <td><a href="<?php echo URL."student/deleteStudent?studentId={$student['studentId']}";?>">Delete</a></td>
    </tr>
   <?php } ?>
    </tbody>
</table>
