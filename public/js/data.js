function w3_open() {
                document.getElementsByClassName("w3-sidenav")[0].style.display = "block";
                document.getElementsByIdName("main").style.marginleft = "30%";
                document.getElementsByTagName("footer").style.marginleft = "30%";
            }
            function w3_close() {
                document.getElementsByClassName("w3-sidenav")[0].style.display = "none";
                //                 document.getElementsByIdName("main").style.marginLeft = "30%;
                //                document.getElementsByTagName("footer").style.marginLeft = "30%;
            }
            function myFunc(id) {
    document.getElementById(id).classList.toggle("w3-show");
    //document.getElementById(id).classList.toggle("w3-show");
}