<div>
    <h3 class="w3-center">Add Marks</h3>

    <div class="w3-container" style="">

        <div class="select2-container w3-half w3-row" data-ng-init="_test">
           
            <select data-ng-model="_test" name="mk[iIndex]" required class="w3-select col-md-9 col-lg-9" data-ng-focus="mk.show_fields = false" style="border:solid 15px #e5e5e5;border-radius: 5px;padding:10px">
                <option data-ng-disabled value="">--Select Suject--</option>
                <!--<option data-ng-repeat="e in mk.tests" value="{{e.test}}">{{e.short_name}}  {{e.form}}</option>-->
                <!--<option data-ng-repeat="e in mk.tests|orderBy:'name'" value="{{$index}}" >{{e.name|uppercase}}  {{e.form}}</option>-->
                <option data-ng-repeat="e in mk.tests|orderBy:'name'" value="{{e}}" >{{e.sub|uppercase}}  {{e.form}} {{e.stream|uppercase}}</option>
            </select>
            <button data-ng-click="mk.loadFields(_test)" class="col-md-3 col-lg-3 w3-button  w3-ripple w3-orange " style="float:right">
                Load Students
            </button>
        </div>

        <div class="w3-row" >
            <div class="col-md-6 col-lg-6">
                <p class="w3-center">Enter Marks </p>
                <form   role="form" id="mk_form"  >

                    <table class="w3-table"  >
                        <thead>
                            <tr class="w3-red">
                                <th>#</th>
                                <th style="display:none"></th>
                                <th>ADM NO</th>
                                <th>Student Name</th>
                                <th>Form</th>
                                <th>Score</th>
                            </tr>
                        </thead>

                        <tbody data-ng-if="mk.show_fields">
                            <tr data-ng-repeat='s in mk.students' >
                            <!--<tr data-ng-repeat="s in mk.candidates"  >-->
                                <td>{{1 + $index}} </td>
                                <td>{{s.adm}}</td>
                                 <td>{{s.name|uppercase}}</td>
                                <td>{{s.form}} <input type="hidden" value="{{s.form}}" name="form" </td>
                                <td>
                                    <input  type="number" max="100" min="0"  name="score[{{$index}}]"     data-ng-model="mk.candidates[$index].score" >

                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p><button type="submit" data-ng-click="mk.fetch()">Save</button></p>
                </form>
            </div>

            <div class="col-md-6 col-lg-6">

                <p class="w3-center">Marks Preview </p>

                <div>
                    <table class="w3-table-all" style="overflow: scroll">
                        <thead>
                            <tr class="w3-blue">
                                <th>#</th>
                                <th>ADM</th>
                                <th>Student Name</th>
                                <th>Exam</th>
                                <th>Score</th>
                                <td>%Mark</td>
                                <td>Grade</td>
                                <td>Points</td>
                                <td>Edit</td>
                                <td>Delete</td>
                            </tr>
                        </thead>
                        <tbody >
                            <tr data-ng-repeat="std in mk.filledMarks" data-ng-init="id = std.markId; mk.allowEditAr[$index] = false; mk._scores[$index]= null">
                                <td>{{$index + 1}}</td>
                                <td>{{std.adm}}</td>
                                <td>{{std.name|uppercase}}</td>
                                <td>{{std.type}}</td>
                                <td><span data-ng-if="!mk.allowEditAr[$index]">{{std.score}}</span><span data-ng-if="mk.allowEditAr[$index]"><input data-ng-model="mk._scores[$index]" type="text"></span</td>
                                <td>{{std.per_mark}}</td>
                                <td>{{std.grade}}</td>
                                <td>{{std.points}}</td>
                                <td>
                                    <span data-ng-if="mk.allowEditAr[$index]=== false" data-ng-click="mk.allowEditAr[$index] = true"><span  class="btn btn-primary fa fa-edit w3-large" ></span></span>
                                    <span data-ng-if="mk.allowEditAr[$index]" data-ng-disabled="!mk._scores[$index]" class="btn w3-orange fa fa-save w3-large" data-ng-click="mk.update(id,$index)"></span>
                                </td>
                                <td><span class="btn btn-danger fa fa-remove w3-large" data-ng-click="mk.removeMark(std.studentId,std.testId)"></span>Del</td>
                                <!--<td><span class="btn btn-danger fa fa-remove w3-large" data-ng-click="mk.removeStudent(std.studentId, std.subjectId, std.testId)"></span></td>-->
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>






































