
<!---Start of the Page div
/*****************************************************************************************************-->
<div class=" " id="big-Con" data-ng-controller="examController as exam" data-ng-init="showForm = false; app_page = 'students'">
    <!--/*********************************************************************************************/-->
    <div id="nav_inner" class="w3-panel w3-round" style="background:#e3e3e3;margin-top: 6px;">
        <h3 class="page_title w3-half w3-text-blue">Examination Center</h3>
        <ul class="w3-right w3-half" data-ng-init="inc_name='dashboard';">
        <button class="button btn-primary"  ui-sref="exams.index">Manage Exams</button>
        <button class="button btn-primary" ui-sref="exams.marks">Manage Marks</button>
        <button class="button btn-primary" ui-sref="exams.anlysis">Analysis and Reports</button>
        </ul>
        <user></user>
    </div>
    <!--<Include Container>-->
    <div class="w3-container row" id="include_container">
    <!--The ng-show-->
    
  <!--/*****************************************************************************************/
                              Innner Include
  *****************************************************************************************/-->
  
  <!--<ng-include src="getInclude()"></ng-include>
  <!--<ng-include src="'http://127.0.0.1:7173/php/views/student/inc/dashboard.php'"></ng-include>
 <!--/*****************************************************************************************/
                              Innner Include
  *****************************************************************************************/-->
    
    <!--</include Containerjh-->
</div><!-- End of hte page---->
