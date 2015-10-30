////////////////////////////////////////////////////////////////////////
//
// Editor Components
//
////////////////////////////////////////////////////////////////////////

/**
 * CVG Combo Editor Component
 * @author: Diego.A.Martinez
 */
(function( $ ){
	var methods = {
		init : function(settings){
		},
		
		draw : function(settings){
			return this.each(function(){
				var spContainer = $(this);
				
				try{
					if(settings.options){
						spContainer.empty();
						for(var i = 0; i < settings.options.length; i ++){
							var comboOptionsItem = $(document.createElement('option'));
							comboOptionsItem.text(settings.options[i].caption);
							comboOptionsItem.val(settings.options[i].value);
							comboOptionsItem.prop('selected', settings.options[i].selected);
							spContainer.append(comboOptionsItem);
						}
					}
				}catch(err){
					try{if(console) console.log(err);}catch(noconosoloeE){}
				}
			});
		},
		
		selected : function(){
			var spContainer = $(this);
			var value = arguments[1];
			if(arguments.length > 1){
				spContainer.val(value);
			}else{
				return spContainer.val();
			}
		},
		
		val : function(){
			var spContainer = $(this);
			var value = arguments[1];
			if(arguments.length > 1){
				spContainer.val(value);
			}else{
				return spContainer.val();
			}
		}
	};

	$.fn.cvgCombo = function(settings) {
		if(typeof(settings) === 'string'){
			return methods[settings].apply( this, arguments );
		}else{
			if(!methods.spContainer) methods.init.apply( this, arguments );
			return methods.draw.apply( this, arguments  );
		}
	};
})( jQuery );

/**
 * CVG Text Editor Component
 * @author: Diego.A.Martinez
 */
(function( $ ){
	var methods = {
		init : function(settings){
		},
		
		draw : function(settings){
			return this.each(function(){
				var spContainer = $(this);
				
				try{
					//Create stars
					var config = {
						required: spContainer.attr('required') && true,
						requiredError: spContainer.attr('requiredError'),

						length: spContainer.attr('length'),
						tooLongError: spContainer.attr('tooLongError'),

						validator: spContainer.attr('validator'),
						validatorError: spContainer.attr('validatorError'),

						validateOnBlur: spContainer.attr('validateOnBlur') && true
					}

					var opts = _.defaults(config, defaults);
					opts = _.extend(opts, settings);

					spContainer.empty();
					spContainer.data('opts', opts);
					
					spContainer.bind('keypress', (function( event ){
						methods.clearError(spContainer);
						if(spContainer.val().length >= opts.length){
							if(spContainer.attr('valid') == 'true' || spContainer.attr('valid') == true){
								methods.notifyError(spContainer,  opts.tooLongError + opts.length);
								spContainer.attr('valid', false);
							}
						}else{
							spContainer.attr('valid', true);
						}
					}));
					
					if(opts.validateOnBlur)
						spContainer.bind('blur', (function(event){
							methods.clearError(spContainer);
							methods.valid(spContainer);
						}));
					
					spContainer.attr('valid', !opts.required);
				}catch(err){
					try{if(console) console.log(err);}catch(noconosoloeE){}
				}
			});
		},
		
		valid: function($container){
			if(!$container || _.isString($container)) $container = $(this);
			var spContainer = $container;

			var opts = spContainer.data('opts');
			var value = true;
			
			if(opts.required)
				if(spContainer.val() == null || spContainer.val() == ''){
					spContainer.addClass('ui-text-field-error');
					methods.notifyError(spContainer, opts.requiredError);
					value = false;
				}else{
					value = true;
				}
			
			if(value && spContainer.val().length >= opts.length){
				spContainer.addClass('ui-text-field-error');
				methods.notifyError(spContainer, opts.tooLongError + opts.length);
				value = false;
			}
			
			if(value != null && opts.validator){
				value = opts.validators[opts.validator].test(spContainer.val());
				
				if(!value){
					spContainer.addClass('ui-text-field-error');
					methods.notifyError(spContainer, opts.validatorError);
				}
			}
				
			spContainer.attr('valid', value);
			
			if(value) methods.clearError(spContainer);
			
			return value;
		},
		
		val: function(){
			var spContainer = $(this);
			
			if(arguments.length > 1){
				if(arguments[1] != null && arguments[1] != ''  && arguments[1] != undefined){
					spContainer.val(arguments[1]);
				}else{
					methods.clear(spContainer);
				}
				
				return;
			}
			
			var value = spContainer.val();
			return value;
		},
		
		clear: function(container){
			var spContainer = container && typeof(container) != 'string' ? container : $(this);
			spContainer.val('');
			methods.clearError(spContainer);
		},
		
		notifyError: function($container, error){
			error = error ? error : $container.attr('validationError');
			
			$container.parent().find('.ui-text-aid-error').remove();
			
			$container.addClass('ui-text-field-error');
			var errorSpan = 
				$(document.createElement('span'))
				.attr('id', $container.attr('id') + '-error-msg')
				.addClass('ui-text-aid-error')
				.text(error)
				.insertAfter($container);
		},
		
		clearError: function($container){
			if(!$container || _.isString($container)) $container = $(this);
			$container.removeClass('ui-text-field-error');
			$container.parent().find('.ui-text-aid-error').remove();
		},
		
		error: function(){
			var error = '';
			if(arguments.length > 1)
				if(arguments[1] != null && arguments[1] != ''  && arguments[1] != undefined)
					error = arguments[1];
			
			methods.notifyError($(this), error);
		}
	};

	/**
	 * Default setting values
	 */
	var defaults = {
		length: 100,
		required: false,
		validateOnBlur: true,
		labelledClass: 'ui-text-field-labelled',
		
		requiredError: 'Requerido',
		validatorError: 'Valor incorrecto',

		validators:{
			digit: /^\d+$/,
			email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/,
			number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
			phone: /^\+?[0-9\-\s]+$/
		}
	};

	$.fn.cvgText = function(settings) {
		if(typeof(settings) === 'string'){
			return methods[settings].apply( this, arguments );
		}else{
			if(!methods.spContainer) methods.init.apply( this, arguments );
			return methods.draw.apply( this, arguments  );
		}
	};
})( jQuery );

