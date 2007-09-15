<?php

function bp_widget_search($args) {
		extract($args);
				
		$widgetHTML.= $before_widget;
		$widgetHTML.= $before_title . __('Search') . $after_title;
		$widgetHTML.= '<form id="searchform" method="get" action="'.get_bloginfo('home').'">';
		$widgetHTML.= '<div>';
		$widgetHTML.= '	<input type="text" name="s" id="s" size="15" /><br />';
		$widgetHTML.= '	<input type="submit" value="'.attribute_escape(__('Search')).'" />';
		$widgetHTML.= '</div>';
		$widgetHTML.= '</form>';
		$widgetHTML.= $after_widget;
		
		echo $widgetHTML;
}



$class['classname'] = 'widget_search';
wp_register_sidebar_widget('search', __('Search'), 'bp_widget_search', $class);
?>