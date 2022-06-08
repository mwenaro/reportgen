<nav class="navbar navbar-inverse" id="main_nav">
    <div class="container-fluid">
        <!--*****************   not loogedIn***********************-->
        <ul class="nav navbar-nav navbar-right">

            <li><a ui-sref="help">Help</a></li>
            <li><a ui-sref="user({userId:'mwero'})"><span >user</span></a></li>
            <li><a ui-sref="login"><span class="fa fa-sign-in">login</span></a></li>
        </ul>

        <!--*****************    loogedIn***********************-->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" ui-sref="home"><span class="fa fa-dashboard" style="margin-right:10px"> Mwero's ReportGen</a>
        </div>
        <ul class="nav navbar-nav">
            <li class="active"><a  ui-sref="home"><span class="fa fa-home w3-xlarge" style="margin-right:10px"></a></li>
            <li><a ui-sref="student">Students</a></li>
            <li><a ui-sref="teacher">Teachers</a></li>
            <li><a ui-sref="mark">Marks</a></li>
            <li><a ui-sref="subject">Subjects</a></li>
            <li><a ui-sref="report">Reports</a></li>
        </ul>

        <ul class="nav navbar-nav navbar-right">
            <li><a ui-sref="logout">Logout</a></li>
            <li><a class="" ui-sref="admin">Admin</a></li>
        </ul>
        <!--*****************    loogedIn***********************-->

    </div>
</nav>