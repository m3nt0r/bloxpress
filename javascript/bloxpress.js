
/**
 *  BloxPress2
 *  ----------------------
 *  Copyright (C) 2006-2007, Kjell Bublitz
 *  www.bloxpress.org / m3nt0r.de@gmail.com
 *
 *  Bloxpress Javascript
 *  
 *  Handling all the interface stuff
 *  @version 1.7
*/

/**
 * Bloxpress Global Variables
 * -------------------------------------------
 */

// Menu / Notify Target
var targetElementID = '#main'; // blockmenu and other things will be temporarly attached to this element
var blockmenuCaption = 'Widget Menu';

// Cookie
var cookieVerbose = true; // show notification if the cookie updates?
var cookieLifetime = 7; // how many days the cookie should be stored?

// Cookie Update Message
var updateMessage = 'Layout saved!';
var updateMessageTime = 500; // Time in miliseconds the message is visible
var updateMessageTop = '0px'; // position of the message 
var updateMessageRight = '0px';

// Cursor
var cursorGrab = 'move'; // default cursor, if a draggable is moved
var cursorNormal = 'pointer'; // default for draggable element
var cursorImageOpen ='wp-content/themes/bloxpress/images/cursor_openhand.cur'; // IE replacement for cursorNormal
var cursorImageClosed = 'wp-content/themes/bloxpress/images/cursor_closedhand.cur'; // IE replacement for cursorGrab

/**
 * Bloxpress Base Object
 * -------------------------------------------
 * Contains some global methods
 */
var Bloxpress = {
	baseUrl: baseUrl,
	appendTarget: targetElementID,
	grabCursor: cursorNormal,
	grabbingCursor: cursorGrab,
	setCursors: function() {
		if( $.browser.opera || $.browser.safari ) {
			this.grabCursor = "move";
			this.grabbingCursor = "move";
		}
		if( $.browser.mozilla ) {
			this.grabCursor = "-moz-grab";
			this.grabbingCursor = "-moz-grabbing";
		}
		if( $.browser.msie ) {
			this.grabCursor = this.baseUrl+"/"+cursorImageOpen;
			this.grabbingCursor = this.baseUrl+"/"+cursorImageClosed;
		}
		cursorNormal = this.grabCursor;
		cursorGrab = this.grabbingCursor;	
	},
	bindCursors: function(selector) {
		var _self = this;
		_self.setCursors();
		return $(selector).css({cursor: _self.grabCursor}).bind("mousedown", function(){
			this.style.cursor = _self.grabbingCursor;
		}).bind("mouseup", function(){	
			this.style.cursor = _self.grabCursor;
		}).bind("mouseout", function(){			
			this.style.cursor = _self.grabCursor;
		});
	},
	getRandom: function(element_id) {
		return element_id + '_' + Math.round(Math.random() * 10000);
	},
	updateCookie: function() {
		var serial = this.sortables.sortable('serialize');
		console.log(serial);
		var cookie = Bloxpress.Cookie.init('bloxpress', serial);
		cookie.update();
	}
};

/**
 * Bloxpress Block Actions
 * ------------------------
 * Min/Max and Remove
 */
