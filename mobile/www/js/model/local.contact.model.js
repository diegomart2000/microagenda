/**
 * LocalContact Model
 */
define(function() {
	
	/**
	 * Model object
	 */
	var LocalContact = {
		items: null,

		/**
		 * Allows to load all user items
		 * @param onSuccess
		 * @param onError
		 */
		getContacts: function(onSuccess, onError){
			var self = this;
			self.items = new Array();
			
			//Local contacts database call
			function loadContacts(){
				var deferred = Q.defer();
				
				var options = new ContactFindOptions();
				options.multiple = true;
				var fields = ['*'];

				navigator.contacts.find(
					fields, 
					//onSuccess
					function(contacts){
						deferred.resolve(contacts);
					}, 
					//onError
					function(err){
						deferred.reject(err);
					},

					options);

				return deferred.promise;
			};

			loadContacts().then(onSuccess, onError);
		}
	};

	return LocalContact;
});