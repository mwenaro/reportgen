<!--/**********************************************************************************************
                                    Album page
**********************************************************************************************/-->

<div class="container-fluid" data-ng-init="getData({'request': 'all', 'table':app_page})">
    <div class="w3-teal panel w3-center" style="margin:0px 0px 3px 0px;">
        <h4>Student Album</h4>
    </div>
    <!--/*******************************************************************************************/-->
    <div class="row"  style="border-bottom: groove 2px teal;margin-bottom: 3px;">
        <div class="col-lg-3 col-md-3"ng-repeat="s in data">
            <div class="" style="overflow: hidden">
                <img class="w3-image" width="100%; height:auto" data-ng-src="http://127.0.0.1:7173/public/images/imgs/teachers/{{s.gen}}.png">
            </div>
            <div ng-init="code=s.staff_code+'_code'">
                <p>Teacher Name : <strong>{{s.title|uppercase}}.  {{s.first_name|uppercase}} {{s.last_name|uppercase}}</strong></p>
                <p>Teacher's  Code: <strong>{{s.staff_code}}</strong> </p>
                <p ng-if="s.staff_code==='1'">Role: <strong>{{}}Principal</strong> </p>
                <p ng-if="s.staff_code==='2'">Role: <strong>{{}}Deputy Principal</strong> </p>
                <p ng-if="s.staff_code>2">Role: <strong>{{}}Teacher</strong> </p>
                
            </div>
        </div>

    </div>
    <!--/************************************************************************************************/-->
</div>

<!--/**********************************************************************************************
            End of               Album page
**********************************************************************************************/-->
