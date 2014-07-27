/**
 * Home View
 */
define(function() {

	alert('on view');
	/**
	 * Home View
	 * Holds all the containers and performs as a controller
	 */
	var HomeView = {
		model: null,

		container: null,
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
			self.container = $('#home-page');
			self.spinner = self.container.find('.spinner');
			
			self.loadContacts();
		},


		loadContacts: function(){
			function onSuccess(contacts) {
				var ul = $('#home-page ul');
			    _.each(contacts, function(contact){
			    	var displayName = contact.displayName ? contact.displayName : contact.name.formatted;

			    	ul.append('<li class="border-color"><h3>' + displayName + '</h3><div class="secondary">+54 9 11 5055 1731</div></li>');
			    })
			};

			function onError(contactError) {
			    alert('onError!');
			};

			// find all contacts with 'Bob' in any name field
			var options      = new ContactFindOptions();
			options.multiple = true;
			//options.desiredFields = [navigator.contacts.fieldType.id];
			var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
			navigator.contacts.find(fields, onSuccess, onError, options);
		}

	};
	
	return HomeView;
});