
<?php include 'header.php';?>
<?php include 'getPost.php';?>
<?php //echo 'showcase template';?>

<!-- load content from folder of template content -->


<div class="hero">
<?php //echo "SHOWCASETEMPLATE";?>
  <? //echo  $tt . $currentPost; ?> <?php //echo $siteUrl . $dl . '?post=' . $currentPost; ?>
  <center>
    <img class="responsive showcase" src="/showcase/img/<? echo $tt; ?>-header.jpg" class="<?php echo $tt; ?>"  data-id="<?php echo $tt;?>" data-link="<?php echo $siteUrl . $dl . '?post=' . $currentPost; ?>" alt="<? echo $tt; ?>">
  </center>
</div>
<div id="content showcase-<?php echo $currentPost;?>" class="site-content">
ß
  <div class="container showcase-content">
     <div class="breadcrumb">
      <!-- TEMPLATE THIS AREA TO INSERT FROM ARRAY -->
      <?php if ($prevPost >= 0): ?>
            &nbsp;  <a href="?post=<?php echo $prevPost; ?>" title="ELI &amp; SIR BRANDING">&lt;&lt; PREV</a>&nbsp;
      <?php endif; ?>
      <?php if ($nextPost < $totalPosts): ?>
            &nbsp;  <a href="?post=<?php echo $nextPost; ?>" title="FELLOWS 2016 CONFERENCE WEBSITE &amp; EMAIL">NEXT &gt;&gt;</a>&nbsp;
      <?php endif; ?>
    </div>

  </div>

  <div id="content showcase-<?php echo $currentPost;?>" class="site-content content-<?php echo $currentPost;?>">
  <!-- showcase.php -->
    <?php
    // echo $nextPost[0];
  echo $cc;
   // if ($currentPost >= 0 && $currentPost < $totalPosts) {
   //     $content = file_get_contents($posts[$currentPost]);
   //     $title = basename($posts[$currentPost], '.php');
   //     echo $content ;
   // } else {
   //     echo "No posts found.";
   // }
   ?>
  </div>
  <div class="container">
      <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12">

            <div class="showcase-navigation">
              <center>
                <?php if ($prevPost >= 0): ?>
                  <div class="previous">
                    <a href="?post=<?php echo $prevPost; ?>"><< PREV</a>
                  </div><div class="split"> | </div>
                <?php endif; ?>
                <?php if ($nextPost < $totalPosts): ?>
                  <div class="next">
                    <a href="?post=<?php echo $nextPost; ?>">NEXT >></a>
                  </div>
                <?php endif; ?>




              </center>
            </div>

        </div>
      </div>
    </div>

  </div>

<?php include 'footer.php';?>
