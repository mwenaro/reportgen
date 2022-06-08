<!--**********************************************************************************************
                         add/remove page
**********************************************************************************************-->

<div class="w3-teal panel w3-center" style="margin:0px 0px 3px 0px;" >
    <h4>Manage Subjects</h4>
</div>
<div class="w3-card col-lg-5" data-ng-init="" >
    <div style="height:35px;overflow: hidden" >
        <h4 ng-if="editSubjectActive === false" class="w3-center "> <span class="">Add Subject</span></h4>
        <h4 ng-if="editSubjectActive === true" class="w3-center"><span  class="">Edit Subject Info</span></h4>
    </div>
    <form    class="w3-form"   >
        <fieldset class="w3-container" >

            <!--/**************************************************************
                                          add/edit form
            -**********************************************/-->

            <!--            <div class="form-group" data-ng-if="editSubjectActive === true"></div>-->


            <p ng-if="editSubjectActive === true" ><input type="hidden" value="{{subject.subjectId}}" name="subjectId"/></p>

            <div class="form-group">
                <label>Subect Name :</label>
                <input type="text" class="w3-input"  name="name" data-ng-model="subject.name" required >
            </div>

            <div class="form-group">
                <label>Short Name:</label>
                <input type="text" class="w3-input" name="short_name" id="lname" data-ng-model="subject.short_name" required >
            </div>

            <div class="form-group" >
                <label>Compulsory</label> 
                <select required name="isCompulsory" class="w3-select" data-ng-model="subject.isCompulsory">
                    <option value="" data-ng-disabled>--Choose Status-</option>
                    <option value="1"> is Compulsory</option>
                    <option value="0">Not </option>
                </select>
            </div>
            <div class="form-group" >
                <label>Status</label> 
                <select required name="isOffered" class="w3-select" data-ng-model="subject.isOffered">
                    <option value="" data-ng-disabled>--Select Title --</option>
                    <option value="1">Is Offered</option>
                    <option value="0">Not Offered</option>
                </select>
            </div>

            <div class="form-group">
                <!--<p ng-if="editSubjectActive === false"><button data-ng-click="insertFormData({'request':'insert','table':app_page,'data':subject})" type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Subject</button></p>-->
                <p ng-if="editSubjectActive === false"><button data-ng-click="addSubject(subject)" type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Subject</button></p>
                <p ng-if="editSubjectActive === true"> <button data-ng-click="updateEntry(subject)" type="submit" class="btn w3-blue" ><span class="fa fa-user"></span>  Update Info</button></p>
            </div>
        </fieldset>
    </form>
</div>

<!--<data-ng-include src="'http://127.0.0.1:7173/views/includes/subjects_form.php'"></data-ng-include>-->
<!--/****************************************************************************************************************/-->


<div class="col-lg-7 w3-card">
    <!--    <div class="w3-row" style="height:35px;overflow: hidden" data-ng-init="typeFilter = subject.type">
            <h4 class="w3-half w3-center">Subject List</h4>
            <div class="w3-half">
                <p>
                    <label>Select Form  </label> 
                    <select class="" data-ng-model="typeFilter">
                        <option value="">all</option>
                        <option value="bom">BOM</option>
                        <option value="tsc">TSC</option>
                        <option value="tp">TP</option>
    
                    </select>
                </p>
            </div> 
        </div>-->

    <table cliass="w3-table-all  w3-responsive" class="table table-condensed table-bordered table-hover table-responsive table-striped" data-ng-init=''  >
        <thead>
            <tr>
                <th style="display: none">id</th>
                <th>Name</th>
                <th>Short Name</th>

                <th>Edit</th>
                <th>Delete</th>

            </tr>
        </thead>
        <tbody data-ng-init="getData({'request': 'all', 'table':app_page});">
            <tr data-ng-repeat="subject in data.q1|filter:{'type':typeFilter}|orderBy:'name'">
                <td style="display: none" data-ng-init='id = subject.subjectId;'>{{subject.subjectId}}</td>
                <!--<td>{{subject.staff_code}}</td>-->
                <!--<td style="text-align: left;">{{subject.title|uppercase}}</td>-->
                <td style="text-align: left;">{{subject.name|uppercase}}</td>
                <td >{{subject.short_name}}</td>
                <!--<td >{{subject.sub1|uppercase}}{{sep}}{{subject.sub2|uppercase}}</td>-->
                <td><button class="btn btn-primary" data-ng-click="getSubject(id)"><span class="fa fa-edit"></span>Edit</button></td>
                <td><button class="btn btn-danger "  data-ng-click="removeSubject(id)"><span class="fa fa-trash"></span>Delete</button></td>
            </tr>
        </tbody>
    </table>
</div>

</div> 

<!-- /**********************************************************************************************
                End of               add/remove page
    **********************************************************************************************/-->