<h2>Dashboard... Logged in only</h2>

<br />
<div class="container-fluid">
    <form id="randomInsert" action="<?php echo URL; ?>dashboard/xhrInsert/" method="post" class="w3-card w3-center">
        <fieldset class="w3-container">
            <figcaption >Form Massage</figcaption>
            <div class="form-group">
                <label>Message</label>
                <input type="text" name="text" />
            </div>
            <div class="form-group">
                <input type="submit" />
            </div>
    </form>
</fieldset>
<br />

<div id="listInserts">

</div>
</div>