Bloxpress.BlockActions = $.extend({
	removeStack: [],
	init: function() {
		this.addEvents($('body').get(0));	
	},
	addEvents: function(scope)
	{		
		this.bindCursors('div.block_handle');
		this.bindClose(scope);
		this.bindMinMax(scope);
	},
	bindClose: function(scope) {
		$('.container-close', scope).bind('click',
			function(evt){
				this.removeBlock($(evt.target).parent().parent());
			}.bind(this)
		);
	},
	bindMinMax: function(scope) {
		$('.container-minmax', scope).toggle(
			function(){
				$(this).parent().children('div.bd').slideUp('fast');
				$(this).removeClass('maxImage').addClass('minImage');
			},
			function(){
				$(this).parent().children('div.bd').slideDown('fast');
				$(this).removeClass('minImage').addClass('maxImage');
			}
		);
	},	
	removeBlock: function(block)
	{
		var _self = this;
		var blockID = $(block).attr('id');
		var timeoutID = _self.getRandom('timeout');
		var interval, timeout, removalAbort, removalElement;
		
		if(_self.isInStack(blockID)) {
			return false;	
		} 
		else {
			_self.removeStack.push(blockID);
			
			interval = window.setInterval(function() {
				var seconds, timeoutElement = $('#'+timeoutID);
				if(timeoutElement.length) {
					timeoutElement.html( parseInt(timeoutElement.html(), 10) - 1 );
				} 
			}, 1000);
			
			timeout = window.setTimeout(function(){
				clearInterval(interval); 
				_self.removeFromStack(blockID); 
				$('#'+blockID).remove();
				_self.updateCookie(); 
			}, 5000);
			
			removalAbort = $('<a href="#stop">Abort</a>').click(function(){ clearTimeout(timeout); _self.removeFromStack(blockID); }).get(0);
			removalElement = $('<div class="ft">Remove? closing in <span id="'+timeoutID+'" style="padding-right:0.3em">5</span>').append(removalAbort);
			$('#'+blockID+' div:first').append(removalElement);
			return true;
		}
	},
	isInStack: function(id) {
		return $.grep(this.removeStack,function(n){ if(n==id){return true;} }).length;
	},
	removeFromStack: function(id) {
		$('#'+id+' div.ft').remove(); 
		var _removeStack = this.removeStack; $.grep(_removeStack, function(n,i){ if(n==id){ _removeStack.splice(i,1); } });
	}
}, Bloxpress);


/**
 * Bloxpress DragDrop Component
 * ------------------------
 * Defines a droppable Area and handles onDrop requests made by Menu-Items
 */
Bloxpress.DragDrop = $.extend({
	init: function() 
	{
		Bloxpress.BlockActions.init();
		this.makeSort();
		this.makeDrop();
	},
	makeDrop: function() 
	{
		var _self = this;
		this.droppables = $('.dropspot').droppable(
			{
			//	tolerance: 'intersect',
				activeClass: 'dropzonehover',
				accept : function(obj){ return obj.hasClass('blockitem'); },
				drop: function(evt, ui) { _self.spawnBlock(ui); }
			}
		);
	},
	makeSort: function()
	{
		var _self = this;
		this.sortables = $('.sortable').sortable(
			{
				opacity: 0.7, 
				accept : 'block',
				activeClass : 'sortableactive',
				hoverClass : 'sortablehover',
				helperClass : 'sorthelper',
				handle: $('.block_handle'),
				containment: '#layout',
				start: function(block) {
					$(block).css({padding:'0 2px 4px 2px'});
				},
				stop: function(){
					_self.updateCookie();
				},
				change: function(){
					_self.updateCookie();
				},
			}
		);
	},
	spawnBlock: function(ui)
	{
		var droppable = $(ui.element).get(0);
		var draggable = $(ui.draggable).get(0);
		var dropzone = droppable.id;
		var blockId = draggable.id.split('_')[1];
		$.get(this.baseUrl+'/?bloxpress=block&load='+blockId, function(blockContent) { // load the content
			$('#'+dropzone+' ul.sortable').append(blockContent); // add to sortable
			Bloxpress.BlockActions.addEvents($('#'+dropzone+' li.block:last').get(0)); // apply events to new block
			this.updateCookie();
		}.bind(this));
	}
}, Bloxpress);

/**
 * Bloxpress Menu Component
 * ------------------------
 * Reads a JSON response from the server and creates a draggable menu with all available widgets.
 */
