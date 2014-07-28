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
			this.container.append(this.el);

			this.container.trigger('contact-item-render-done');
			return this.el;
		}

	};
	
	return ContactView;
});