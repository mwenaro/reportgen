<style>
    #wrapper{
        opacity: 0.1;
    }
    .ficha{
        background: #f00 !important;
        color: #000;
        /*opacity:1;*/
    }
    .ndani{
        opacity: 1.0 !important;
        background: #fff !important;
    }
    .login-box{
          opacity: 1;
          margin: 0 auto;
          margin-left: 33.333%;
/*         // border: 10px groove red;*/
          line:height:100%;
    }
    

    
</style>
<div class="login-box w3-half w3-centered">
    <form id="login" action="login/run" method="post" class="w3-card w3-container w3-center w3-centered w3-round" style="background: #fff;width: 80%;margin:  auto;padding: 0;opacity: 1.2;">
        <fieldset>
            <legend class="w3-teal"> Login</legend>
            <div class="form-group">
                <label>Login:   </label><input type="text" name="role" /><br />
            </div>
            <div class="form-group">
                <label>Password:  </label><input type="password" name="password" /><br />
            </div>
            <div class="form-group">
                <button type="submit" />Login<span class="fa  fa-sign-in"></span></button>
            </div>
        </fieldset>

    </form>
</div>
<script>
    $(document).ready(function () {
        // alert('change color');
        $('#wrapper').css({'backgroundColor': '#f00', 'color': '#000', 'opacity': 1});
        $('#login').css({'backgroundColor': '#fff', 'padding': 0, 'opacity': 1});
        $('#wrapper').addClass('ficha');
        $('form#login').addClass('ndani');
    });



</script>