Bloxpress.Menu = $.extend({
	init: function()
	{
		this.targetElement = $(this.appendTarget); // get the area we want to append on
		$.getJSON(this.baseUrl+'/?bloxpress=blocklist', function(response){ this.buildMenu(response); }.bind(this) ); // request json list.		
	},
	buildMenu: function(serverBlocks)
	{
		// Create the unordered list
		var blocklist = '<ul id ="blockmenu_list">';
		$.each(serverBlocks, function(i,block){ blocklist+= '<li class="blockitem" id="blockitem_'+block.id+'">'+block.name+'</li>'; });	
		blocklist+='</ul>';
		
		// Wrap a DIV around the list and add a heading to it.	
		var blockmenu = $('<div id="blockmenu"><div class="yui-panel yui-dialog"><div id="blockmenu_handle" class="hd">'+blockmenuCaption+'</div><div class="bd">'+blocklist+'</div><div class="container-close" /></div></div>');	
		$(blockmenu).css({display:'none', position:'absolute', top:'0', left:'0', zIndex:'900'});
		
		// Add it to the Page
		this.targetElement.append(blockmenu);
		
		// Start of with a animation and make the whole Div draggable
		$('div#blockmenu').show(400).draggable({zIndex: 900, handle: $('div#blockmenu_handle')});
		$('div#blockmenu div.container-close').bind("click", function() { $('div#blockmenu').remove(); });
		this.bindCursors('div#blockmenu_handle');
		
		// Make all Listitems draggable
		this.bindCursors('.blockitem').draggable({
			zIndex: 1000, 
			ghosting: true, 
			revert: true, 
			revertDuration: 0.5,
			stop:function(){				
				$(this).fadeTo("fast", 1);
				$(this).css({cursor: cursorNormal});
			} 
		});
	}	
}, Bloxpress);

/**
 * Bloxpress Cookie Component
 * --------------------------
 * Create, Update, Set a real cookie and show a notifier on the screen.
 */
Bloxpress.Cookie = $.extend({
	init: function(cookieName, cookieValue)
	{
		this.cookieName = cookieName;
		this.cookieValue = cookieValue;
		this.cookieVerbose = cookieVerbose;
		this.cookieLife = cookieLifetime;
		return this;
	},
	set: function()
	{
		var today = new Date(), expire = new Date();
		expire.setTime(today.getTime() + 3600000 * 24 * this.cookieLife);
		document.cookie = this.cookieName + "=" + this.cookieValue + ";path=/;expires=" + expire.toGMTString();
	},
	remove: function()
	{
		var expire = new Date();
		expire.setTime(expire.getTime() - 1);
		document.cookie = this.cookieName + "=" + this.read() + ";path=/;expires=" + expire.toGMTString();
	},
	read: function()
	{
		var allCookies = document.cookie;
		if (allCookies.indexOf(this.cookieName) != -1) {
			var cookiePos = allCookies.indexOf(this.cookieName);
			var snippet = allCookies.substring(cookiePos, allCookies.length);
			var snippetVal = snippet.split('=')[1];
			var cookieVal = snippetVal.split(';')[0];
			return cookieVal;
		} else {
			return null;
		}
	},
	update: function()
	{
		var _self = this;
		this.remove(); this.set();		
		if (this.cookieVerbose)
		{
			if (this.createNotifier('cookieNote', 'cookienotice', updateMessage))
			{
				$('#cookieNote').show();
				setTimeout(_self.removeNotifier, updateMessageTime); // remove it
			}
		}
	},
	removeNotifier: function() 
	{
		$('#cookieNote').remove();
	},
	createNotifier: function(elementID, elementClass, elementContent)
	{
		if (document.getElementById(elementID) === null) // dont duplicate
		{
			var notify = $('<div id="'+elementID+'" class="'+elementClass+'">'+ elementContent+'<div>');
			$(notify).css({display:'none', zIndex: '1100', top: updateMessageTop, right: updateMessageRight});			
			$(this.appendTarget).append(notify);
			return true;
		}
		return false;
	}
}, Bloxpress);



// good old .bind(); 
Function.prototype.bind = function( object ) {
	var __method = this;
	return function() {
		__method.apply( object, arguments );
	};
};

// Document Ready
$(function(){	
	$('div.block_handle').unbind();
	$('.button-addwidgets').bind('click', function(){ 
		Bloxpress.Menu.init(); 
	});
	Bloxpress.DragDrop.init();
});