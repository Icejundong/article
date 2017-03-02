<?php
    echo $_POST['username'];
    echo $_POST['password'];
?>

<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>数据接收实例</title>
    </head>
    <body>
        <form action="" method="post">
            <label>用户名:</label>
            <input type="text" name="username"><br>
            <label>密码：</label>
            <input type="text" name="password"><br>
            <input type="submit" value="提交">
        </form>
    </body>
</html>