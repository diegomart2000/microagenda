/**
 * Contact Model
 */
define(function(){

	//Contact read only DTO Model	
	//Model related to the contact list, basically to store phone contacts and get the list
	function Contact(){
		this.id = null; //A globally unique identifier. (DOMString)
		this.displayName = null; //The name of this Contact, suitable for display to end users. (DOMString)
		this.name = null; //An object containing all components of a persons name. (ContactName)
		this.nickname = null; //A casual name by which to address the contact. (DOMString)
		this.phoneNumbers = null; //An array of all the contact's phone numbers. (ContactField[])
		this.emails = null; //An array of all the contact's email addresses. (ContactField[])
		this.addresses = null; //An array of all the contact's addresses. (ContactAddress[])
		this.ims = null; //An array of all the contact's IM addresses. (ContactField[])
		this.organizations = null; //An array of all the contact's organizations. (ContactOrganization[])
		this.birthday = null; //The birthday of the contact. (Date)
		this.note = null; //A note about the contact. (DOMString)
		this.photos = null; //An array of the contact's photos. (ContactField[])
		this.categories = null; //An array of all the user-defined categories associated with the contact. (ContactField[])
		this.urls = null; //An array of web pages associated with the contact. (ContactField[])
	};

	//To get an instance property value
	Contact.prototype.get = function(property){
		return this[property];
	};

	//Class functions

	//Builds a new contact based on a contact parse model
	Contact.as = function(subscription){
		var result = new Contact();

		var contact = subscription.get('contact');
		var person = contact.get('person');

		result.id = contact.get('user').id;
		result.displayName = person.get('firstName') + ' ' + person.get('lastName');
		result.name = {givenName: person.get('firstName'), familyName: person.get('lastName')};
		result.nickname = person.get('nickname');
		result.phoneNumbers = contact.get('phones');
		result.emails = contact.get('emails');
		result.addresses = contact.get('location');
		result.birthday = contact.get('birthday');
		result.photos = [];
		result.categories = contact.get('categories');

		return result;
	};

	//Allows to create a backup for the given contact list
	Contact.backup = function(contacts, onSuccess, onError){
		var user = Microagenda.context.user;

		//Subscription contains a toLocalContact object
		var Subscription = Parse.Object.extend('Subscription');

		_.each(contacts, function(contact){
			var subscription = new Subscription();
			var acl = new Parse.ACL(user);
			subscription.setACL(acl);

			subscription.save({
				from: user,
				toLocal: contact,
				approved: false
			});
		});

		if(onSuccess) onSuccess();
	};

	//Lists the subscription requests which are still pending
	Contact.list = function(onSuccess, onError){
		var Subscription = Parse.Object.extend('Subscription');
		var Person = Parse.Object.extend('Person');
		var ContactData = Parse.Object.extend('ContactData');

		var user = Microagenda.context.user;

		var subscriptionQuery = new Parse.Query(Subscription);
		subscriptionQuery.equalTo('from', user);
		subscriptionQuery.equalTo('approved', true);

		subscriptionQuery.find()
			.then(function(subscriptions){
				var promises = [];

				//For every subscription, join the person and contact data
				_.each(subscriptions, function(subscription) {
						var contactQuery = new Parse.Query(ContactData);
						contactQuery.equalTo('user', subscription.get('to'));
						contactQuery.include('person');
						promises.push(
							contactQuery
								.first()
								.then(function(contact){
									subscription.set('contact', contact);
									return Parse.Promise.as(subscriptions);
								})

						);
				});

				return Parse.Promise.when(promises);
			})

			//Map the subscriptions into contacts
			.then(function(subscriptions){ 
				var contacts = _.map(subscriptions, function(subscription){
					return Contact.as(subscription);
				});

				return Parse.Promise.as(contacts);
			})
			.then(onSuccess, onError);
	};

	return Contact;
});