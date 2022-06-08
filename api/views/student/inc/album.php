<!--/**********************************************************************************************
                                    Album page
**********************************************************************************************/-->

<div class="container-fluid" data-ng-init="getData({'request': 'all', 'table':app_page})">
    <div class="w3-teal panel w3-center" style="margin:0px 0px 3px 0px;">
        <h4>Student Album</h4>
    </div>
    <!--/*******************************************************************************************/-->
    <div class="row" ng-repeat="filterForm in [1,2,3,4]" style="border-bottom: groove 2px teal;margin-bottom: 3px;">
        <div class="col-lg-12 col-md-12 col-sm-12"><h2>Form {{filterForm}}</h2> </div>
        <div class="col-lg-3 col-md-3 col-sm-3" ng-repeat="s in data.q1|filter:{'form':filterForm}">
            <div class="" style="overflow: hidden">
                <img class="w3-image" width="100%; height:atuo" data-ng-src="http://127.0.0.1:7173/public/images/imgs/student/{{s.gen}}.png">
            </div>
            <div>
                <p>Student Name : <strong>{{s.name}}</strong></p>
                <p>Adm No : <strong>{{s.adm}}</strong> Form : <strong>{{s.form}}</strong>  Sex : <strong>{{s.gen|uppercase}}</strong></p>
            </div>
        </div>

    </div>
    <!--/************************************************************************************************/-->
</div>

<!--/**********************************************************************************************
            End of               Album page
**********************************************************************************************/-->
