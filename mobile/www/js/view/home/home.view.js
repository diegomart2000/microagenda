/**
 * Home View
 */
define(['../entity/contact.view', '../../model/local.contact.model'], function(ContactView, LocalContactModel) {
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
			

			self.container.on('list-render-done', function(){
				self.spinner.detach();
			});

			self.doLoadContactList();
		},

		/**
		 * To render the contact list
		 */
		renderList: function(contacts){
			var self = this;
			self.container.trigger('list-render-done'); //To remove the spinner

			var ul = self.container.find('ul').empty();

			if(contacts){
			    var mappedContacts = _.map(contacts, function(contact){
			    	//Get the contact display name
			    	var displayName = contact.displayName ? contact.displayName : contact.name.formatted;

			    	var phoneNumbers = contact.phoneNumbers;
			    	var phoneNumber = null;
			    	_.each(phoneNumbers, function(phone){
			    		if(!phoneNumber || phone.pref) phoneNumber = phone.value;
			    	});

					var emails = contact.emails;
			    	var email = null;
			    	_.each(emails, function(emailField){
			    		if(!email || emailField.pref) email = emailField.value;
			    	});
			    	
			    	if(!displayName && !phoneNumber){
			    		displayName = email ? email : 'Sin nombre';
			    		phoneNumber = ' ';
			    	}

			    	var contactLink = '';

					if(!displayName){
			    		displayName = email ? email : 'Sin nombre';
			    	}

			    	if(!phoneNumber){
			    		phoneNumber = email ? email : '';
			    		contactLink = 'mailto:' + email;
			    	}else{
			    		contactLink = 'tel:' + phoneNumber;
			    	}

			    	return {displayName: displayName, phoneNumber: phoneNumber, contactLink: contactLink};
			    });

				mappedContacts = _.sortBy(mappedContacts, 'displayName');

			    new ContactView(ul).render({contacts: mappedContacts});
			}
		},

		/**
		 * Loads the contact list and calls the render method
		 */
		doLoadContactList: function(){
			var self = this;

			LocalContactModel.getContacts(
				function(contacts){
					self.renderList(contacts);
				},

				function(err){
					alert('error while loading contacts ' + err.code);
				}
			);
		}	
	};
	
	return HomeView;
});