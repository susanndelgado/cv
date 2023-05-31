<?php
// index.php

$postsDirectory = 'showcase/posts/';
$posts = glob($postsDirectory . '*.php');
$totalPosts = count($posts);
$tt;
$cc;

if (isset($_GET['post'])) {
    $currentPost = $_GET['post'];
} else {
    $currentPost = 0;
}

// echo $totalPosts;
$prevPost = $currentPost - 1;
$nextPost = $currentPost + 1;
// echo $currentPost[1];

if ($currentPost >= 0 && $currentPost < $totalPosts) {
   $content = file_get_contents($posts[$currentPost]);
   $title = basename($posts[$currentPost], '.php');
   $GLOBALS['tt'] = $title;
   $GLOBALS['cc'] = $content;
} else {
   echo "No posts found.";
}
?>
<?php //echo "helloWorld";?>
<? //echo $tt . $currentPost; ?> <?php //echo $siteUrl . $dl . '?post=' . $currentPost; ?>
