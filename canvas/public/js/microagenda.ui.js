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
 * CVG Check Editor Component
 * @author: Diego.A.Martinez
 */
(function( $ ){
	var methods = {
		init : function(settings){
		},
		
		draw : function(settings){
			return this.each(function(){
				var spContainer = $(this);
				
				//Create stars
				var opts = $.extend({}, defaults, settings);

				spContainer.data('opts', opts);
				var selector = spContainer.selector;
				try{
					spContainer.off('click'); //Remove previous
					spContainer.on('click', function(event){
						event.stopPropagation();
						var el = $(this);
						if(el.hasClass('all')){
							var checked = el.prop( 'checked');
							$(opts.itemSelector).prop('checked', checked);
							defaults.lastChecked = checked ? defaults.lastChecked : null;

						}else{
							//Check if its a range check
							if(event.shiftKey){
								//Check if there is an start point, if not define it
								if(!defaults.lastChecked){
									defaults.lastChecked = el;

								//If there is an starting point, select the range
								}else{
									var checkElements = $(opts.itemSelector);
									var a = checkElements.index(defaults.lastChecked);
									var b = checkElements.index(el);

									var start=a<b?a:b, end=a>b?a:b;

									for(var i=start; i < end; i ++){
										$(checkElements[i]).prop('checked', true);
									}
								}
							}else{
								//Mark current as last checked
								defaults.lastChecked = el;
							}

							//all checked?
							var checked = $(opts.itemSelector + ':not(.all):checked').length == $(opts.itemSelector + ':not(.all)').length;
							$('input[type=checkbox].all').prop('checked', checked);
						}

						//on checked callback
						opts.onCheck(el.attr(opts.attribute), el.prop( 'checked'));
					});

				}catch(err){
					try{if(console) console.log(err);}catch(noconosoloeE){}
				}
			});
		},
		
		selected : function(){
			var spContainer = $(this);
			var opts = spContainer.data('opts');
			var result = [];
			$(opts.itemSelector + ':not(.all):checked').each(function(i, element){
				result.push($(element).attr(opts.attribute));
			})
			
			return result;
		},
		
		reset : function(){
			var spContainer = $(this);
			var opts = spContainer.data('opts');
			$(opts.itemSelector).prop('checked', false);
		}
	};

	/**
	 * Default setting values
	 */
	var defaults = {
		attribute: 'id',
		itemSelector: 'input[type=checkbox]',
		lastChecked: null,

		//Called when the item has been checked
		onCheck: function(value, checked){}
	};

	$.fn.cvgCheck = function(settings) {
		if(typeof(settings) === 'string'){
			return methods[settings].apply( this, arguments );
		}else{
			if(!methods.spContainer) methods.init.apply( this, arguments );
			return methods.draw.apply( this, arguments  );
		}
	};
})( jQuery );

