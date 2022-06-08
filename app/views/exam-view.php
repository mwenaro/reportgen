
<!---Start of the Page div
/*****************************************************************************************************-->
<div class=" " id="big-Con" >
    <!--/*********************************************************************************************/-->
    <div id="nav_inner" class="w3-panel w3-round" style="background:#e3e3e3;margin-top: 6px;">
        <h3 class="page_title w3-half w3-text-blue">Examination Center</h3>
        <ul class="w3-right w3-half" >
            <button class="button btn-primary" > <a ui-sref="exam.index">Manage Exams</a></button>
            <!--<button class="button btn-primary" > <a ui-sref="exam.marks">Manage Marks</a></button>-->
            <button class="button btn-primary" > <a ui-sref="exam.anlysis">Analysis and Reports</a></button>
        </ul>

    </div>
    <div class="">
        <div data-ng-hide="exam.current">
        <table class="w3-table w3-table-all w3-light-grey" >
            <thead  >
                <tr class="w3-blue-gray " style="text-align: center !important">
                    <th>#</th>
                    <th>Term</th>
                    <th>Year</th>
                    <th>Name</th>
                    <th colspan="6">Operations</th>
                </tr>
            </thead>
            <tbody>
                <tr data-ng-repeat="ex in exam.exams">
                    <td style="display: none" data-ng-init='id = ex.examId'></td>
                    <td>{{$index + 1}}</td>
                    <td>{{ex.term}}</td>
                    <td>{{ex.year}}</td>
                    <td>{{ex.name|uppercase}}</td>
                    <td ><a style="" class="btn btn-primary w3-btn-block" ui-sref="exam.marks({examId:id})">Add Marks</a></td>
                    <td ><a style="" class="btn btn-primary w3-btn-block" ui-sref="exam.sub_selection({examId:id})">Subject Selection</a></td>
                    <td ><a style="" class="btn btn-primary w3-btn-block" ui-sref="exam.test({examId:id})">Add Test</a></td>
                    <td ><a style="" class="btn btn-primary w3-btn-block" ui-sref="exam.report({examId:id})">Report</a></td>
                   <td><button style="width:100%;" class="btn btn-primary w3-btn-block" data-ng-click="getPerson(id)"><span class="fa fa-edit"></span>Edit</button></td>
                    <td><button style="width:100%;" class="btn btn-danger w3-btn-block" id="myBtn" data-ng-click="removePerson(id)"><span class="fa fa-trash"></span>Delete</button></td>
                </tr>

            </tbody>
        </table>
        </div>
        <div data-ng-if="exam.current">
        <table class="w3-table w3-table-all w3-light-grey" >
            <thead  >
                <tr class="w3-blue-gray " style="text-align: center !important">
                    <th>#</th>
                    <th>Term</th>
                    <th>Year</th>
                    <th>Name</th>
                    <th colspan="6">Operations</th>
                </tr>
            </thead>
            <tbody>
                <tr data-ng-repeat="ex in exam.exams">
                    <td style="display: none" data-ng-init='id = ex.examId'></td>
                    <td>{{$index + 1}}</td>
                    <td>{{ex.term}}</td>
                    <td>{{ex.year}}</td>
                    <td>{{ex.name|uppercase}}</td>
                    <td data-ng-click="exam.getCurrent(ex)"><a style="" class="btn btn-primary w3-btn-block" ui-sref="exam.marks({examId:id,examIndex:$index})">Add Marks</a></td>
                    <td data-ng-click="exam.getCurrent(ex)"><a style="" class="btn btn-primary w3-btn-block" ui-sref="exam.report">Report</a></td>
                    <td><button style="width:100%;" class="btn btn-primary w3-btn-block" data-ng-click="getPerson(id)"><span class="fa fa-edit"></span>Edit</button></td>
                    <td><button style="width:100%;" class="btn btn-danger w3-btn-block" id="myBtn" data-ng-click="removePerson(id)"><span class="fa fa-trash"></span>Delete</button></td>
                </tr>

            </tbody>
        </table>
        </div>
    </div>
    <!--<Include Container>-->
    <div class="w3-container row" id="include_container">
        <!--The ng-show-->

        <ui-view></ui-view>
    </div><!-- End of hte page---->
