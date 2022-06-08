<?php 
if($this->stdnts){?>
<table>
    <th>
    <tr>
        <td style="display: none">id</td>
        <td>Adm No</td>
        <td>First Name</td>
        <td>Surname</td>
        <td>Other Name</td>
        <td>Form</td>
        <td>Gender</td>        
    </tr>
    </th>
    <tbody>
   <?php foreach ($this->stdnts as $student) {?>
        <tr>
        <td style="display: none"><?php echo $student['studentId'];?></td>
        <td><?php echo $student['admNo'];?></td>
        <td><?php echo $student['fName'];?></td>
        <td><?php echo $student['lName'];?></td>
        <td><?php echo $student['mName'];?></td>
        <td><?php echo $student['formId'];?></td>
        <td><?php echo $student['sex'];?></td>
    </tr>
   <?php } ?>
    </tbody>
</table>
 <?php }else {echo '<h3>No Student Found</h3>';    
}