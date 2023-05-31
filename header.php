<?php
$dl =  $_SERVER['PHP_SELF'];
$siteUrl="http://sdelgadocv:8888";
$imgUrl="/showcase/img/";
$nav = array(

   array('/index.php', 'Home', 'item','link', 'null','null'),
   array('/showcase.php', 'Showcase', 'dropdown','dropdown-toggle', 'data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"',
     array(
         array('/showcase.php?post=2', 'PULSEGALA 2015', 'link', 'child-item'),
         array('/showcase.php?post=0', 'TCT INTERNATIONAL', 'link', 'child-item'),
         array('/showcase.php?post=1', 'I WRITE NY', 'link', 'child-item')
       )
     ),
   array('/code.php', 'Code Snippets', 'item', 'link', 'null','null'),
   // array('/abstracts.php', 'Abstracts', 'item', 'link','', 'null'),
   // array('/contact.php', 'Contact/Resume', 'dropdown','dropdown-toggle', 'data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"',
   //   array(
   //       array('/industry.php', 'Industry Support', 'link', 'child-item'),
   //       array('/exhibitor.php', 'Exhibitor Listing', 'link', 'child-item')
   //     )
   //   ),
   array('/contact.php', 'Contact / Resume', 'item','link', 'null','null')
   // ,
   // array('/register.php', 'Register', 'item', 'register','', 'null')



 );
?>
<?php
function createNav($nav){


  foreach($nav as $n){
      // $first_token  = strtok($_SERVER['REQUEST_URI'] , '/');
      // $second_token = strtok('/');
      // var_dump($first_token, $second_token);
          $c;
            if ($_SERVER['PHP_SELF']== $n[0]){
              $c = $n[1];
              $active = 'active ';
               //echo 'true';
            } else {
               $active = '';
              //  echo 'false';
            };



            if ($n[1] =='Showcase'){
              echo '<li class="'. $active . $n[2] .'"><a class="nav-link '.$n[3].'" href="'.$n[0].'"'.$n[4].'>'. $n[1] .'</a>';
                echo '<ul class="sub-menu dropdown-menu" aria-labelledby="navbarDropdown">';
                        foreach($n[5] as $sn){
                          if ($_SERVER['PHP_SELF']== $sn[0]){
                              $c = $n[1];
                          }
                                // echo $n[1];
                                    echo '<li id="menu-item-'.$sn[2].'" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-'.$sn[2].' '.$sn[2].'">
                                    <a class=" dropdown-item '.$sn[3].'" href="'.$sn[0].'">'. $sn[1] .'</a>';

                              }
                 echo '</ul>
                </li>';

            }else {

                echo '<li class="'. $active . $n[2] .'"><a class="nav-link '.$n[3].'" href="'.$n[0].'"'.$n[4].'>'. $n[1] .'</a>';

            }
         echo '</li>';$GLOBALS['current'] = $c;
  }

};
?>
<!doctype html>
<html class="no-js" lang="">
   <head>
       <meta charset="utf-8">
       <meta http-equiv="x-ua-compatible" content="ie=edge">
       <title>Susan Delgado</title>
       <meta name="description" content="">
       <meta name="viewport" content="width=device-width, initial-scale=1">

     <!--   <link rel="apple-touch-icon" sizes="57x57" href="/fav/apple-icon-57x57.png">
       <link rel="apple-touch-icon" sizes="60x60" href="/fav/apple-icon-60x60.png">
       <link rel="apple-touch-icon" sizes="72x72" href="/fav/apple-icon-72x72.png">
       <link rel="apple-touch-icon" sizes="76x76" href="/fav/apple-icon-76x76.png">
       <link rel="apple-touch-icon" sizes="114x114" href="/fav/apple-icon-114x114.png">
       <link rel="apple-touch-icon" sizes="120x120" href="/fav/apple-icon-120x120.png">
       <link rel="apple-touch-icon" sizes="144x144" href="/fav/apple-icon-144x144.png">
       <link rel="apple-touch-icon" sizes="152x152" href="/fav/apple-icon-152x152.png">
       <link rel="apple-touch-icon" sizes="180x180" href="/fav/apple-icon-180x180.png">
       <link rel="icon" type="image/png" sizes="192x192"  href="/fav/android-icon-192x192.png">
       <link rel="icon" type="image/png" sizes="32x32" href="/fav/favicon-32x32.png">
       <link rel="icon" type="image/png" sizes="96x96" href="/fav/favicon-96x96.png">
       <link rel="icon" type="image/png" sizes="16x16" href="/fav/favicon-16x16.png">
       <link rel="manifest" href="/fav/manifest.json">
       <meta name="msapplication-TileColor" content="#ffffff">
       <meta name="msapplication-TileImage" content="/fav/ms-icon-144x144.png">
       <meta name="theme-color" content="#ffffff"> -->
       <!-- Place favicon.ico in the root directory -->

       <!-- <link rel="stylesheet" href="css/bootstrap.min.css"> -->
       <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

<!-- STYLESHEETS LINKS FROM SDELGADO -->
    <link type="text/css" rel="stylesheet" href="css/font-awesome.min.css"/>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i,800,800i" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans|Open+Sans+Condensed:300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://use.typekit.net/xwc7tgb.css">

    <link rel="stylesheet" href="css/animate.css">
    <link rel="stylesheet" href="css/style.css">


       <script src="js/vendor/modernizr-2.8.3.min.js"></script>
       <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
       <script src="https://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
       <script src="js/vendor/bootstrap.min.js"></script>
       <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBYaQ_h4LNEnfVOsy_Erg0T2bVIjRmZaSo"></script>



   </head>
   <body class="<?php echo $current; ?> page-template page">
<header class="">    <!--[if lt IE 8]>
           <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
       <![endif]-->
<?php //echo$_SERVER['PHP_SELF']?>
                 <div class="container-fluid">
                       <nav class="navbar navbar-expand-lg navbar-light">
                         <a class="navbar-brand" href="#">SUSAN DELGADO </a>
                         <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                           <span class="navbar-toggler-icon"></span>
                         </button>
                         <div class="collapse navbar-collapse" id="navbarSupportedContent">
                           <ul id="menu-main top-nav" class="navbar-nav ml-auto">
                           <?php createNav($nav) ?>
                           </ul>
                         </div>

                       </nav>
               </div>

               <?php //echo 'it is '.$current.' page'; ?>





<!--
           <li><a href="#">Action</a></li>
           <li><a href="#">Another action</a></li>
           <li><a href="#">Something else here</a></li>
           <li role="separator" class="divider"></li>
           <li><a href="#">Separated link</a></li>
           <li role="separator" class="divider"></li>
           <li><a href="#">One more separated link</a></li> -->

   </header>