/**
 * CVG Item Picture Component
 * @author: Diego.A.Martinez
 */
(function( $ ){
	var methods = {
			
		/**
		 * 
		 */
		init : function(settings){
		},
		
		/**
		 * 
		 */
		draw : function(settings){
			return this.each(function(){
				var spContainer = $(this);
				
				try{
					var opts = $.extend({}, defaults, settings);
					
					var src = spContainer.attr('src');
					var width = spContainer.width();
					var alt = spContainer.attr('alt'); alt = alt ? alt.substring(0,1) : '!';

					console.log('>>>>>' + alt + ' ' + src);
					spContainer.height(width);

			    	var noImagePlaceHolder = $(document.createElement('div'))
			    		.css('background-color', opts.colorList[Math.floor( (Math.random() * opts.colorList.length ) ) ])
			    		.css('line-height', width + 'px')
			    		.text(alt)
			    		.height(width);
			    		

			    	if(src && src != '' && src != 'null')
						$(document.createElement('img'))
							.attr('src', src)
							.width(width)
							.appendTo(spContainer)
							.load(function () {
								$(this).show();
						    })
						    .error(function () {
						    	$(this).remove();
						    	noImagePlaceHolder.appendTo(spContainer);
						    });
			    	else
			    		noImagePlaceHolder.appendTo(spContainer);

				}catch(err){
					try{if(console) console.log(err);}catch(noconosoloeE){}
				}
			});
		}
	};

	/**
	 * Default setting values
	 */
	var defaults = {
		colorList: ['#5BD002', '#474DB3', '#EBAE02', '#D3023E', '#019973', '#8D4DBF', '#36B393', '#7A069B']
	};

	/**
	 * 
	 */
	$.fn.cvgItemPic = function(settings) {
		if(typeof(settings) === 'string'){
			return methods[settings].apply( this, arguments );
		}else{
			if(!methods.spContainer) methods.init.apply( this, arguments );
			return methods.draw.apply( this, arguments  );
		}
	};
})( jQuery );


/**
 * CVG Page Scroller Component
 * @author: Diego.A.Martinez
 */
