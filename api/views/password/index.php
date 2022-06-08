<?php
$msg = true !== $this->msg ? $this->msg : "Your Password has been Successfully Reset!";
?>
<h3><?php $this->title ?></h3>

<form action="<?php echo URL; ?>password/reset">
    <p>
        <label></label>
        <input type="text" name="userId" value="" />
    </p> 
    <p>
        <label>
            <input type="password" name="password" value="" />
        </label>
    </p>  

    <bution type="submit" class=""></bution>
    <p>
        <?php echo $msg;?>
    </p>
</form>