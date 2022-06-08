<!--**********************************************************************************************
                         add/remove page
**********************************************************************************************-->

<div class="w3-teal panel w3-center" style="margin:0px 0px 3px 0px;" >
    <h4>Manage Workloads</h4>
</div>
<div class="w3-card col-lg-5" >
    <div style="height:35px;overflow: hidden" >
        <h4 ng-if="editWorkloadActive === false" class="w3-center "> <span class="">Add Workload</span></h4>
        <h4 ng-if="editWorkloadActive === true" class="w3-center"><span  class="">Edit Workload Info</span></h4>
    </div>
    <form    class="w3-form"   >
        <fieldset class="w3-container" >

            <!--/**************************************************************
                                          add/edit form
            -**********************************************/-->

            <!--            <div class="form-group" data-ng-if="editWorkloadActive === true"></div>-->


            <p ng-if="editWorkloadActive === true" ><input type="hidden" value="{{workload.workloadId}}" name="workloadId"/></p>

            <div class="form-group" >
                <label>Subject</label> 
                <!--<select required name="subjectId" class="w3-select" data-ng-model="workload.subjectId" >-->
                <select required name="subject_short_name" class="w3-select" data-ng-model="workload.sub_short_name"   data-ng-blur="changeTrFilter(workload.sub_short_name)">
                    <option value="" disabled>--Select Subject --</option>
                    <option  data-ng-repeat="sub in data.q1|orderBy:'name'" value={{sub.short_name}}>{{sub.name|uppercase}}</option>
                </select>
            </div>

            <div class="form-group" >
                <label>Form</label> 
                <select required name="form" class="w3-select" data-ng-model="workload.form" data-ng-init="forms=[{form:1,name:'Form 1'}, {form:2, name:'Form 2'}, {form:3, name:'Form 3'}, {form:4, name:'Form 4'}]">
                    <option value="" disabled>--Select Form --</option>
                    <option  data-ng-repeat="form in forms" value="{{form.form}}">{{form.name}}</option>
                </select>
            </div>
            
            <div class="form-group" data-ng-init="getTeachers();">
                <label>Teacher{{filterTr}}</label> 
                <select required name="teacherId" class="w3-select" data-ng-model="workload.teacherId" >
                    <option value="" disabled>--Select Teacher --</option>
                    <option  data-ng-repeat="tr in data2.q1|filter:filterTr" value="{{tr.teacherId}}">{{tr.title|uppercase}}. {{tr.first_name|uppercase}} {{tr.last_name|uppercase}}</option>
                </select>
            </div>
            
            

            <div class="form-group">
                <!--<p ng-if="editWorkloadActive === false"><button data-ng-click="insertFormData({'request':'insert','table':app_page,'data':workload})" type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Workload</button></p>-->
                <p ng-if="editWorkloadActive === false"><button data-ng-click="addWorkload(workload)" type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Workload</button></p>
                <p ng-if="editWorkloadActive === true"> <button data-ng-click="updateWorkload(workload)" type="submit" class="btn w3-blue" ><span class="fa fa-user"></span>  Update Info</button></p>
            </div>
        </fieldset>
    </form>
</div>

<!--<data-ng-include src="'http://127.0.0.1:7173/views/includes/workloads_form.php'"></data-ng-include>-->
<!--/****************************************************************************************************************/-->


<div class="col-lg-7 w3-card">
    <!--    <div class="w3-row" style="height:35px;overflow: hidden" data-ng-init="typeFilter = workload.type">
            <h4 class="w3-half w3-center">Workload List</h4>
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
            <tr data-ng-repeat="workload in data.q1|filter:{'type':typeFilter}|orderBy:'name'">
                <td style="display: none" data-ng-init='id = workload.workloadId;'>{{workload.workloadId}}</td>
                <!--<td>{{workload.staff_code}}</td>-->
                <!--<td style="text-align: left;">{{workload.title|uppercase}}</td>-->
                <td style="text-align: left;">{{workload.name|uppercase}}</td>
                <td >{{workload.short_name}}</td>
                <!--<td >{{workload.sub1|uppercase}}{{sep}}{{workload.sub2|uppercase}}</td>-->
                <td><button class="btn btn-primary" data-ng-click="getWorkload(id)"><span class="fa fa-edit"></span>Edit</button></td>
                <td><button class="btn btn-danger "  data-ng-click="removeWorkload(id)"><span class="fa fa-trash"></span>Delete</button></td>
            </tr>
        </tbody>
    </table>
</div>

</div> 

<!-- /**********************************************************************************************
                End of               add/remove page
    **********************************************************************************************/-->