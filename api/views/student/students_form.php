<p><input type="text" class="w3-input" name='first_name' placeholder="First Name" required ng-model="form.first_name"></p>
<p>
    <input type="text" class="w3-input" name="middle_name" id="mname"  placeholder="Middle Name" required ng-model="form.middle_name">
</p>
<p>
    <input type="text" class="w3-input" name="last_name" id="lname"  placeholder="Last Name" required ng-model="form.last_name">
</p>

<p>
<label>Gender</label>
<select name="gen" class="w3-select " required ng-model="form.gen">
    <option >--Select--</option>
    <option value="m"> Male</option>
    <option value="f">Female</option>
</select><br
</p>
<p>
    <label>Date of Birth</label>
    <input type="date" name="dob" id="dob" required ng-model="form.dob">
</p>
<p>
    <input type="text"  class="w3-input" name="residence" id="residence"  placeholder="Residence" required ng-model="form.residence">
</p>
<p>
<!--<label>Student Form</label>-->
<select required name="religion" class="w3-select" ng-model="form.religion">
    <option >--Select Your Religion --</option>
    <option value="c">Christianity</option>
    <option value="i">Islam</option>
    </select>

</p>
<p>
    <select required name="formId" class="w3-select" ng-model="form.form">
    <option >--Select Form --</option>
    <option value="1">Form 1</option>
    <option value="2">Form 2</option>
    <option value="3">Form 3</option>
    <option value="4">Form 4</option>
</select>

</p>
<p>
<input type="number" min="1" class="w3-input" name="admNo" id="lname"  placeholder="ADM NO" required ng-model="form.adm">

</p>