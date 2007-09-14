<?php

/**
 *  BloxPress2
 *  ----------------------
 *  Copyright (C) 2006-2007, Kjell Bublitz
 *  www.bloxpress.org / m3nt0r.de@gmail.com
 *
 *  Bloxpress Widget Class
 *  
 *  Responsible for loading a single widget
 *
*/

class BloxpressWidget {
	
	var $name;
	var $setup;
	var $html;
	
	function BloxpressWidget($name, $setup=null) {
		global $bloxpress;
		
		$this->name = $name;
		$this->setup = (!empty($setup))?$setup:$bloxpress->setup;
		
		$this->loadWidget();
	}
	
	function loadWidget() {
		global $bloxpress;
		
		if(!in_array($this->name, array_keys($bloxpress->widgets))) {
			$this->html = "{$this->name} is not registered!";
		}
		else {
			$widget_id = $bloxpress->attachRandomId($this->name);
			$widget_class = $bloxpress->widgets[$this->name]['classname'];
			$widget_params = $bloxpress->widgets[$this->name]['params'];
			$widget_callback = $bloxpress->widgets[$this->name]['callback'];
			
			// merge and update parameters
			$params = array_merge(array($this->setup), (array) $widget_params);
			$params[0]['before_widget'] = sprintf($params[0]['before_widget'], $widget_id, $widget_class);
			
			ob_start();
			if(is_callable($widget_callback)) {
				call_user_func_array($widget_callback, $params);
				$this->html = ob_get_contents();
			} else {
				$this->html = "{$widget_callback} is not callable!";
			}
			ob_clean();
		}
	}
	
	function getWidgetHTML() {
		return $this->html;	
	}

}

?>