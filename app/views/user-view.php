<!---Start of the Page div
/*****************************************************************************************************-->
<!--<div class=" " id="big-Con" data-ng-controller="userController as user">-->
<div class=" " id="big-Con" >
    <!--/*********************************************************************************************/-->
    <div id="nav_inner" class="w3-panel w3-round" style="background:#e3e3e3;margin-top: 6px;">
        <h3 class="page_title w3-half w3-text-blue" data-ng-if="user.user">Welcome {{user.user.title|uppercase}}. {{user.user.last_name|uppercase}}</h3>
        <ul class="w3-right w3-half" >
            <!--            <button class="button btn-primary" > <a ui-sref="exam.index">Manage Exams</a></button>
                        <button class="button btn-primary" > <a ui-sref="exam.marks">Manage Marks</a></button>
                        <button class="button btn-primary" > <a ui-sref="exam.anlysis">Analysis and Reports</a></button>-->
        </ul>

    </div>

    <!--<Include Container>-->
    <div class="w3-container row" id="include_container" data-ng-init="
        msgTypes = [
        {type:'Messages',cls:'fa fa - envelope w3 - xlarge w3 - text- orange'},
        {type:'Activities', cls:'fa fa-bell w3-xlarge w3-text-orange'}
        ,
        {type:'Notices', cls:'fa fa-bell w3-xlarge w3-text-orange'
        }
        ];
        msgs = [
        {id:1, title:'Welcome', msg:'welcome mr/ms ', category:'Messages'},
        {id:2, title:'manege passwords', msg:'Manage your passordws ', category:'Notices'},
        {id:3, title:'Subject Selection', msg:'Do select subjects ', category:'Activities'},
        {id:4, title:'Deadline', msg:'Fill your marks to beat daedline ', category:'Activities'},
        {id:5, title:'Reminder', msg:'dateline for filling is 10/10/2018 ', category:'Notices'},
                ];
                
         ">
        <div class="col-md-10">

        </div>
        <div class="col-md-2"> 

            <style>

            </style>
            <div>
                <div id="box" data-ng-repeat="msgType in msgTypes">
                    <h3>{{msgType.type}}<span class="{{msgType.cls}}"></span></h3>
                    <div style="" class="msgs-box" data-ng-repeat="msg in msgs|filter:msgType.type" data-ng-init="showMsg = false">
                        <h6><span data-ng-click="showMsg = !showMsg">{{$index + 1}} {{msg.title}} </span></h6>
                        <p data-ng-show="showMsg"><a us-sref="messages({id:1})">{{msg.msg}} </a><span class="w3-button  w3-red fa fa-trash"></span></p>


                    </div>

                </div>
            </div>
        </div>


    </div><!-- End of hte page---->
</div>
