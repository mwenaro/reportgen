<?php
$m = isset($_GET['msg']) ? $_GET['msg'] : '';
$msg = isset($this->msg) ? $this->msg : $m;
?>





<form action="<?php echo URL . 'teacher/addTeacher';?>" method="post"  class="w3-form w3-card-4 ">
    <fieldset w3-container>
       
        <caption class="w3-legend">Add Teacher</caption>
              <!--    <label>First Name</label>-->

        <input required type="text" class="w3-input" name='fName' placeholder="Fist Name" ><br>

        <!--        <label>Middle Name</label>-->
        <input required type="text" class="w3-input" name="mName" id="mname" placeholder="Middle Name"><br>

        <!--        <label>Last  Name</label>-->
        <input required type="text" class="w3-input" name="lName" id="lname" placeholder="Last Name"><br>

        <label>Gender</label>
        <select name="sex" class="w3-select">
            <option >--Select--</option>
            <option value="m"> Male</option>
            <option value="f">Female</option>
        </select><br>

        <!--        <label>ID Number</label>-->
        <input class="w3-input" required type="number" name="idNo" id="idno" placeholder="ID Number"><br><br>

        <input class="w3-input" required type="number" name="phone" id="phone" placeholder="Telephone Number"><br>

        <label>Marital Status</label>
        <select name="marital" class="w3-select">
            <option >--Select--</option>
            <option value="m"> Maried</option>
            <option value="s">Single</option>
        </select><br>

        <label>Date of Birth</label>
        <input class="w3-input" required type="date" name="dob" id="dob"><br>

        <label>Teacher Type</label>
        <select name="type" class="w3-select" required>
            <option >--Select--</option>
            <option value="bom"> BOM</option>
            <option value="tsc">TSC</option>
            <option value="tp">Teaching Practice</option>
        </select><br>

        <!--        <label>Teaching Subjects</label>
                <select name="subjects"  class="w3-select">
                    <option >--Select--</option>
                    <option value="bio">biology</option>
                    <option value="che">chemistry</option>
                    <option value="mat">mathematics</option>
                    <option value="phy">physics</option>
                    <option value="cre">cre</option>
                    <option value="ire">ire</option>
                </select><br>-->

        <button class="w3-btn w3-red" required type="submit">Add Teacher</button>
        <br>

        <p style= "color:green;background:inherit" > <?php echo $msg; ?></p>
    </fieldset>
</form>

<?php if ($this->teachers) { ?>
    <table class="w3-table-all">
        <thead>
            <tr>
                <th style="display: none">id</th>
                <th>ID No</th>
                <th>First Name</th>
                <th>Surname</th>
                <th>Other Name</th>
                <th>Gender</th>
                <th>Type</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($this->teachers as $teacher) { ?>
                <tr>
                    <td style="display: none"><?php echo $teacher['teacherId']; ?></td>
                    <td><?php echo $teacher['idNo']; ?></td>
                    <td><?php echo $teacher['fName']; ?></td>
                    <td><?php echo $teacher['lName']; ?></td>
                    <td><?php echo $teacher['mName']; ?></td>
                    <td><?php echo $teacher['sex']; ?></td>
                    <td><?php echo $teacher['type']; ?></td>

                    <td style="margin-left: 140px;"><a href="<?php echo URL . "teacher/edditTeacher?teacherId={$teacher['teacherId']}"; ?>">Eddit</a></td>
                    <td><a href="<?php echo URL . "teacher/deleteTeacher?teacherId={$teacher['teacherId']}"; ?>">Delete</a></td>
                </tr>
            <?php } ?>
        </tbody>
    </table>
    <?php
} else {
    echo '<h3>No Teacher Found</h3>';
}


