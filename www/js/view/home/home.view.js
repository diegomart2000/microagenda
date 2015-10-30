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
			    	var mapped = {};

			    	//Get the contact display name
			    	mapped.displayName = contact.displayName ? contact.displayName : contact.name.formatted;
			    	mapped.icon = 'mail';

			    	//Phone number handling
			    	var phoneNumbers = contact.phoneNumbers;
			    	mapped.phoneNumber = null;
			    	_.each(phoneNumbers, function(phone){
			    		if(!mapped.phoneNumber || phone.pref) mapped.phoneNumber = phone.value;
			    	});

					//Email number handling
					var emails = contact.emails;
			    	mapped.email = null;
			    	_.each(emails, function(emailField){
			    		if(!mapped.email || emailField.pref) mapped.email = emailField.value;
			    	});
			    	
			    	if(!mapped.displayName && !mapped.phoneNumber){
			    		mapped.displayName = mapped.email ? mapped.email : 'Sin nombre';
			    		mapped.phoneNumber = ' ';
			    	}

			    	mapped.contactLink = '';

					if(!mapped.displayName){
			    		mapped.displayName = mapped.email ? mapped.email : 'Sin nombre';
			    	}

			    	if(!mapped.phoneNumber){
			    		mapped.phoneNumber = mapped.email ? mapped.email : '';
			    		mapped.contactLink = 'mailto:' + mapped.email;
			    	}else{
			    		mapped.contactLink = 'tel:' + mapped.phoneNumber;
			    		mapped.icon = 'phone';
			    	}

			    	//Profile Picture handling
					var photos = contact.photos;
			    	mapped.photo = {};
			    	_.each(photos, function(photo){
			    		if(!mapped.photo || photo.pref){
			    			mapped.photo = photo;	
			    		} 
			    	});

			    	return mapped;
			    });

				mappedContacts = _.sortBy(mappedContacts, 'displayName');

				var indexedContacts = _.groupBy(mappedContacts, function(contact){
					var idx = contact.displayName.substring(0, 1).toUpperCase();
					idx = isNaN(idx) ? idx : '#';
					return idx;
				});

			    new ContactView(ul).render({contacts: indexedContacts});
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