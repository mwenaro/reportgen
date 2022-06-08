<?php ?>
<h1>User</h1>

<form method="post" action="<?php echo URL; ?>user/create">
    <label>Username</label><input type="text" name="username" /><br />
    <label>Password</label><input type="text" name="password" /><br />
    <label>Role</label>
    <select name="role">
        <?php foreach ($this->roleList as $key => $value) { ?>

            <option value="<?php echo $value['role'] ?>"><?php echo $value['role'] ?></option>
        <?php } ?>
    </select><br />
    <label>&nbsp;</label><input type="submit" />
</form>

<hr />

<table>
    <?php
    if(!empty($this->userList)):
        foreach ($this->userList as $key => $value) {
        echo '<tr>';
        echo '<td>' . $value['userId'] . '</td>';
       echo '<td>' . $value['username'] . '</td>';
        echo '<td>' . $value['role'] . '</td>';
        echo '<td>
                <a href="' . URL . 'user/edit/' . $value['userId'] . '">Edit</a> 
                <a href="' . URL . 'user/delete/' . $value['userId'] . '">Delete</a></td>';
        echo '</tr>';
    }
    endif;
    
    ?>
</table>
