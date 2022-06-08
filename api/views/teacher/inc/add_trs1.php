<!--**********************************************************************************************
                         add/remove page
**********************************************************************************************-->

<div class="w3-teal panel w3-center" style="margin:0px 0px 3px 0px;" >
    <h4>Manage Teachers</h4>
</div>

   
    <table  class="table table-condensed table-bordered table-hover table-responsive table-striped" data-ng-init=''  >
        <thead>
            <tr>
                <th style="display: none">id</th>
                <th>Staff Code</th>
                <th>Title</th>
                <th>Name</th>
                <th>Teacher Type</th>
                <th>T/Combination</th>
                <th>Edit</th>
                <th>Delete</th>

            </tr>
        </thead>
        <tbody data-ng-init="getData({'request': 'all', 'table':app_page,orderBy:'staff_code'});">
            <tr data-ng-repeat="teacher in data.q1|filter:{'type':typeFilter}">
            
                <td style="display: none" data-ng-init='id = teacher.teacherId; sep = (!teacher.sub2 == null || !teacher.sub2 == "")?"/":""'>{{teacher.teacherId}}</td>
                <td>{{teacher.staff_code}}</td>
                <td style="text-align: left;">{{teacher.title|uppercase}}</td>
                <td style="text-align: left;">{{teacher.first_name|uppercase}}  {{teacher.last_name|uppercase}}</td>
                <td >{{teacher.type|uppercase}}</td>
                <td >{{teacher.sub1|uppercase}}{{sep}}{{teacher.sub2|uppercase}}</td>
                <td><button class="btn btn-primary" data-ng-click="getTeacher(id)"><span class="fa fa-edit"></span>Edit</button></td>
                <td><button class="btn btn-danger "  data-ng-click="removeTeacher(id)"><span class="fa fa-trash"></span>Delete</button></td>
            </tr>
        </tbody>
    </table>
</div>

</div> 

<!-- /**********************************************************************************************
                End of               add/remove page
    **********************************************************************************************/-->