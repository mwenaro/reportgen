<!--<form >
    data-ng-submit="updateEntry({'request':'update','table':'students','data':person})"  >

    
    <div class="form-group" data-ng-if="editSubjectActive===true">Student Name:{{person.name}}</div>

    // A hidden filled--
    <p data-ng-if="editSubjectActive===true">  <input type="hidden" value="{{person.studentId}}" name="studentId"/></p>

    <div class="form-group">
        <label>ADM NO</label>
        <p><input type="text" data-ng-if="editSubjectActive===true" disabled class="w3-input" name="adm" id="adm" data-ng-model="person.adm" ></p>
        <p><input type="text" data-ng-if="editSubjectActive===false"  class="w3-input" name="adm" id="adm" data-ng-model="person.adm" ></p>

    </div>
    <div class="form-group">
        <label>First Name :</label>
        <input type="text" class="w3-input"  name="first_name" data-ng-model="person.first_name" required ></div>
    <div class="form-group">
        <label>Middle Name :</label>
        <input type="text" class="w3-input" name="middle_name" id="mname" value="{{person.middle_name}}"   required data-ng-model="form.data.middle_name">
        <input type="text" class="w3-input" name="middle_name" id="mname" data-ng-model="person.middle_name"   >
    </div>
    <div class="form-group">
        <label>Surname:</label>
        <input type="text" class="w3-input" name="last_name" id="lname" data-ng-model="person.last_name" required >
    </div>
    <div class="form-group"> <label>Form</label>
        <select required name="form" class="w3-select" data-ng-model="person.form">
            <option >--Select Form --</option>
            <option value="1">Form 1</option>
            <option value="2">Form 2</option>
            <option value="3">Form 3</option>
            <option value="4">Form 4</option>
        </select>

    </div>

    <div class="form-group">
        <label>Gender</label><br>
        <input type="radio" data-ng-model="person.gen" name="gen" value="f" > <span>Female</span>
        <input type="radio" data-ng-model="person.gen" name="gen" value="m" > <span>Male</span>

    </div>

    <div class="form-group">

        <label>Date of Birth</label>
        <input type="text" name="dob" id="dob" placeholder="yyyy/mm/dd"required data-ng-model="person.dob" > {{person.dob}}
    </div>
    <div class="form-group">

        <input type="text"  class="w3-input" name="residence" id="residence"  placeholder="Residence" required data-ng-model="person.residence">
    </div>
    <div class="form-group">
        <label>Student Form</label>
        <label>Religion</label>
        <select required name="religion" class="w3-select" data-ng-model="person.religion">
            <option >--Select Your Religion --</option>
            <option value="c">Christianity</option>
            <option value="i">Islam</option>
        </select>

    </div>
    <div class="form-group">
        <label>County</label>
        <input type="text"  class="w3-input" name="county" id="county" data-ng-model="person.county" >

    </div>
    <div class="form-group">
        <label>Sub County</label>
        <input type="text"  class="w3-input" name="subcounty" id="subcounty" data-ng-model="person.subcounty" >

    </div>
    <div class="form-group">
        <label>Ward</label>
        <input type="text"  class="w3-input" name="ward" id="ward" data-ng-model="person.ward" >

    </div>

    <div class="form-group">
        <p ng-if="editSubjectActive===false"><button type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Student</button></p>
        <p ng-if="editSubjectActive === true"> <button type="submit" class="btn w3-blue" ><span class="fa fa-user"></span>  Update Info</button></p>
    </div>
    
</form>


-->
