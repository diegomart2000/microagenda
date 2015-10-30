/**
 * Spinner View
 */
define(function() {

	/**
	 * Spinner View
	 * Holds all the containers and performs as a controller
	 */
	var SpinnerView = {
		spinner: null,		

		/**
		 * To initialize templates and list bindings
		 */
		init: function(){
			this.setupUI();
		},
		
		/**
		 * 
		 */
		setupUI: function(){
			var self = this;
			
			//Name container
			self.spinner = $('.spinner');
		}


	};
	
	return SpinnerView;
});