/**
 * CVG Rate Editor Component
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
					spContainer.empty();
					spContainer.addClass('ui-rate');
					
					//Create stars
					var opts = $.extend({}, defaults, settings);
					spContainer.data('opts', opts);
					
					//Create a value holder for api calls
					var valueHolder = $(document.createElement('input'))
						.attr('type', 'hidden')
						.attr('id', spContainer.attr('id') + '-value')
						.val(opts.start)
						.appendTo(spContainer);
					
					for(var i=0; i<opts.stars; i++){
						var star = $(document.createElement('div'))
									.addClass('ui-rate-star')
									.addClass( i < opts.start ? opts.starOnClass : opts.starOffClass)
									.appendTo(spContainer)
									.attr('alt', i+1)
									.attr('title', opts.hints[i])
									.hover(											function(){
												var $this = $(this);
												var value = $this.attr('alt');
												$this.parent().find('div').each(function(){
													var overStar = $(this);
													var overValue = overStar.attr('alt');
													if(overValue <= value && !overStar.hasClass('ui-rate-star-hover'))
														overStar.addClass('ui-rate-star-hover');
													else
														overStar.removeClass('ui-rate-star-hover');
												});
											}

									)
									.click(function(event){
										var $this = $(this);
										var value = $this.attr('alt');
										
										$this.parent().find('div').each(function(){
											var overStar = $(this);
											var overValue = overStar.attr('alt');
											if(overValue <= value)
												overStar.addClass(opts.starOnClass);
											else
												overStar.removeClass(opts.starOnClass);
										});
										
										var $valueHolder = $this.parent().find('input[type=hidden]').val(value);
										
										opts.click.apply($this.parent().get(0), [value, event]);
									});
					}
					
				}catch(err){
					try{if(console) console.log(err);}catch(noconosoloeE){}
				}
			});
		},
		
		val : function(){
			var spContainer = $(this);
			var opts = spContainer.data('opts');
			var $valueHolder = spContainer.find('input[type=hidden]');
			if(arguments.length > 1){
				
				var value = parseInt(arguments[1]);
				$valueHolder.val(value);

				spContainer.find('div').each(function(){
					var overStar = $(this);
					var overValue = parseInt(overStar.attr('alt'));
					if(overValue <= value)
						overStar.addClass(opts.starOnClass);
					else
						overStar.removeClass(opts.starOnClass);
				});
				
			}else{
				return $valueHolder.val();
			}
		}
	};

	/**
	 * Default setting values
	 */
	var defaults = {
		stars: 5,
		hints: ['Learning', 'Beginner', 'Intermediate', 'Advanced', 'Pro'],
		starOnClass: 'ui-rate-star-on',
		starOffClass: 'ui-rate-star-off',
		start: 0,
		click: function(score, event){}
	};

	$.fn.cvgRate = function(settings) {
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
 * CVG DIALOG Component
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
					var overlayId = spContainer.attr('id') + '-overlay';
					
					var opts = $.extend({}, defaults, settings);
					opts.overlayId = overlayId;
					
					var overlay = $(document.createElement('div')).addClass('overlay').appendTo($('body')).attr('id', overlayId);
					opts.overlay = overlay;

					spContainer
						.data('opts', opts)
						.removeClass('hidden')
						.addClass('ui-dialog carded rounded-all')
						.appendTo(overlay);
					
					var formContent = spContainer.html();

					//Build form structure
					var formTitle = spContainer.attr('data-title');
					spContainer.attr('title', null);
					
					spContainer.empty();
					
					//Build The title
					var formTitleContainer = $(document.createElement('div'))
						.addClass('pane-title')
						.prependTo(spContainer);
					
					var formTitleEm = $(document.createElement('h3'))
						.text(formTitle)
						.addClass('base-font')
						.appendTo(formTitleContainer);
					
					var formTitleClose = $(document.createElement('span'))
						.addClass('right ui-icon ui-cancel')
						.appendTo(formTitleContainer)
						.click(function(){
							overlay.fadeOut('fast');
							if(opts.close){
								opts.close(spContainer);
							}
						});
					
					//Click on the overlay closes the dialog
					overlay.click(function(event){
						if(event.target.id != this.id) return;
						overlay.fadeOut('fast');
						
						if(opts.close){
							opts.close(spContainer);
						}
					});

					//Form content
					var formContentContainer = $(document.createElement('div'))
						.addClass('pane-content base-font ui-title')
						.appendTo(spContainer)
						.append(formContent);

				}catch(err){
					try{if(console) console.log(err);}catch(noconosoloeE){}
				}
			});
		},
		
		/**
		 * To show the dialog
		 */
		show: function(){
			var spContainer = $(this);
			var opts = spContainer.data('opts');
			opts.overlay.fadeIn('fast');
			spContainer.find('input').first().focus();
			
			return spContainer;
		},
		
		
		/**
		 * To hide the dialog
		 */
		hide: function(){
			var spContainer = $(this);
			var opts = spContainer.data('opts');
			opts.overlay.fadeOut('fast');
			
			if(opts.close){
				opts.close(spContainer);
			}
			
			return spContainer;
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
	$.fn.cvgDialog = function(settings) {
		if(typeof(settings) === 'string'){
			return methods[settings].apply( this, arguments );
		}else{
			if(!methods.spContainer) methods.init.apply( this, arguments );
			return methods.draw.apply( this, arguments  );
		}
	};
})( jQuery );

/**
 * CVG Context Popup Component
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

					spContainer
						.data('opts', opts)
						.addClass('ui-context-popup rounded-all padded-all');
					
					var arrow = $(document.createElement('span'))
						.addClass('arrow')
						.addClass(opts.orientation)
						.appendTo(spContainer);
					
					var arrowBg = $(document.createElement('span'))
						.addClass('arrow')
						.addClass(opts.orientation + '-fore')
						.appendTo(arrow);

					$(document).mouseup(function (e){
					    if (!spContainer.is(e.target) && spContainer.has(e.target).length === 0){
					    	spContainer.hide();
					    }
					});
				}catch(err){
					try{if(console) console.log(err);}catch(noconosoloeE){}
				}
			});
		},
		
		/**
		 * To show the dialog
		 */
		show: function(){
			var spContainer = $(this);
			var opts = spContainer.data('opts');

			var to = arguments.length > 1 ? arguments[1] : null;
			var position = {offset: (to ? to.offset() : null), height: (to ? to.height() : null), width: (to ? to.width() : null)};
			
			spContainer.show();
			var size = {width: spContainer.width(), height:	spContainer.height()};
			if(to) spContainer.offset({top: position.offset.top, left: size.width + position.offset.left + opts.left});
			return spContainer;
		},
		
		
		/**
		 * To hide the dialog
		 */
		hide: function(){
			var spContainer = $(this);
			var opts = spContainer.data('opts');
			spContainer.hide();
			if(opts.close){
				opts.close(spContainer);
			}
			
			return spContainer;
		}
	};

	/**
	 * Default setting values
	 */
	var defaults = {
		orientation: 'left', //left | top | bottom
		left: 0,
		top: 0,
		
		arrowLeft: 0
	};

	/**
	 * 
	 */
	$.fn.cvgContextPopup = function(settings) {
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