</div> <!--End of div.content//-->

</div> <!--End of div.main//-->

<footer id="footer"class=" w3-round w3-container" >

    (C) Footer


</footer>

</div> <!--//End of div.containter//--->



<!--Jquery-->

<?php if(2===3): ?>
<script src="../public/js/jquery.js" type="text/javascript"></script>
<script src="<?php echo URL; ?>public/js/jquery/jquery-2.2.4.min.js"></script>
<script src="<?php echo URL; ?>public/js/bootstrap/bootstrap.min.js"></script>

<?php endif;?>



<script>
$('document').ready(function () {

$('#btnYetu').click(function () {

if (!$('#formSelect').val() == '') {
$('#disgo').css('display', 'block');
// $('tblMarks').attr('id','appear');
//$('tblMarks').css('display', 'block');
} else
{
//                $('#tbl-marks').css('display', 'none');
}
});
});

</script>



</body>

</html>