(function( $ ){
	var methods = {
			
		/**
		 * 
		 */
		init : function(settings){
		},
		
		/**
		 * 
		 */
		draw : function(settings){
			return this.each(function(){
				var spContainer = $(this);
				
				try{
					var opts = $.extend({}, defaults, settings);
					spContainer.data('opts', opts);
					
					var contentContainer = $(opts.contentSelector);
					var contentContainerTop = contentContainer.offset().top;
					
					if(opts.debug) CVG.Logger.log('scrolling: content container top ' + contentContainerTop);
					
					spContainer.on('scroll', function(){
						var scrollVal = Math.ceil( (spContainer.scrollTop() + contentContainerTop) * 1.2 );
						
						if(opts.debug) CVG.Logger.log('scrolling: ' + scrollVal + ' - ul - height: ' + contentContainer.height());
						
				        if (scrollVal > contentContainer.height()){
				        	var page = parseInt($(opts.pageSelector).attr('page'));
				        	
				        	if(!isNaN(page)){
				        		if(opts.debug) CVG.Logger.log('scrolling - load page: ' + page); 
				        		opts.pageLoader(page);
				        	}
				        }
					});
					
				}catch(err){
					try{if(console) console.log(err);}catch(noconosoloeE){}
				}
			});
		},
		
		/**
		 * To disable the page scroller
		 */
		off: function(){
			var spContainer = $(this);
			var opts = spContainer.data('opts');

			spContainer.off('scroll');
		}
	};

	/**
	 * Default setting values
	 */
	var defaults = {
		debug: false,
		
		//Element with the content to show, to calculate the height
		contentSelector: 'body',
		
		//Selector to find the page indicator
		pageSelector: 'ul li:last-child',
		
		//Function to call on page
		pageLoader: function() {try{if(console) console.log('No page loader function...');}catch(noconosoloeE){}}
	};

	/**
	 * 
	 */
	$.fn.cvgPageScroller = function(settings) {
		if(typeof(settings) === 'string'){
			return methods[settings].apply( this, arguments );
		}else{
			if(!methods.spContainer) methods.init.apply( this, arguments );
			return methods.draw.apply( this, arguments  );
		}
	};
})( jQuery );

/**
 * Creates a notification message 
 */
function cvgNotify(type, message, delay){
	delay = delay ? delay : 3000;

	var mainContainer = $(document.createElement('div'))
		.addClass('ui-notification-container')
		.on('click',function(){
			$(this).remove();
		})
		.appendTo('body');
	
	var spContainer = $(document.createElement('div'))
		.addClass('ui-notification')
		.addClass('ui-' + type)
		.text(message)

		.appendTo(mainContainer);
	
	setTimeout(function(){mainContainer.remove();}, delay + 400);
};

/**
 * Query String parameters
 */
(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));
})(jQuery);


/**
 * To scroll the window to center the element
 */
(function($) {
    $.scrollToCenter = (function(el) {
    	if(!el) return;
    	var wHeight = $( window ).height();
    	var elHeight = el.height();
    	var padding = wHeight / 2 - elHeight / 2;  
    	$('html,body').animate({scrollTop: el.offset().top - padding}, 'slow');
    });
})(jQuery);


/**
 * CVG Tabs container component
 * @author: Diego.A.Martinez
 */
(function( $ ){
	var methods = {
			
		/**
		 * 
		 */
		init : function(settings){
		},
		
		/**
		 * 
		 */
		draw : function(settings){
			return this.each(function(){
				var spContainer = $(this);
				
				try{
					var opts = $.extend({}, defaults, settings);
					var tabs = spContainer.find('a');
					tabs.on('click', function(){
						var el = $(this);
						var tabId = el.attr('rel');

						tabs.removeClass('selected');
						el.addClass('selected');
						if(opts['on' + tabId]) opts['on' + tabId](el);
					});
					
					spContainer.data('opts', opts);
				}catch(err){
					try{if(console) console.log(err);}catch(noconosoloeE){}
				}
			});
		}
	};

	/**
	 * Default setting values
	 */
	var defaults = {

	};

	/**
	 * 
	 */
	$.fn.cvgTabs = function(settings) {
		if(typeof(settings) === 'string'){
			return methods[settings].apply( this, arguments );
		}else{
			if(!methods.spContainer) methods.init.apply( this, arguments );
			return methods.draw.apply( this, arguments  );
		}
	};
})( jQuery );