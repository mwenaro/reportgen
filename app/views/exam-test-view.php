<div>
    <h3 class="w3-center">Configure Exam </h3>

    <div class="w3-container" style="">

<!--        <div class="select2-container w3-half w3-row"  data-ng-init="test">
            <select data-ng-model="test" name="mk[iIndex]" required class="w3-select col-md-9 col-lg-9" data-ng-focus="test.show_fields = false" style="border:solid 15px #e5e5e5;border-radius: 5px;padding:10px">
                <option data-ng-disabled value="">--Select Suject--</option>
                <option data-ng-repeat="e in test.tests" value="{{e.test}}">{{e.short_name}}  {{e.form}}</option>
                <option data-ng-repeat="e in test.tests|orderBy:'name'" value="{{$index}}" >{{e.name|uppercase}}  {{e.form}}</option>
                <option data-ng-repeat="e in test.tests|orderBy:'name'" value="{{e}}" >{{e.name|uppercase}}  {{e.form}}</option>
            </select>
            <button data-ng-click="test.loadFields(test)" class="col-md-3 col-lg-3 w3-button  w3-ripple w3-orange " style="float:right">
                Load Students
            </button>
        </div>-->
        <div class="w3-row">
            <div class="col-md-6 col-lg-6 w3-container" >
                <form role="form" name="testForm" novalidate>
                    <p data-ng-if="test.editActive">
                        <input type="hidden" data-ng-model="test.current_test.testId">
                    </p>
                    <div >
                        <p class="w3-row">
                        <label class="col-md-6 col-lg-6"> Subject</label> 
                        <select data-ng-model="test.current_test.courseId" name="sub" required class="w3-select col-md-9 col-lg-9"  style="border:solid 15px #e5e5e5;border-radius: 5px;padding:10px">
                       
                            <option value="" disabled>---Select Subject----</option>
                            <option data-ng-repeat="s in subjects" value="{{s.courseId}}" >{{s.short_name|uppercase}}</option>
                        </select>
                    </p>
                    </div>
                        <div>
                    <p class="w3-row">
                        <label class="col-md-6 col-lg-6"> Form</label> 
                        <select data-ng-model="test.current_test.form" name="_form" required class="w3-select col-md-9 col-lg-9"  style="border:solid 15px #e5e5e5;border-radius: 5px;padding:10px">
                            <option data-ng-disabled value="">--Select Form--</option>
                           <option data-ng-repeat="f in [1,2,3,4]" value="{{f}}" > Form {{f}}</option>
                        </select>
                    </p>
                        </div>
                    <p class="w3-margin-8">
                       <label class="col-md-6 col-lg-6"> OUT OF (mks)</label> 
                       <input class="col-md-6 col-lg-6" data-ng-model="test.current_test.max_score" name="outof" min="0" type="text">
                    </p>
                    <div class="w3-panel"> 
                        <p data-ng-if="!test.editActive" class="w3-center">
                       <button class="w3-btn w3-btn-block w3-green w3-third" data-ng-click="test.add(test.current_test)">Add</button>
                    </p>
                    <p data-ng-if="test.editActive" class="w3-center">
                        <button class="w3-btn w3-btn-block w3-blue w3-third"  data-ng-click="test.update(test.current_test)">Update</button>
                    </p>
                    </div>
                </form>
            </div>
            <div class="col-md-6 col-lg-6 w3-container">
                <table class="w3-table w3-table-all">
                    <thead>
                        <tr class="w3-red">
                            <th>#</th>
                            <th>Subject</th>
                            <th>Form</th>
                            <th>Out Of</th>
                            <th colspan="2">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr data-ng-repeat="c in test.tests|orderBy:'name'" data-ng-init="id = c.testId">
                            <td>{{1 + $index}}</td>
                            <td>{{c.short_name|uppercase}}</td>
                            <td>{{c.form}}</td>
                            <td>{{c.max_score}}</td>
                            <td><button style="width:100%;" class="btn btn-primary w3-btn-block" data-ng-click="test.get(c)"><span class="fa fa-edit"></span>Edit</button></td>
                            <td><button style="width:100%;" class="btn btn-danger w3-btn-block" id="myBtn" data-ng-click="test.remove(id)"><span class="fa fa-trash"></span>Delete</button></td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</div>






































