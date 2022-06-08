<form id="signup_form" name="signup_form" role="form" ng-submit="signup()" novalidate>
    <div class="form-group" show-errors>
        <input type="email"
               name="email"
               placeholder="Email"
               class="form-control"
               ng-model="credentials.email"
               required
               autofocus />
        <p class="help-block" ng-show="signup_form.email.$error.required">Email is required.</p>
        <p class="help-block" ng-if="signup_form.email.$error.email">Must be a valid email.</p>
    </div>
    <div class="form-group" show-errors>
        <input type="text"
               name="username"
               placeholder="Username"
               class="form-control"
               ng-model="credentials.username"
               ng-minlength=5
               required
               ng-unique="{key: 'users', property: 'username'}"
               autofocus />
        <span class="glyphicon glyphicon-ok form-control-icon success"></span>
        <p class="help-block" ng-show="signup_form.username.$error.required">Username is required.</p>
        <p class="help-block" ng-if="signup_form.username.$error.minlength">Must be at least 5 characters.<
        <p class="help-block" ng-show="signup_form.username.$error.unique">Username is already taken.</p>
    </div>
    <div class="form-group" show-errors>
        <input type="password"
               name="password"
               placeholder="Password"
               class="form-control"
               ng-model="credentials.password"
               required />
        <p class="help-block" ng-show="signup_form.password.$error.required">Password is required.</p>
    </div>
    <div class="form-group">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fa fa-lock"></i> Signup</button>
    </div>
</form>
