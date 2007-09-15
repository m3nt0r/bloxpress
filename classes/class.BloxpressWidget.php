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
	
	var $widget_id = 'widget';
	var $widget_class = 'widget';
	var $widget_params = array();
	var $widget_callback = null;
	
	function BloxpressWidget($name, $setup=null) {
		global $bloxpress;
		
		$this->name = $name;
		$this->setup = (!empty($setup))?$setup:$bloxpress->setup;
		
		$this->loadWidget();
	}
	
	function initWidget() {
		global $bloxpress;
		
		if(in_array($this->name, array_keys($bloxpress->widgets)))
		{
			$this->widget_id = $this->_randomId($this->name);
			$this->widget_class = $bloxpress->widgets[$this->name]['classname'];
			$this->widget_params = $bloxpress->widgets[$this->name]['params'];
			$this->widget_callback = $bloxpress->widgets[$this->name]['callback'];
			
			$this->fillSetup();
			return true;
		}
		else {
			$this->_error('The "'.ucfirst($this->name).'" widget is not available.');
			return false;
		}
	}
	
	function getWidgetHTML() {
		return $this->html;	
	}	
	

	function callWidget() {
		
		if(is_callable($this->widget_callback)) {
			ob_start();
			call_user_func_array($this->widget_callback, $this->widget_params);
			$this->html = ob_get_contents();
			ob_clean();
		} else {
			$this->_error($this->widget_callback.' is not callable.');
		}
		
	}
	
	function fillSetup() {
		$this->widget_params = array_merge(array($this->setup), (array) $this->widget_params);
		$before_widget = sprintf($this->widget_params[0]['before_widget'], $this->widget_id, $this->widget_class);
		$this->widget_params[0]['before_widget'] = $before_widget;
	}
	
	
	function loadWidget()
	{
		$this->initWidget();
		$this->callWidget();
	}
	

	function _error($msg){
		global $bloxpress;
		
		$this->widget_id =  $this->_randomId('widget_error');
		$this->widget_class = 'widget_error';
		$this->widget_callback = 'bp_widget_error';
		$this->fillSetup();
		$this->widget_params[0]['error_message'] = $msg;
	}
	
	
	function _randomId($id) {
		global $bloxpress;
		return $bloxpress->attachRandomId($id);
	}
}

?>