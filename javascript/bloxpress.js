
/**
 *  BloxPress2
 *  ----------------------
 *  Copyright (C) 2006-2007, Kjell Bublitz
 *  www.bloxpress.org / m3nt0r.de@gmail.com
 *
 *  Bloxpress Javascript
 *  
 *  Handling all the interface stuff
 *
*/

/**
 * Bloxpress Global Variables
 * -------------------------------------------
 */
var imageDir = 'wp-content/themes/bloxpress/images'; 

// Menu / Notify Target
var targetElementID = '#main' // blockmenu and other things will be temporarly attached to this element
var blockmenuCaption = 'Widget Menu';

// Cookie
var cookieVerbose = true; // show notification if the cookie updates?
var cookieLifetime = 7; // how many days the cookie should be stored?

// Cookie Update Message
var updateMessage = 'Layout saved!';
var updateMessageTime = 500 // Time in miliseconds the message is visible
var updateMessageTop = '0px'; // position of the message 
var updateMessageRight = '0px';

// Cursor
var cursorGrab = 'move'; // default cursor, if a draggable is moved
var cursorNormal = 'pointer'; // default for draggable element
var cursorImageOpen = imageDir+'/cursor_openhand.cur'; // IE replacement for cursorNormal
var cursorImageClosed = imageDir+'/cursor_closedhand.cur'; // IE replacement for cursorGrab

// Icons and Images
var imageClose = baseUrl+'/'+imageDir+'/icon_close.gif';
var imageMinimize = baseUrl+'/'+imageDir+'/icon_minimize.gif';
var imageMaximize = baseUrl+'/'+imageDir+'/icon_maximize.gif';

function e(output) {
	if($.browser.mozilla) { console.log(output); }
}

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
	setCursors: function()
	{
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
	getRandom: function(element_id) {
		return element_id + '_' + Math.round(Math.random() * 10000);
	}
};

/**
 * Bloxpress DragDrop Component
 * ------------------------
 * Defines a droppable Area and handles onDrop requests made by Menu-Items
 */
