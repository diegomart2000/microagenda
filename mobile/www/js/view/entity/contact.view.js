/**
 * Contact View
 */
define(function() {
	/**
	 * Contact View
	 * Holds all the containers and performs as a controller
	 */
	function ContactView(_container) {
		this.container = _container;
		this.template = Handlebars.compile($('#contact-item-template').html());

		this.el = null;
		this.item = null;

		/**
		 * Default render method
		 */
		this.render = function(item){
			this.item = item;
			this.el = $(this.template(item));
			this.el.find('.icon-button').on('tap', function(){
				var el = $(this).addClass('blink');
				navigator.notification.vibrate(30);
				window.open(el.attr('src'), '_system');
			});

			this.container.append(this.el);

			this.container.trigger('contact-item-render-done');
			return this.el;
		}

	};
	
	return ContactView;
});