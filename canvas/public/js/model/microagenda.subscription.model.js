/**
 * Subscription Model
 */
define(function(){
	
	//Model related to the subscription and requests mechanisms
	return {

		//What are we goin to handle here?

		//Suscriptions and contact requests

		//Allows to create a subscription request, based on FB sent requests
		//ACL will be open for every one, since, requested user might not exist
		subscribe: function(request, onSuccess, onError){
			var user = Microagenda.context.user;

			var Subscription = Parse.Object.extend('Subscription');

			_.each(request.to, function(socialId){
				var subscription = new Subscription();
				subscription.save({
					from: user,
					toSocialId: socialId,
					toPlatformId: 'facebook',
					socialRequestId: request.request,
					approved: false
				});
			});

			if(onSuccess) onSuccess();
		},

		//Lists the subscription requests which are still pending
		listSubscribers: function(onSuccess, onError){
			var Subscription = Parse.Object.extend('Subscription');
			var Person = Parse.Object.extend('Person');

			var userPlatform = Microagenda.context.userPlatform;
			var user = Microagenda.context.user;

			var subscriptionQuery = new Parse.Query(Subscription);
			subscriptionQuery.equalTo('toSocialId', userPlatform.get('socialId'));
			subscriptionQuery.equalTo('toPlatformId', 'facebook');

			subscriptionQuery.find()
				.then(function(subscriptions){
					var promises = [];

					//For every subscription, join the person from
					_.each(subscriptions, function(subscription) {
							var personQuery = new Parse.Query(Person);
							personQuery.equalTo('user', subscription.get('from'));

							promises.push(
								personQuery
									.first()
									.then(function(person){
										subscription.set('person', person);
										return Parse.Promise.as(subscriptions);
									})

							);
					});

					return Parse.Promise.when(promises);
				})
				.then(onSuccess, onError);
		},

		//This method allows to approve a subscription request, allowing the requester to access concat data.
		approve: function(subscriptionId, onSuccess, onError){
			var Subscription = Parse.Object.extend('Subscription');

			var user = Microagenda.context.user;


			var subscriptionQuery = new Parse.Query(Subscription);
			subscriptionQuery
				.get(subscriptionId)

				//Update the subscription to set, current user and approved true
				.then(function(subscription){

					subscription.set('to', user);
					subscription.set('approved', true);

					//Update security, write and read will be allowed only be the from and to users
					var acl = new Parse.ACL();
					acl.setReadAccess(subscription.get('from'), true);
					acl.setReadAccess(subscription.get('to'), true);
					acl.setWriteAccess(subscription.get('from'), true);
					acl.setWriteAccess(subscription.get('to'), true);
					subscription.setACL(acl);

					return subscription.save();
				})

				//Udate current user contact
				.then(function(subscription){
					var contact = user.get('contact');
					var acl = contact.getACL();
					acl.setReadAccess(subscription.get('from'), true);

					var promise = new Parse.Promise();
					contact.save().then(function(contact){
						promise.resolve(subscription);
					});

					return promise;
				})

				//Delete facebook request, if exists
				.then(function(subscription){
					if(subscription.get('toSocialId') && subscription.get('socialRequestId')){
						var requestId = subscription.get('socialRequestId') + '_' + subscription.get('toSocialId');
						FB.api(requestId, 'delete', function(response) {
							console.log(response);
						});
					}

					return Parse.Promise.as(subscription);
				})

				//Finally return;
				.then(onSuccess, onError);
		}
	};
});

/*

//To give a user access to a contact data
groupACL = contact.getACL();
groupACL.setReadAccess('wmZNePTjQX', true);
contact.setACL(groupACL)
contact.save();

//To look for some other user contact data
ContactData = Parse.Object.extend("ContactData");
query = new Parse.Query(ContactData);

queryUser = new Parse.User();
queryUser.id = "EWBYDMJEJh";
query.equalTo("user", queryUser);

query.find({ success: function(results) {window.results= results;}, error: function(error) {}});

//Somewhere there should be a list of user ids I'm allowed to get access to
Subscription

from: user the one who sent the request
to: user who is being followed (initially will be null, it should be populated on registration)

toPlatformId: to be used on registration to look for the request for the given user
toSocialId: same as avobe

toLocal: object containing contact information from mobile device, null when "to" is not null
approved: to indicate if the followed one has approved this request


//To delete a social request on acepting requests
requestId = objectId + '_' + socialId
function deleteRequest(requestId) {
  FB.api(requestId, 'delete', function(response) {
    console.log(response);
  });
}
*/