Bloxpress.DragDrop = $.extend({
	removeStack: [],
	init: function() {
		this.setCursors();
		this.addEvents();
		this.makeSort();
		this.makeDrop();
	},
	addEvents: function()
	{
		$('.button-addwidgets').bind('click', function(){ Bloxpress.Menu.init(); });
		$('.container-close').css({cursor:'pointer'}).click(function(evt){ this.removeBlock($(evt.target).parent().parent()); }.bind(this));
		$('.block_handle').css({cursor: cursorNormal}).bind("mousedown", function(){
			$(this).css({cursor: cursorGrab});
		}).bind("mouseup", function(){			
			$(this).css({cursor: cursorNormal});
		}).bind("mouseout", function(){			
			$(this).css({cursor: cursorNormal});
		});
	},
	isInStack: function(id) {
		return $.grep(this.removeStack, function(n){ if(n==id){return true;} }).length;
	},
	removeFromStack: function(id) {
		var _removeStack = this.removeStack;
		$.grep(_removeStack, function(n,i){ if(n==id){ _removeStack.splice(i,1); } });
	},
	removeBlock: function(block)
	{
		var blockID = block.attr('id');
		if(this.isInStack(blockID)) {
			return false;	
		} else {
			this.removeStack.push(blockID);
			var timeoutID = this.getRandom('timeout');
			var timeoutNo = window.setTimeout(function(){ clearInterval(interval); $(block).remove(); this.removeFromStack(blockID); this.updateCookie() }.bind(this), 5000);
			var abortLink = $.A({href:'#stopRemoval'}, 'Abort');
			var removalAbort = $(abortLink).click(function(){ clearTimeout(timeoutNo); this.removeFromStack(blockID); $(block).children('.removeNotice').remove(); }.bind(this));
			var removal = $.DIV({className:'ft'}, 'Remove? closing in ', $.SPAN({id:timeoutID}, '5'), ' ', removalAbort[0]);
			$('#'+blockID+' div:first').append(removal);
			
			var interval = window.setInterval(function() {
				seconds = parseInt($('#'+timeoutID).html()); seconds--;
				$('#'+timeoutID).html( seconds ); 
			}, 1000);
			
			return true;
		}
	},
	spawnBlock: function(zone, item)
	{
		var block = item.id.split('_')[1];
		var blockName = item.innerHTML;
		var blockId = this.getRandom(block);
		var blockElement = null;
		$.get(this.baseUrl+'/?bloxpress=block&load='+block, function(blockContent) // load the content
		{
			$('#'+zone+' ul.sortable').append(blockContent).SortableAddItem($('#'+zone+' li.block:last').get(0));
			this.addEvents();
			this.updateCookie();
		}.bind(this));
	},
	makeDrop: function() {
		var _self = this;
		$('.dropspot').Droppable(
			{
				tolerance: 'intersect',
				accept : 'blockitem',
				hoverclass: 'dropzonehover',
				ondrop: function(drag) {				
					_self.spawnBlock($(this).attr('id'), drag);
				}
			}
		);
	},
	makeSort: function() {
		var _self = this;
		$('.sortable').Sortable(
			{
				accept : 'block',
				activeclass : 'sortableactive',
				hoverclass : 'sortablehover',
				helperclass : 'sorthelper',
				handle: '.block_handle',
				containment: '#layout',
				onStart: function(block) {
					$(block).css({padding:'0 2px 4px 2px'});
				},
				onStop: function(){
					_self.updateCookie();
				},
				onchange: function(){
					_self.updateCookie();
				},
				opacity: 0.5,
				fit: true
			}
		);
	},
	updateCookie: function() {
		serial = $.SortSerialize();
		cookie = Bloxpress.Cookie.init('bloxpress', serial.hash);
		cookie.update();
	},
	minimize: function(image, content) {
		image.src = imageMaximize;
		$(content).hide();
	},
	maximize: function(image, content) {
		image.src = imageMinimize;
		$(content).show();
	},
	toggleMinMax: function(image, content)
	{
		if(image.src == imageMinimize) {
			this.minimize(image, content);
		} else {
			this.maximize(image, content);
		}
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
		this.setCursors(); // detect browser / set cursors
		this.targetElement = $(this.appendTarget); // get the area we want to append on
		$.getJSON(this.baseUrl+'/?bloxpress=blocklist', function(response){ this.buildMenu(response) }.bind(this) ); // request json list.		
	},
	buildMenu: function(serverBlocks)
	{
		// Create the unordered list
		var blocklist = $.UL({id:'blockmenu_list'});
		$.each(serverBlocks, function(i, block) {
			listitem = $.LI({className:'blockitem', message: block.name, id:'blockitem_'+block.id}, block.name);
			blocklist.appendChild( listitem );
		});	

		// Wrap a DIV around the list and add a heading to it.		
		var blockmenu = $.DIV({id:'blockmenu'}, 
							$.DIV({className:'yui-panel yui-dialog'},
								$.DIV({className:'hd',id:'blockmenu_handle'}, blockmenuCaption),
								$.DIV({className:'bd'}, blocklist), $.DIV({className:'container-close'})
							)
						);	
		$(blockmenu).css({display:'none', position:'absolute', top:'0', left:'0', zIndex:'900'});
		
		// Add it to the Page
		this.targetElement.append(blockmenu);
		
		// Start of with a animation and make the whole Div draggable
		$('#blockmenu').BlindDown(400).Draggable({zIndex: 900, handle: '#blockmenu_handle'});
		$('#blockmenu div.container-close').bind("click", function() { $('#blockmenu').remove(); });
		
		$('#blockmenu_handle').css({cursor: cursorNormal}).bind("mousedown", function(){
			$(this).css({cursor: cursorGrab});
		}).bind("mouseup", function(){			
			$(this).css({cursor: cursorNormal});
		}).bind("mouseout", function(){			
			$(this).css({cursor: cursorNormal});
		});
		
		// Make all Listitems draggable and add the event handles for the mouse cursor
		$('.blockitem').css({cursor: cursorNormal}).bind("mousedown", function(){
			$(this).css({cursor: cursorGrab});
			$(this).fadeTo("fast", 0.5);
		}).bind("mouseup", function(){			
			$(this).css({cursor: cursorNormal});
			$(this).fadeTo("fast", 1);
		}).Draggable({zIndex: 1000, ghosting: true, revert: true,
			onStop:function(){				
				$(this).fadeTo("fast", 1);
				$(this).css({cursor: cursorNormal});
			}, frameClass: 'blockitem_frame'
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
		this.cookieValue = cookieValue
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
		this.remove(); this.set();		
		if (this.cookieVerbose)
		{
			if (this.createNotifier('cookieNote', 'cookienotice', updateMessage))
			{
				$('#cookieNote').show();
				setTimeout("$('#cookieNote').remove()", updateMessageTime); // remove it
			}
		}
	},
	createNotifier: function(elementID, elementClass, elementContent)
	{
		if (document.getElementById(elementID) == null) // dont duplicate
		{
			var notify = $.DIV({id:elementID,className:elementClass}, elementContent);		
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
	Bloxpress.DragDrop.init();
});