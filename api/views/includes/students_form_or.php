

                
<p><input type="text" class="w3-input" name='first_name' placeholder="First Name" required ng-model="fdata.first_name"></p>
<p>
    <input type="text" class="w3-input" name="middle_name" id="mname"  placeholder="Middle Name" required ng-model="fdata.middle_name">
</p>
<p>
    <input type="text" class="w3-input" name="last_name" id="lname"  placeholder="Last Name" required ng-model="fdata.last_name">
</p>

<p>
<label>Gender</label>
<select name="gen" class="w3-select" required ng-model="fdata.gen">
    <option >--Select--</option>
    <option value="m"> Male</option>
    <option value="f">Female</option>
</select><br
</p>
<p>
    <label>Date of Birth</label>
    <input type="date" name="dob" id="dob" required ng-model="fdata.dob">
</p>
<p>
    
    <input type="text"  class="w3-input" name="residence" id="residence"  placeholder="Residence" required ng-model="fdata.residence">
</p>
<p>
<!--<label>Student Form</label>-->
 <label>Religion</label>
<select required name="religion" class="w3-select" ng-model="fdata.religion">
    <option >--Select Your Religion --</option>
    <option value="c">Christianity</option>
    <option value="i">Islam</option>
    </select>

</p>
<p> <label>Form</label>
    <select required name="form" class="w3-select" ng-model="fdata.form">
    <option >--Select Form --</option>
    <option value="1">Form 1</option>
    <option value="2">Form 2</option>
    <option value="3">Form 3</option>
    <option value="4">Form 4</option>
</select>

</p>
<p>
<input type="number" min="1" class="w3-input" name="adm" id="lname"  placeholder="ADM NO" required ng-model="fdata.adm">

</p>

