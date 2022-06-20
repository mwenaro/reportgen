
<form   ng-submit="updateFormData(form)"  >
    
    <h3 class="center">Edit Student Info {{edit.data.first_name}}</h3>
    <p>
        <label>First Name :</label>
        <input type="text" class="w3-input"  value="{{edit.data.first_name}}" required ng-model="form.data.first_name"></p>
<p>
    <label>Middle Name :</label>
    <!--<input type="text" class="w3-input" name="middle_name" id="mname" value="{{edit.data.middle_name}}"   required ng-model="form.data.middle_name">-->
    <input type="text" class="w3-input" name="middle_name" id="mname" value="mwero"    ng-model="form.data.middle_name">
</p>
<p>
    <label>Surname:</label>
    <input type="text" class="w3-input" name="last_name" id="lname" value="{{edit.data.last_name}}" required ng-model="form.data.last_name">{{edit.data.last_name}}
</p>

<p>
    <label>Gender</label><br>
<input type="radio" name="gen" value="f" ng-model="form.data.gen"> <span>Female</span>
<input type="radio" name="gen" value="m" ng-model="form.data.gen"> <span>Male</span>
<!--<select name="gen" class="w3-select " required ng-model="form.data.gen">
    <option >--Select--</option>
    <option value="m"> Male</option>
    <option value="f">Female</option>
</select><br-->
</p>
<p>
    <label>Date of Birth</label>
    <input type="date" name="dob" id="dob" required ng-model="form.data.dob" >
</p>
<p>
    
    <input type="text"  class="w3-input" name="residence" id="residence"  placeholder="Residence" required ng-model="form.data.residence">
</p>
<p>
<!--<label>Student Form</label>-->
 <label>Religion</label>
<select required name="religion" class="w3-select" ng-model="form.data.religion">
    <option >--Select Your Religion --</option>
    <option value="c">Christianity</option>
    <option value="i">Islam</option>
    </select>

</p>
<p> <label>Form</label>
    <select required name="formId" class="w3-select" ng-model="form.data.formId">
    <option >--Select Form --</option>
    <option value="1">Form 1</option>
    <option value="2">Form 2</option>
    <option value="3">Form 3</option>
    <option value="4">Form 4</option>
</select>

</p>
<p>
<input type="number" min="1" class="w3-input" name="admNo" id="lname"  placeholder="ADM NO" required ng-model="form.data.admNo">

</p>


</form>