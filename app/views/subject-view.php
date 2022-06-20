
<!--<Start of the Page div-->
<!--/*****************************************************************************************************-->
<div class=" " id="big-Con" data-ng-controller="subjectController" data-ng-init="showForm = false; app_page = 'subjects'">
    <!--/*********************************************************************************************/-->
    <div id="nav_inner" class="w3-panel w3-round" style="background:#e3e3e3;margin-top: 6px;">
        <h3 class="page_title w3-half w3-text-blue">Subject Page</h3>
        <ul class="w3-right w3-half" data-ng-init="inc_name = 'dashboard';">
            <button class="button btn-primary" data-ng-click="changeInclude('add')">Add/Remove Subject</button>
            <button class="button btn-primary" data-ng-click="changeInclude('workload')">Workload</button>
            <button class="button btn-primary" data-ng-click="changeInclude('dashboard')">Dashboard</button>
        </ul>

    </div>
    <!--<Include Container>-->
    <div class="w3-container row" id="include_container">
        <!---The ng-show--->
        <p data-ng-show="showForm === true" >
        </p>
        <!--/*****************************************************************************************/
                                    Innner Include
        *****************************************************************************************/-->
        <!--<ng-include src="'{{inc_path}}'"></ng-include>-->
        <ng-include src="getInclude()"></ng-include>
        <!--<ng-include src="'http://127.0.0.1:7173/views/teacher/inc/dashboard.php'"></ng-include>-->
        <!--/*****************************************************************************************/
                                      Innner Include
          *****************************************************************************************/-->

        <!--</include Containerjh-->
    </div><!--- End of hte page---->
