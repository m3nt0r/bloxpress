<?php

/**
 *  BloxPress2
 *  ----------------------
 *  Copyright (C) 2006-2007, Kjell Bublitz
 *  www.bloxpress.org / m3nt0r.de@gmail.com
 *
 *  Bloxpress Sidebar Class
 *  
 *  Responsible for loading a single sidebar
 *
*/

class BloxpressSidebar {

	var $layout;
	var $setup;
	var $widgets;
	var $html;
	
	function BloxpressSidebar($layout, $setup) {
		$this->layout = $layout;
		$this->setup = $setup;
		
		$this->loadSidebar();
	}
	
	function loadSidebar()
	{
		foreach($this->layout as $widget_name)
		{
			$this->widgets[$widget_name] = new BloxpressWidget($widget_name, $this->setup);
			$this->html.= $this->widgets[$widget_name]->getWidgetHTML();
		}
	}
	
	function getSidebarHTML() {
		return $this->html;
	}
	
}

?>