<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
	<head profile="http://gmpg.org/xfn/11">
		<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />
		<meta name="generator" content="WordPress <?php bloginfo('version'); ?>" /> <!-- leave this for stats -->
		
		<title><?php if(is_single()||is_page()): ?><?php wp_title(); ?> | <?php endif; ?><?php bloginfo('name'); ?></title>
		
		<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.3.0/build/fonts/fonts-min.css">
		<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.3.0/build/container/assets/skins/sam/container.css">
		<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.3.0/build/button/assets/skins/sam/button.css">
			
		<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen" />
		<link rel="stylesheet" href="<?php bloginfo('template_directory'); ?>/addon.css" type="text/css" media="screen" />
		
		<link rel="alternate" type="application/rss+xml" title="<?php bloginfo('name'); ?> RSS Feed" href="<?php bloginfo('rss2_url'); ?>" />
		<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />

		<script type="text/javascript">var baseUrl = '<?php echo get_option('home'); ?>';</script>
		<script id="jquery-1_2_6" src="<?php bloginfo('template_directory'); ?>/javascript/jquery-1.2.6.min.js" type="text/javascript"></script>
		<script id="jquery-ui-1_5_2_core" src="<?php bloginfo('template_directory'); ?>/javascript/ui/ui.core.min.js" type="text/javascript"></script>
		<script id="jquery-ui-1_5_2_drag" src="<?php bloginfo('template_directory'); ?>/javascript/ui/ui.draggable.min.js" type="text/javascript"></script>
		<script id="jquery-ui-1_5_2_drop" src="<?php bloginfo('template_directory'); ?>/javascript/ui/ui.droppable.min.js" type="text/javascript"></script>
		<script id="jquery-ui-1_5_2_sort" src="<?php bloginfo('template_directory'); ?>/javascript/ui/ui.sortable.min.js" type="text/javascript"></script>
		<script type="text/javascript" id="bloxpress-1_7" src="<?php bloginfo('template_directory'); ?>/javascript/bloxpress.js"></script>
		
		<?php wp_head(); ?> 
	</head>
	<body class="yui-skin-sam">
		<div id="wrap">
			<div id="header" class="content">
				<h1><a href="<?php echo get_option('home'); ?>/"><?php bloginfo('name'); ?></a></h1>
				<span class="description"><?php bloginfo('description'); ?></span>
			
				<div id="menuline">
					<span class="yui-button yui-push-button"><span class="first-child"><button type="button" class="button-addwidgets">Add new Widgets</button></span></span>
				</div>
				<br clear="all" />
			</div>
			<div id="main" class="content">
				

				
				<!-- Here ends the header.php -->

