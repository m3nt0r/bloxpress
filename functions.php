<?php

/**
 *  BloxPress2
 *  ----------------------
 *  Copyright (C) 2006, Kjell Bublitz
 *  www.bloxpress.org / m3nt0r.de@gmail.com
 *
 *  Bloxpress Core
 *
*/

// Basic definitions
// =========================================================================
define( 'BP_VERSION', '1.6' );

// Path Constants
// =========================================================================
if (!defined('DS')){define('DS', DIRECTORY_SEPARATOR);}

define( 'BP_BASEDIR', TEMPLATEPATH );
define( 'BP_URLPATH', '/wp-content/themes/bloxpress');
define( 'BP_BASEURL', get_option('home') );
define( 'BP_THEMEURL', BP_BASEURL.BP_URLPATH );
define( 'BP_LIBDIR', BP_BASEDIR . DS . 'libraries' );
define( 'BP_CLASSDIR', BP_BASEDIR . DS . 'classes' );

// Include libraries
// =========================================================================
require_once(BP_LIBDIR . DS . 'basics.php');

// Include classes
// =========================================================================
require_once(BP_CLASSDIR . DS . 'class.Bloxpress.php');
require_once(BP_CLASSDIR . DS . 'class.BloxpressSidebar.php');
require_once(BP_CLASSDIR . DS . 'class.BloxpressWidget.php');

// Init the System
// =========================================================================
$bloxpress = new Bloxpress();
$sidebars = $bloxpress->getSidebars();


// Template Function
// =========================================================================
function renderSidebar($num){
	global $sidebars, $bloxpress;

	$array_num = $num - 1;
	$sidebar_id = 'sidebar-'.$num;
	
	if(is_array($sidebars)) {
		if(is_object($sidebars[$sidebar_id])) {
			$sidebarHtml = $sidebars[$sidebar_id]->getSidebarHTML();
		}
	}
	
	// use bp_widget html, or wp_widget html, or theme html 
	if(isset($sidebarHtml) && !empty($sidebarHtml)) {
		echo $sidebarHtml;
		return true;
	} else {
		if(in_array($sidebar_id, $bloxpress->columns)) {
			return dynamic_sidebar($num);
		}
	} 
	return false;
}


// GET handler for ajax. 
// =========================================================================
if($_GET['bloxpress'])
{
	if($_GET['bloxpress']=='block' && $_GET['load'])
	{
		if(in_array($_GET['load'], array_keys($bloxpress->widgets))) {
			$widget = new BloxpressWidget($_GET['load'], $bloxpress->setup);
			echo $widget->getWidgetHTML();
		}
	}
	
	if($_GET['bloxpress']=='blocklist')
	{
		require_once(BP_CLASSDIR . DS . 'class.Services_JSON.php');
		header('Content-type: application/json');
		$json = new Services_JSON();
		echo $json->encode($bloxpress->widgets); 
	}
	
	exit(); // always end, if ajax.
}

?>