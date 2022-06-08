<style>
    div.w3-modal{
        position: fixed;
        top:-30px;
    }
</style>
<div class="w3-panel w3-light-grey center" style="height: 50px;text-align: center;line-height: 50px">

    <button onclick="document.getElementById('id01').style.display = 'block'" class="w3-btn w3-green  btn-primary">Login Here</button>
</div>
<div id="id01" class="w3-modal" data-ng-controller="loginController as login" style="display: block;">
    <span onclick="document.getElementById('id01').style.display = 'none'" class="w3-closebtn w3-hover-red w3-container w3-padding-16 w3-display-topright">×</span>
    <div class="w3-modal-content w3-card-8 w3-animate-zoom" style="max-width:600px">
        <form  ng-submit="login.loginUser()">
            <div class="w3-center"><br>
                <span class="fa fa-user w3-xxxlarge"></span>
                <span class="glyphicon glyphicon-log-in w3-xxlarge"></span>
            </div>
            <div style="text-align: center;color:red">
                <p id="login_error_txt">{{login.pwdErrorMsg}}</p>
            </div>
            <div class="w3-container">
                <div class="w3-section">
                    <label><b>Username</b></label>
                    <input autofocus class=" w3-input w3-border w3-margin-bottom" required type="text" ng-model="login.user.username" value="username" placeholder="Enter Username" data-ng-keydown="login.clearPwdError()"
                           ng-unique='{url:"http://127.0.0.1:7173/api/output1.php", property:"phone",table:"teachers",request:"exists"}'
                           >

                    <label class="w3-row"><span class="w3-half"><b>Password</b> </label>
                    <input   class="w3-input w3-border" required type="{{login.pwdType}}" ng-model="login.user.password" name="password" placeholder="Enter Password" data-ng-keydown="login.clearPwdError()">
                    <p style="margin: 5px;">
                                <button class="w3-btn w3-btn-block w3-green " >Login</button>  
                                
                        <span style="" data-ng-click="login.changgePwdType()" class="{{login.pwdClass}} w3-right">  {{login.pwdType=='password'?'Show':'Hide'}} Password</span>
                        <input class="w3-check w3-margin-top" type="checkbox" checked="checked"> Remember me
                    </p>

                </div>
            </div>

            <div class="w3-container w3-border-top w3-padding-16 w3-light-grey">
                <button onclick="document.getElementById('id01').style.display = 'none'" type="button" class="w3-btn w3-red">Cancel</button>
                <p>
                    <button class="w3-btn  w3-yellow " onclick="document.getElementById('id01').style.display = 'none'; document.getElementById('id02').style.display = 'block'">New User? Create Account <a href="">Here</a></button>  
                </p>
                <span class="w3-right w3-padding w3-hide-small">Forgot <a ui-sref="password">password?</a></span>
            </div>
        </form>

    </div>
</div>
<div id="id_ng" class="w3-modal" data-ng-controller="loginController as login" >
    <span onclick="document.getElementById('id01').style.display = 'none'" class="w3-closebtn w3-hover-red w3-container w3-padding-16 w3-display-topright">×</span>
    <div class="w3-modal-content w3-card-8 w3-animate-zoom" style="max-width:600px">
        <form  ng-submit="login.loginUser()">
            <div class="w3-center"><br>
                <span class="fa fa-user w3-xxxlarge"></span>
                <span class="glyphicon glyphicon-log-in w3-xxlarge"></span>
            </div>
            <div style="text-align: center;color:red">
                <p id="login_error_txt">{{login.pwdErrorMsg}}</p>
            </div>
            <div class="w3-container">
                <div class="w3-section">
                    <label><b>Username</b></label>
                    <input autofocus class=" w3-input w3-border w3-margin-bottom" required type="text" ng-model="login.user.username" value="username" placeholder="Enter Username" data-ng-keydown="login.clearPwdError()">

                    <label class="w3-row"><span class="w3-half"><b>Password</b> </label>
                    <input   class="w3-input w3-border" required type="{{login.pwdType}}" ng-model="login.user.password" name="password" placeholder="Enter Password" data-ng-keydown="login.clearPwdError()">
                    <p style="margin: 5px;">
                                <button class="w3-btn w3-btn-block w3-green " >Login</button>  
                                
                        <span style="" data-ng-click="login.changgePwdType()" class="{{login.pwdClass}} w3-right">  {{login.pwdType=='password'?'Show':'Hide'}} Password</span>
                        <input class="w3-check w3-margin-top" type="checkbox" checked="checked"> Remember me
                    </p>

                </div>
            </div>

            <div class="w3-container w3-border-top w3-padding-16 w3-light-grey">
                <button onclick="document.getElementById('id01').style.display = 'none'" type="button" class="w3-btn w3-red">Cancel</button>
                <p>
                    <button class="w3-btn  w3-yellow " onclick="document.getElementById('id01').style.display = 'none'; document.getElementById('id02').style.display = 'block'">New User? Create Account <a href="">Here</a></button>  
                </p>
                <span class="w3-right w3-padding w3-hide-small">Forgot <a ui-sref="password">password?</a></span>
            </div>
        </form>

    </div>
