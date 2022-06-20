<div>
    <h3 class="w3-center">Chose Form to Print Report</h3>

    <div class="w3-container" style="" data-ng-init="exam_form = '1';forms = [1, 2, 3, 4]">

        <div class="select2-container w3-half w3-row" >
            <select data-ng-model="exam_form"  required class="w3-select col-md-9 col-lg-9" data-ng-blur="repo.setForm(exam_form)" style="border:solid 15px #e5e5e5;border-radius: 5px;padding:10px">
                <option data-ng-disabled value="">--Select Form--</option >
                <!--<option data-ng-repeat="e in mk.courses" value="{{e.course}}">{{e.short_name}}  {{e.form}}</option>-->
                <option  value="1" >Form  1</option>
                <option  value="2" >Form  2</option>
                <option  value="3" >Form  3</option>
                <option  value="4" >Form  4</option>

            </select>
            <div>
                <p><button data-ng-click="repo.setForm(exam_form)">Load Data</button></p>
                <!--<form action="http://localhost/pro/graph_new.php" method="post" target="_BLANK" data-ng-if="repo.allowPrinting">-->
                <div class="w3-row">
                    <div class="w3-col-md-4">
                        <form action="http://127.0.0.1:7173/api/report/graph_new.php" method="post" target="_BLANK" data-ng-if="repo.allowPrinting">
                    <!--<input type="hidden" name="data" value="{{repo.data}}">-->
                            <input type="hidden" name="data" value="{{repo.data}}">
                            <p> <button class="w3-btn w3-btn-block btn-primary">Print Reports</button></p>
                        </form>
                    </div>

                    <div class="w3-col-md-4">
                        <form action="http://127.0.0.1:7173/api/report/marklist/graph_new.php" method="post" target="_BLANK" data-ng-if="repo.allowPrinting">
                    <!--<input type="hidden" name="data" value="{{repo.data}}">-->
                            <input type="hidden" name="data" value="{{repo.data}}">
                            <p> <button class="w3-btn w3-btn-block btn-primary">Print Marklists</button></p>
                        </form>
                    </div>

                    <div class="w3-col-md-4">
                        <form action="http://127.0.0.1:7173/api/report/meritlist/graph_new.php" method="post" target="_BLANK" data-ng-if="repo.allowPrinting">
                    <!--<input type="hidden" name="data" value="{{repo.data}}">-->
                            <input type="hidden" name="data" value="{{repo.data}}">
                            <p> <button class="w3-btn w3-btn-block btn-primary">Print Merit Lists</button></p>
                        </form>
                    </div>

                </div>

            </div>
        </div>

    </div>    
</div>






































