<div >
    <h3 class="w3-center">Subject Selection</h3>

    <div class="w3-container" style="">

        <div class="select2-container" data-ng-init="_test">
            <h3>Subject</h3>

            <select data-ng-model="_test" required class="w3-select " data-ng-focus="sel.show_fields = false" style="width:100%;border:solid 15px #e5e5e5;border-radius: 5px;padding:10px">
                <option data-ng-disabled value="">Suject</option>
                <!--<option data-ng-repeat="e in sel.tests" value="{{e.test}}">{{e.short_name}}  {{e.form}}</option>-->
                <option data-ng-repeat="e in sel.tests|orderBy:'sub'" value="{{e}}" >{{e.sub|uppercase}}  {{e.form}}</option>
            </select>
            <button data-ng-click="sel.loadFields(_test)" class="w3-button w3-btn-block w3-ripple w3-orange w3-right">
                Load Students
            </button>
        </div>

        <div class="w3-row" >
            <div class="w3-container w3-half">

                <h3 class="w3-center">Select Your Students </h3>

                <form   role="form" id="mk_form"  data-ng-if="sel.show_fields">                   
                    <table class="w3-table-all" >
                        <thead>
                            <tr class="w3-red">
                                <th>#</th>
                                <th style="display:none"></th>
                                <th>ADM NO</th>
                                <th>Student Name</th>
                                <th>Form</th>
                                <th>
                                    <span 

                                        data-ng-click="sel.toggleCheckAll()"               > 
                                        <span data-ng-if="!sel.selectall">Select All</span>
                                        <!--<span>Select All</span>-->
                                        <input type="checkbox" class="w3-check" data-ng-model="mk.selectall">
                                         <!--<span data-ng-if="!sel.selectall" class="btn-primary btn-block">Select All</span>-->
                                        <!--<span data-ng-if="sel.selectall" class="btn-danger  btn-block">Deselect All</span>-->
                                    </span>

                                </th>
                            </tr>
                        </thead>

                        <tbody >
                            <tr data-ng-repeat="s in sel.students"  data-ng-init="">
                            <!--<tr data-ng-repeat="s in sel.candidates"  >-->
                                <td>{{1 + $index}} </td>
                                <td>{{s.adm}}</td>
                                <td>{{s.name|uppercase}}</td>
                                <td>{{s.form}} <input type="hidden" value="{{s.form}}" name="form" </td>

                                <td>
                                    <input class="w3-check"   type="checkbox" max="100" min="0"  name="score[{{$index}}]"  
                                           data-ng-model="sel.candidates[$index].flag" >

<!--<input  type="checkbox" max="100" min="0" value="1" name="score[{{$index}}]"     data-ng-model="sel.candidates[$index].flag" >-->

                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p><button type="submit" data-ng-click="sel.fetch()">Save</button></p>  
                </form>
            </div>
            <div class=" w3-half w3-container">

                <h3 class="w3-center">Selected Students </h3>

                <div data-ng-show="sel.allowPreview">
                    <table class="w3-table-all">
                        <thead>
                            <tr class="w3-blue">
                                <th>#</th>
                                <th>ADM</th>
                                <th>Student Name</th>
                                <td>Remove</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr data-ng-repeat="std in sel.subjectDoers">
                                <td>{{$index + 1}}</td>
                                <td>{{std.adm}}</td>
                                <td>{{std.name|uppercase}}</td>
                                <td><span class="btn btn-danger fa fa-remove w3-large" data-ng-click="sel.removeStudent(std.studentId, std.subjectId, std.testId)"></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>








































    <!--
        <table class="w3-table w3-table-all " style="">
            <thead  >
                <tr class="w3-blue-gray " style="text-align: center !important">
                    <th>#</th>
                    <th>Subject</th>
                    <th>Nhort Name</th>
                    <th>Form</th>
                    <th>Marks</th>
                    <th colspan="4">Operations</th>
                </tr>
            </thead>
            <tbody>
                <tr data-ng-repeat="e in sel.tests">
                    <td style="display: none" data-ng-init='id = e.testId'></td>
                    <td>{{$index + 1}}</td>
                    <td>{{e.name}}</td>
                    <td>{{e.short_name}}</td>
                    <td>{{e.form}}</td>
                    <td>{{e.max_score}}</td>
                    <td><a style="" class="btn btn-primary w3-btn-block" ui-sref="exam.marks({examId:id})"> Add Marks</a></td>
                    <td><a style="" class="btn btn-primary w3-btn-block">Publish</a></td>
                    <td><button style="width:100%;" class="btn btn-primary w3-btn-block" data-ng-click="getPerson(id)"><span class="fa fa-edit"></span>Edit</button></td>
                    <td><button style="width:100%;" class="btn btn-danger w3-btn-block" id="myBtn" data-ng-click="removePerson(id)"><span class="fa fa-trash"></span>Delete</button></td>
                </tr>
    
            </tbody>
        </table>-->
</div>