<?php
/**
 *  BloxPress2
 *  ----------------------
 *  Copyright (C) 2006-2007, Kjell Bublitz
 *  www.bloxpress.org / m3nt0r.de@gmail.com
 *
 *  Bloxpress Custom Widgets
*/


// Search Widget Replacement
// =========================================================================
function bp_widget_search($args) {
		extract($args);
				
		$widgetHTML.= $before_widget;
		$widgetHTML.= $before_title . __('Search') . $after_title;
		$widgetHTML.= '<form id="searchform" method="get" action="'.get_bloginfo('home').'">';
		$widgetHTML.= '<div>';
		$widgetHTML.= '	<input type="text" name="s" id="s" size="15" />';
		$widgetHTML.= '	<input type="submit" value="'.attribute_escape(__('Search')).'" />';
		$widgetHTML.= '</div>';
		$widgetHTML.= '</form>';
		$widgetHTML.= $after_widget;
		
		echo $widgetHTML;
}
unregister_sidebar_widget('search');
wp_register_sidebar_widget('search', __('Search'), 'bp_widget_search', array('classname' => 'widget_search'));
// =========================================================================





?>