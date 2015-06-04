<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Piano Roll</title>
		<link rel="stylesheet" href="Roll.css">
		<!--[if lt IE 9]><script src="http://code.jquery.com/jquery-1.11.1.min.js"></script><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]--><!--[if gte IE 9]><!--><script src="http://code.jquery.com/jquery-2.1.1.min.js"></script><!--<![endif]-->
	</head>
	<body>
		<?php
			$piece = $_GET('piece');
			$json = json_decode(file_get_contents('JSON/' + $piece + '.json'), true);
			$rollstyle = $json['rolltype'];
			$tp = $json['allnotes']['tracks'][0]['notes'][0]['pitch'];
			$bp = $tp;
			foreach ($json['allnotes']['tracks'] as $track) {
				foreach ($track['notes'] as $note) {
					$pitch = $note['pitch'];
					$tp = $pitch > $tp ? $pitch : $tp;
					$bp = $pitch < $bp ? $pitch : $bp;
				}
			}
			$height = 168/($tp-$bp);
			$maxright = 0;
			foreach ($json['allnotes']['tracks'] as $track) {
				$part = $track['number'];
				$type = $track['type'] ?? 4;
				foreach ($track['notes'] as $note) {
					$part = $rollstyle > 1 ? $note['pitch'] % 12 : $part;
					$x = $note['start'] + 200;
					$y = ($tp - $note['pitch'] - 1)*$height/2 + 3;
					$width = $note['end'] - $note['start'] - 1;
					if ($part > 1 && $rollstyle == 1) {
						echo '<div class="note sp12" style="left:' + ($x - 5) + ';top:'+ $y +'vh;"><div class="spu" style="border-bottom-width:' + ($height/2) + 'vh;"></div><div class="spd" style="border-top-width:' + ($height/2) + 'vh;"></div></div>';
					} else {
						switch ($type) {
							case 0:
								echo '<div class="note part' + $part + '" style="width:' + $width + ';left:' + $x + ';height:' + $height + 'vh;top:' + $y + 'vh;border-radius:' + ($width/2) + 'px / ' + ($height/2) + 'vh;"></div>';
								break;
							case 1:
								echo '<div class="note part' + $part + '" style="width:' + $width + ';left:' + $x + ';height:' + $height + 'vh;top:' + $y + 'vh;border-radius:' + ($width/4) + 'px / ' + ($height/2) + 'vh;"></div>';
								break;
							case 2:
								echo '<div class="note part' + $part + '" style="width:' + $width + ';left:' + $x + ';height:' + $height + 'vh;top:' + $y + 'vh;border-radius:' + ($width/3) + 'px / ' + ($height/2) + 'vh;"></div>';
								break;
							case 3:
								echo '<div class="note part' + $part + '" style="width:' + $width + ';left:' + $x + ';height:' + $height + 'vh;top:' + $y + 'vh;border-radius:' + ($height/2) + 'vh;"></div>';
								break;
							case 4:
								echo '<div class="note part' + $part + '" style="width:' + $width + ';left:' + $x + ';height:' + $height + 'vh;top:' + $y + 'vh;"></div>';
								break;
							case 5:
								echo '<div class="note sp' + $part + '" style="left:' + $x + ';top:' + $y + 'vh;"><div class="spu" style="border-bottom-width:' + ($height/2) + 'vh;border-left-width:' + ($width/2) + 'px;border-right-width:' + ($width)/2 + 'px;"></div><div class="spd" style="border-top-width:' + ($height/2) + 'vh;border-left-width:' + ($width/2) + 'px;border-right-width:' + ($width)/2 + 'px;"></div></div>';
								break;
							case 6:
								echo '<div class="note sp' + $part + '" style="left:' + $x + ';top:' + $y + 'vh;"><div class="spu" style="border-bottom-width:' + ($height/3) + 'vh;border-left-width:' + ($width/2) + 'px;border-right-width:' + ($width)/2 + 'px;"></div><div class="part' + $part + '" style="width:' + $width + ';height:' + ($height/3) + 'vh;"></div><div class="spd" style="border-top-width:' + ($height/3) + 'vh;border-left-width:' + ($width/2) + 'px;border-right-width:' + ($width)/2 + 'px;"></div></div>';
								break;
							case 7:
								echo '<div class="note sp' + $part + ' spu" style="left:' + $x + ';top:' + $y + 'vh;border-bottom-width:' + $height + 'vh;border-left-width:' + ($width/2) + 'px;border-right-width:' + ($width/2) + 'px;"></div>';
								break;
							case 8:
								echo '<div class="note part' + $part + ' perc" style="left:' + $x + ';height:' + $height + 'vh;top:' + $y + 'vh;"></div>';
								break;
							case 9:
								echo '<div class="note part12 perc" style="left:' + $x + ';height:' + $height + 'vh;top:' + $y + 'vh;"></div>';
								break;
						}
					}
					$maxright = $note['end'] > $maxright ? $note['end'] : $maxright;
				}
			}
			echo '<audio src="MP3/' + $piece + '.mp3"></audio>';
			echo '<h1 id="info">' + $json['name'] + ' - ' + $json['composer'] + '</h1>';
			echo '<div id="scrollallow" style="right:' + $maxright + ';"></div>';
		?>
		<div id="now"></div>
		<button class="but" id="play">&#9654</button>
		<button class="but" id="pause"><strong>ll</strong></button>
		<button class="but" id="back">&#9664<strong>l</strong></button>
		<script type="text/javascript">
			$(function(){
				$('body').scrollLeft(0);
				$('#play').click(function(){
					if ($('audio')[0].paused) {
						$('body').scrollLeft($('audio')[0].currentTime*60);
						timer = window.setInterval(function(){
							$('body').scrollLeft($('audio')[0].currentTime*60);
						}, 1000/60.0);
						$('audio').trigger("play");
						$('#info').animate({right:'-2000px'},500);
					}
				});
				$('#pause').click(function(){
					$('audio').trigger("pause");
				});
				$('#back').click(function(){
					$('audio').trigger("pause");
					$('audio')[0].currentTime = 0;
					$('body').scrollLeft(0);
				});
				$('audio').on('pause',function(){
					window.clearInterval(timer);
					$('#info').animate({right:'10px'},500);
				});
			});
		</script>
	</body>
</html>