</div>

<div id="id02" class="w3-modal " data-ng-controller="loginController as login" >
    <div class="w3-card-8">
        <span onclick="document.getElementById('id02').style.display = 'none'" class="w3-closebtn w3-hover-red w3-container w3-padding-16 w3-display-topright">×</span>
        <div class="w3-modal-content w3-card-8 w3-animate-zoom" style="max-width:600px">
            <div class="w3-teal panel w3-center" style="margin:0px 0px 3px 0px;" >
                <h5> Welcome Mwalimu, <small class="w3-text-light-grey">Kindly Register to Enjoy Our Services</small></h5>
            </div>
            <div >

                <form    class="w3-form"   name="signupForm">
                    <fieldset class="w3-container" >



                        <!--<p ng-if="editPersonActive === true" ><input type="hidden" value="{{login.person.teacherId}}" name="teacherId"/></p>-->

                        <div class="form-group  row" style="margin-top:2px">
                            <label class='w3-label  col-lg-6 col-md-6'  >Staff Romm Code</label>
                            <!--<p ng-if="editPersonActive === false" class="col-lg-6 col-md-6"><input placeholder="Staff Romm Code" type="numbert" class="w3-input" name="staff_code" id="teacher_code" data-ng-model="login.person.staff_code" required></p>-->
                            <!--<p   class="col-lg-6 col-md-6"><input placeholder="Staff Romm Code" type="text" class="w3-input" name="staff_code" id="teacher_code" data-ng-model="login.person.staff_code" required autofocus="" data-ng-keyup="login.checkItem({request:'get',table:'teachers',where:{'staff_code':login.person.staff_code}})"></p>-->
                            <p   class="col-lg-6 col-md-6"><input placeholder="Staff Romm Code" type="text" class="w3-input" name="staff_code" id="teacher_code" data-ng-model="login.person.staff_code" required autofocus="" data-ng-keyup="login.checkItem({'staff_code':login.person.staff_code}, 'staff_code')" >

                                <!--ng-unique='{url:"http://127.0.0.1:7173/login/exists", property:"staff_code",table:"teachers",request:"exists"}'-->
                            </p>
                            <p  data-ng-show="login.error.staff" class="w3-red w3-small">The Staff Code Already exists in the system</p>
                            <!--<p  data-ng-show="signupForm.first_name.$touched &&signupForm.staff_code.$error.unique " class="w3-red w3-small">The Staff Code Already exists in the system</p>-->
                            <p  data-ng-show="signupForm.staff_code.$error.required" class="w3-red w3-small">The Staff Code Required</p>
                        </div>
                        <div class="form-group row">
                            <label class='w3-label col-lg-6 col-md-6'  >First Name :</label>
                            <input class="col-lg-6 col-md-6"  placeholder="First Name" type="text" class="w3-input"  name="first_name" data-ng-model="login.person.first_name" required >
                            <p  data-ng-show="signupForm.staff_code.$touched && signupForm.first_name.$error.required" class="w3-red w3-small">Enter  First Name</p>
                        </div>


                        <div class="form-group row">
                            <label class='w3-label col-lg-6 col-md-6'  >Last Name:</label>
                            <input class="col-lg-6 col-md-6" placeholder="Last Name" type="text" class="w3-input" name="last_name" id="lname" data-ng-model="login.person.last_name" required >
                        <!--<p  data-ng-show="signupForm.last_name.$touched && signupForm.last_name.$error.required" class="w3-red w3-small">Enter  Last Name</p>-->
                            <p  data-ng-show="signupForm.staff_code.$touched && signupForm.last_name.$error.required" class="w3-red w3-small">Enter  Last Name</p>
                        </div>

                        <div class="form-group row">
                            <label class='w3-label col-lg-6 col-md-6'  >Other Name (Optional):</label>
                            <input class="col-lg-6 col-md-6"  placeholder="Other Name" type="text" class="w3-input"  name="middle_name" data-ng-model="login.person.middle_name" required >

                        </div>

                        <div class="form-group row">
                            <label class='w3-label col-lg-6 col-md-6'  >Title</label> 
                            <select class="col-lg-6 col-md-6" required name="title" class="w3-select" data-ng-model="login.person.title">
                                <option value="" selected disabled>--Select Title --</option>
                                <option value="mr">Mr</option>
                                <option value="md">Madam</option>
                                <option value="mrs">Mrs</option>
                                <option value="ms">Ms</option>
                            </select>
                            <p  data-ng-show="signupForm.title.$touched && signupForm.title.$error.required" class="w3-red w3-small">Chose title</p>
                        </div>
                        <!--                <div class="form-group row">
                                           <label class='w3-label col-lg-6 col-md-6' >Common Name</label> <small style="opacity: .9;font-weight: normal">(i.e A name used optenly e.g. Mr. Mwero, Mwero is the common name)</small>
                                            <input type="text" class="w3-input" name="common_name" id="cname" data-ng-model="login.person.common_name" required >
                                        </div>-->

                        <div class="form-group row"><label class='w3-label col-lg-6 col-md-6'  >Teacher Type <small>i.e. tsc, bom etc</small></label>
                            <select class="col-lg-6 col-md-6" required name="type" class="w3-select " data-ng-model="login.person.type">
                                <option value="" selected disabled>--Select Type --</option>
                                <option value="tsc">TSC</option>
                                <option value="bom">BOM</option>
                                <option value="tp">TP</option>
                            </select>
                            <p  data-ng-show="signupForm.type.$touched && signupForm.type.$error.required" class="w3-red w3-small">Chose Type</p>
                        </div>

                        <div class="form-group row">
                            <label class='w3-label col-lg-6 col-md-6'  >Gender</label>
                            <p class="col-lg-6 col-md-6">
                                <input class="w3-radio" type="radio" data-ng-model="login.person.gen" name="gen" value="f" > <span>Female</span>
                                <input class=" w3-radio" type="radio" data-ng-model="login.person.gen" name="gen" value="m" > <span>Male</span>
                            </p>
                            <p  data-ng-show="signupForm.gen.$touched && signupForm.gen.$error.required" class="w3-red w3-small">Chose Gender</p>
                        </div>

                        <!--                <div class="form-group row">
                        
                                           <label class='w3-label col-lg-6 col-md-6' >Date of Birth</label>
                                            <input type="text" name="dob" id="dob" placeholder="yyyy/mm/dd"required data-ng-model="login.person.dob" > {{login.person.dob}}
                                        </div>-->
                        <div class="form-group row">
                            <label class='w3-label col-lg-6 col-md-6'  >Mobile</label>
                            <input class="col-lg-6 col-md-6" type="tel" placeholder="Phone Number" class="w3-input " name="phone" id="mobile"  placeholder="Phone" required data-ng-model="login.person.phone" 
                                   data-ng-keyup="login.checkItem({'phone':login.person.phone}, 'phone')"
                                   data-ng-blur="login.checkPhone(login.person.phone)">
                            <!--ng-unique='{url:"http://127.0.0.1:7173/login/exists", property:"phone",table:"teachers",request:"exists"}'-->

