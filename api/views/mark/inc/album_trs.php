<!--/**********************************************************************************************
                                    Album page
**********************************************************************************************/-->

<div class="container-fluid" data-ng-init="getData({'request': 'all', 'table':app_page})">
    <div class="w3-teal panel w3-center" style="margin:0px 0px 3px 0px;">
        <h4>Student Album</h4>
    </div>
    <!--/*******************************************************************************************/-->
    <div class="row"  style="border-bottom: groove 2px teal;margin-bottom: 3px;">
        <div class="col-lg-3 col-md-3"ng-repeat="s in data.q1">
            <div class="" style="overflow: hidden">
                <img class="w3-image" width="100%; height:atuo" src="http://127.0.0.1:7173/public/images/imgs/marks/{{s.gen}}.png">
            </div>
            <div>
                <p>Teacher Name : <strong>{{s.title}}.  {{s.first_name}} {{s.last_name}}</strong></p>
                <p>Teacher's  Code: <strong>{{s.staff_code}}</strong> </p>
            </div>
        </div>

    </div>
    <!--/************************************************************************************************/-->
</div>

<!--/**********************************************************************************************
            End of               Album page
**********************************************************************************************/-->
