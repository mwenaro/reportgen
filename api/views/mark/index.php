<style>
    #nav_inner ul,button{
        height: 26px;
        line-height: 1.5;
        
    }
    #nav_inner ul{
        padding: 2px;
    }
    
    .page_title{
        text-align: center;
        margin: 0;
        padding: 0;
    }
    
    #include_contaier{
        background: #e3e3e3;
    }
    
    form >div{
        margin: 0px;
    }
</style>
<!--<Start of the Page div-->
<!--/*****************************************************************************************************-->
<div class=" " id="big-Con" data-ng-controller="trsController" data-ng-init="showForm = false; app_page = 'marks'">
    <!--/*********************************************************************************************/-->
    <div id="nav_inner" class="w3-panel w3-round" style="background:#e3e3e3;margin-top: 6px;">
        <h3 class="page_title w3-half w3-text-blue">Teacher Page</h3>
        <ul class="w3-right w3-half" data-ng-init="inc_name='dashboard';">
        <!--<button class="button btn-primary"  data-ng-click="changeInclude('dashboard')">Dashboard</button>-->
        <button class="button btn-primary" data-ng-click="changeInclude('add')">Add/Remove Teacher</button>
        <button class="button btn-primary" data-ng-click="changeInclude('album')">Teacher Album</button>
        <button class="button btn-primary" data-ng-click="changeInclude('workload')">Workload</button>
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

