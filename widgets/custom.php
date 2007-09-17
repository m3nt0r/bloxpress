<?php
/**
 *  BloxPress2
 *  ----------------------
 *  Copyright (C) 2006-2007, Kjell Bublitz
 *  www.bloxpress.org / m3nt0r.de@gmail.com
 *
 *  Bloxpress Custom Widgets
*/

// Bloxpress Error Widget
// =========================================================================
function bp_widget_error($args) {
		extract($args);
				
		$widgetHTML.= $before_widget;
		$widgetHTML.= $before_title . __('Error') . $after_title;
		$widgetHTML.= $error_message;
		$widgetHTML.= $after_widget;
		
		echo $widgetHTML;
}


// Search Widget Replacement
// =========================================================================
function bp_widget_search($args) {
		extract($args);
				
		$widgetHTML.= $before_widget;
		$widgetHTML.= $before_title . __('Search') . $after_title;
		$widgetHTML.= '<form id="searchform" method="get" action="'.get_bloginfo('home').'">';
		$widgetHTML.= '<div>';
		$widgetHTML.= '	<input type="text" name="s" id="s" size="15" style="width:80%" />';
		$widgetHTML.= '	<input type="submit" value="'.attribute_escape(__('Search')).'" />';
		$widgetHTML.= '</div>';
		$widgetHTML.= '</form>';
		$widgetHTML.= $after_widget;
		
		echo $widgetHTML;
}


// Posts Widget - Wordpress Loop
// =========================================================================
function bp_widget_posts($args) {
		global $wp;
		extract($args);
		do_action('init');
		$wp->parse_request();
		$wp->build_query_string();
		$wordpress = new WP_Query($wp->query_string);
		
		echo $before_widget;
		echo $before_title . __('Posts') . $after_title;
		
		include(BP_BASEDIR.DS.'posts.php');
		
		echo $after_widget;
}


// =========================================================================

	// error
	wp_register_sidebar_widget('error', __('Error Message'), 'bp_widget_error', array('classname' => 'widget_error'));

	// search
	unregister_sidebar_widget('search');
	wp_register_sidebar_widget('search', __('Search'), 'bp_widget_search', array('classname' => 'widget_search'));

	// posts
	wp_register_sidebar_widget('posts', __('Posts'), 'bp_widget_posts', array('classname' => 'widget_posts'));

?>