<div class="w3-container" style="">
    <form   role="form" id="mk_form">
        <!--<form   role="form" id="mk_form"  action="self" method="post">-->
        <div class="row  w3-light-gray w3-center">
            <div class="col-md-3 col-lg-2 w3-card">
                <h3>Exam</h3>
                <select data-ng-model="mk.mks.examId" name="mk[examId]" required class="w3-selct">
                    <option data-ng-disabled value="">Exam</option>
                    <option value="{{exam.examId}}" data-ng-repeat="exam in mk.exams">{{exam.name}}</option>
                </select>
            </div>

            <div class="col-md-3 col-lg-2 w3-card">
                <h3>Subject</h3>
                <select data-ng-model="mk.mks.subjectId" name="mk[subjectId]" required class="w3-selct">
                    <option data-ng-disabled value="">Suject</option>
                    <option data-ng-repeat="sub in mk.subjects" value="{{sub.subjectId}}">{{sub.short_name}} </option>
                </select>
            </div>
            <div class="col-md-3 col-lg-2 w3-card">
                <h3>Term</h3>
                <select data-ng-model="mk.mks.term" name="mk[term]" required class="w3-selct">
                    <option data-ng-disabled value="">Term</option>
                    <option data-ng-repeat="t in ['One', 'Two', 'Three']" value="{{1 + $index}}">Term {{1 + $index}} ({{t}}) </option>
                </select>
            </div>
            <div class="col-md-3 col-lg-2 w3-card">
                <h3>Form</h3>
                <select data-ng-model="mk.mks.form" name="mk[form]" required class="w3-selct">
                    <option data-ng-disabled value="">Form</option>
                    <option data-ng-repeat="f in ['One', 'Two', 'Three', 'Four']" value="{{1 + $index}}">Form {{1 + $index}} ({{f}}) </option>
                </select>
            </div>
            <div class="col-md-3 col-lg-1 w3-card">
                <h3>Year</h3>
                <select data-ng-model="mk.mks.year" name="mk[year]" required class="w3-selct">
                    <option data-ng-disabled value="">Year</option>
                    <option data-ng-repeat="y in [2016, 2017, 2018, 2019, 2020, 2021]" value="{{y}}">{{y}} </option>
                </select>
            </div>
            <div class="col-md-3 col-lg-1 w3-card">
                <button  class="btn btn-primary w3-large" data-ng-click="login.loadStudents()" style="height:30px;margin-top:10px">Load Students</button>
               
            </div>
            <!--<table class="w3-table" data-ng-show="mk.show_table === true">-->
            <table class="w3-table" data-ng-init="filter">
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
                <tbody>
                    <tr data-ng-repeat="s in mk.students|orderBy:['form', 'adm']|filter:{form:mk.mks.form}" data-ng-if="mk.mks.form !== undefined && mk.mks.subjectId !== undefined">
                        <td>{{1 + $index}} </td>
                        <td>{{s.adm}}<input type="hidden" value="{{s.adm}}" name="mk[adm][]" data-ng-model="mk.mks['ad']['adm' + $index]"></td>
                        <!--<td style="display:none"><input type="hidden" value="{{idz}}" name="mk[studentId][]" data-ng-model="mk.mks['studentId'][mk.studentId+'']" ></td>-->
                        <td style="display:none"><input type="hidden" value="{{mk.mks.form}}" name="studentId" data-ng-model="s.form" ></td>
                        <td style="display:none"><input type="hidden" value="{{mk.mks.examId}}" name="studentId" data-ng-model="s.examId" ></td>
                        <td style="display:none"><input type="hidden" value="{{s.studentId}}" name="studentId" data-ng-model="mk.mks['studentId']['id' + $index]" ></td>
                        <td>{{s.name|uppercase}}</td>
                        <td>{{s.form}} <input type="hidden" value="{{s.form}}" name="form" data-ng-model="mk.form"></td>
                        <!--//<td>{{s.form}} <input type="hidden" value="{{d}}" name="adm" data-ng-model="mk.mks.form"></td>-->
                        <td><input type="number" max="100" min="0" value="0" name="mk[score][]" data-ng-model="s.score" required></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!--<p><button type="submit" >Save</button></p>-->
        <p><button type="submit" data-ng-click="mk.fetch()">Save</button></p>
            <!--<p><button type="submit" onclick="q1_postForm('#mk_form')">Save</button></p>-->
    </form>

    <!--************************************************************************************************************-->
    <form   role="form" id="mk_form" style="display: none;">
        <!--<form   role="form" id="mk_form"  action="self" method="post">-->
        <div class="row  w3-light-gray w3-center">
            <div class="col-md-3 col-lg-2 w3-card">
                <h3>Exam</h3>
                <select data-ng-model="mk.mks.examId" name="mk[examId]" required class="w3-selct">
                    <option data-ng-disabled value="">Exam</option>
                    <option value="{{exam.examId}}" data-ng-repeat="exam in mk.exams">{{exam.name}}</option>
                </select>
            </div>

            <div class="col-md-3 col-lg-2 w3-card">
                <h3>Subject</h3>
                <select data-ng-model="mk.mks.subjectId" name="mk[subjectId]" required class="w3-selct">
                    <option data-ng-disabled value="">Suject</option>
                    <option data-ng-repeat="sub in mk.subjects" value="{{sub.subjectId}}">{{sub.short_name}} </option>
                </select>
            </div>
            <div class="col-md-3 col-lg-2 w3-card">
                <h3>Term</h3>
                <select data-ng-model="mk.mks.term" name="mk[term]" required class="w3-selct">
                    <option data-ng-disabled value="">Term</option>
                    <option data-ng-repeat="t in ['One', 'Two', 'Three']" value="{{1 + $index}}">Term {{1 + $index}} ({{t}}) </option>
                </select>
            </div>
            <div class="col-md-3 col-lg-2 w3-card">
                <h3>Form</h3>
                <select data-ng-model="mk.mks.form" name="mk[form]" required class="w3-selct">
                    <option data-ng-disabled value="">Form</option>
                    <option data-ng-repeat="f in ['One', 'Two', 'Three', 'Four']" value="{{1 + $index}}">Form {{1 + $index}} ({{f}}) </option>
                </select>
            </div>
            <div class="col-md-3 col-lg-2 w3-card">
                <h3>Year</h3>
                <select data-ng-model="mk.mks.year" name="mk[year]" required class="w3-selct">
                    <option data-ng-disabled value="">Year</option>
                    <option data-ng-repeat="y in [2016, 2017, 2018, 2019, 2020, 2021]" value="{{y}}">{{y}} </option>
                </select>
            </div>
            <!--<table class="w3-table" data-ng-show="mk.show_table === true">-->
            <table class="w3-table" data-ng-init="filter">
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
                <tbody>
                    <tr data-ng-repeat="s in mk.students|orderBy:['form', 'adm']|filter:{form:mk.mks.form}" data-ng-if="mk.mks.form !== undefined && mk.mks.subjectId !== undefined">
                        <td>{{1 + $index}} </td>
                        <td>{{s.adm}}<input type="hidden" value="{{s.adm}}" name="mk[adm][]" data-ng-model="mk.mks['ad']['adm' + $index]"></td>
                        <!--<td style="display:none"><input type="hidden" value="{{idz}}" name="mk[studentId][]" data-ng-model="mk.mks['studentId'][mk.studentId+'']" ></td>-->
                        <td style="display:none"><input type="hidden" value="{{s.studentId}}" name="studentId" data-ng-model="mk.mks['studentId']['id' + $index]" ></td>
                        <td>{{s.name|uppercase}}</td>
                        <td>{{s.form}} <input type="hidden" value="{{s.form}}" name="form" data-ng-model="mk.form"></td>
                        <!--//<td>{{s.form}} <input type="hidden" value="{{d}}" name="adm" data-ng-model="mk.mks.form"></td>-->
                        <td><input type="number" max="100" min="0" value="0" name="mk[score][]" data-ng-model="mk.mks['score']['sr' + s.studentId]" required></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!--<p><button type="submit" >Save</button></p>-->
        <p><button type="submit" data-ng-click="mk.fetch()">Save</button></p>
            <!--<p><button type="submit" onclick="q1_postForm('#mk_form')">Save</button></p>-->
    </form>