<!--<input class="col-lg-6 col-md-6" type="tel" placeholder="Phone Number" class="w3-input " name="phone" id="mobile"  placeholder="Phone" required data-ng-model="login.person.phone" data-ng-keyup="login.checkItem({table:'teachers',where:{'phone':login.person.phone}})">-->
                            <p  data-ng-show="signupForm.phone.$touched && signupForm.phone.$error.required" class="w3-red w3-small">Enter Phone Number</p>
                            <!--<p data-ng-show="signupForm.phone.$isUnique" class="w3-red w3-small">The Phone Number Already exists in the system</p>-->
                            <!--<p data-ng-show="login.error.phone" class="w3-red w3-small">The Phone Number Already exists in the system</p>-->
                            <p data-ng-show=" login.error.phoneInvalid" class="w3-red w3-small">Kindly fill a valid phone number</p>
                        </div>
                        <!--                <div class="form-group row">
                                           <label class='w3-label col-lg-6 col-md-6' >Religion</label>
                                            <select required name="religion" class="w3-select" data-ng-model="login.person.religion">
                                                <option >--Select Your Religion --</option>
                                                <option value="c">Christianity</option>
                                                <option value="i">Islam</option>
                                            </select>
                                        </div>-->

                        <div class="form-group form-row ">
                            <h5 class="w3-center">Subject Sombination</h5>

                            <div class="col-md-6 ">
                                <label class='w3-label ' >Subject 1</label>
                                <select required name="sub1" class="w3-select" data-ng-model="login.person.sub1">
                                    <option value="" data-ng-disabled>--Select Subject 1--</option>
                                    <option ng-repeat="sub in login.subs|orderBy:'name'" value="{{sub.short_name}}">{{sub.name|uppercase}}</option>
                                </select>

                            </div>

                            <div class="col-md-6 ">
                                <label class='w3-label' >Subject 2</label>
                                <select name="sub2" class="w3-select" data-ng-model="login.person.sub2" required>
                                    <option value="" data-ng-disabled>--Select Subject 2--</option>
                                    <option ng-repeat="sub in login.subs|orderBy:'name'" value="{{sub.short_name}}">{{sub.name|uppercase}}</option>
                                </select>
                            </div>
                            <p  data-ng-show="signupForm.sub1.$touched && signupForm.sub1.$error.required" class="w3-red w3-small">Chose Subject 1</p>
                        </div>


                        <!--                        <div class="form-group " ng-if="editPersonActive === false">-->
                        <p class="row">
                            <label class='w3-label col-lg-6 col-md-6'  >Passward</label>
                            <input class="col-lg-6 col-md-6" required type="password" data-ng-focus="login.clearError()"  class="w3-input " name="password" id="password" data-ng-model="login.person.password" 
                                   ng-minlength='6'>
                        </p>
                        <p  data-ng-show="signupForm.password.$touched && signupForm.password.$error.required" class="w3-red w3-small">Put password </p>
                        <p  data-ng-show="signupForm.password.$touched && signupForm.password.$error.minlength" class="w3-red w3-small">A Password Must be at least 6 characters long</p>
                        <p  data-ng-show="login.error.pwd.Length" class="w3-red w3-small">A Password Must be at least 6 characters long</p>
                        <!--/********************************************************************************************************************************************************/-->
                        <p class="row">
                            <label class='w3-label col-lg-6 col-md-6'  >Confirm Password</label>

                            <input class="col-lg-6 col-md-6" type="password" required class="w3-input " name="password1" id="password1" data-ng-model="login.password_confirm" 
                                   data-ng-focus="login.clearError()" data-ng-blur="login.pwdCheck(login.person.password, login.password_confirm)">
                        </p>
                        <p  data-ng-show="signupForm.password1.$touched && signupForm.password1.$error.required" class="w3-red w3-small">A Password Must be at least 6 characters long</p>
                        <p  data-ng-show="login.error.pwd.Mismatch" class="w3-red w3-small">Sorry, the two passwords do not match</p>
                        <!--</div>-->

                        <div class="form-group row">
                            <!--<p ng-if="editPersonActive === false"><button data-ng-click="insertFormData({'request':'insert','table':app_page,'data':login.person})" type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Teacher</button></p>-->
                            <p ><button data-ng-click="login.addPerson(login.person)" type="submit" class="btn btn-primary" 
                                        data-ng-disabled="signupForm.$invalid"      
                                        ><span class="fa fa-user"></span>  Add Teacher</button></p>
                            <!--<p ng-if="editPersonActive === true"> <button data-ng-click="updateEntry(login.person)" type="submit" class="btn w3-blue" ><span class="fa fa-user"></span>  Update Info</button></p>-->
                        </div>
                    </fieldset>
                    <div class="w3-container w3-border-top w3-padding-16 w3-light-grey">
                        <button onclick="document.getElementById('id02').style.display = 'none'" type="button" class="w3-btn w3-red">Cancel</button>
                        <!--<p>-->
                        <button class="w3-btn  w3-yellow w3-right " onclick="document.getElementById('id02').style.display = 'none'; document.getElementById('id01').style.display = 'block'">To login, click <a href="">Here</a></button>  
                        <!--                    </p>-->

                    </div>
                </form>
            </div>

        </div>
    </div>
</div>