</div>
<p style="display: none"><button class="w3-red w3-button" type="submit" onclick="q_postForm('#mk_form')">Save</button></p>
<div class="w3-container" style="display: none">
    <pre>
        <?php
        var_dump($_POST);
        ?>
    </pre>
</div>
<form id="form2" action="self" method="post" class="w3-form w3-teal w3-card w3-container" style="display: none">
    <div class="w3-container w3-gray" data-ng-repeat="i in [1, 2]">
        <p>
            <label>Name
                <input type="text" name="data[name][]">
            </label>
        </p>
        <p>
            <label>Age
                <input type="text" name="data[age][]">
            </label>
        </p>
    </div>
    <div>
        <button onclick="q1_postForm('#form2')" type='submit'>Post Data</button>

    </div>

</form>
<!--    <form id="form2" onsubmit="return false" class="w3-form w3-teal w3-card">
        <div class="w3-container w3-gray" data-ng-repeat="i in [1, 2]">
            <p>
                <label>Name
                    <input type="text" name="[name][]">
                </label>
            </p>
            <p>
                <label>Age
                    <input type="text" name="[age][]">
                </label>
            </p>
        </div>
        <div>
            <button onclick="q_postForm('#form2')" type='submit'>Post Data</button>

        </div>

    </form>-->