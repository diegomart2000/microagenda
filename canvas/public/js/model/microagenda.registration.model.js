/**
 * Social Model
 */
define(function(){
	
	//Just create the object and return it, no more fancy protocols, let's go straight to the point man!
	return {

		//What are we goin to handle here?

		//First of all, user creation, the basic user object

		//1)
		//User {email, username, password}

		//2)
		//Person {first, last, picture, location}
		//Relate the user with created person

		//3)
		//ContactData {emails[], phones[]}
		//Relate the user with created contactData object

		//Creates the user and lets it available on the context
		signUp: function(raw, onSuccess, onError){
			//If everything is ok, create the user
			var user = new Parse.User();
			user.set("username", raw.email);
			user.set("password", raw.password);
			user.set("email", raw.email);
			 
			//Just create the user		 
			user.signUp(null, {
				success: function(user) {
					//Let the user available in the context
					Microagenda.context.user = user;

					//If facebook already connected, bind the users
					if(Microagenda.context.facebook){
						var UserPlatform = Parse.Object.extend("UserPlatform");
						var userPlatform = new UserPlatform();

						userPlatform.save({
							user: user,
							platformId: 'facebook',
							socialId: Microagenda.context.facebook.id
						});
					}

					//If is all just fine.. susexxx hehehe
					onSuccess(user);
				},

				error: function(user, error) {
					// Show the error message somewhere and let the user try again.
					console.log("Error: " + error.code + " " + error.message);
					onError(error);
				}
			});
		},

		//Allows to create user personal data, it will be created for user on context
		createPersonalInfo: function(raw, onSuccess, onError){
			var user = Microagenda.context.user;


			//Create the person first
			function createPerson(){
				var deferred = Q.defer();

				var Person = Parse.Object.extend("Person");
				var person = new Person();

				var acl = new Parse.ACL(user);
				acl.setPublicReadAccess(true); //This lets everyone to see the name of registered users
				person.setACL(acl);

				person.save({
					user: user,
					firstName: raw.firstName,
					lastName: raw.lastName
				}, {
					success: function(person){
						user.set('person', person);
						deferred.resolve(person);
					},
					error: function(err){
						deferred.reject(err);
					}
				});

				return deferred.promise;
			};


			//Create contact information
			function createContact(){
				var deferred = Q.defer();

				var ContactData = Parse.Object.extend("ContactData");
				var contact = new ContactData();

				var acl = new Parse.ACL(user);
				contact.setACL(acl);

				contact.save({
					user: user,
					phones: [{value: raw.phone, pref: true}],
					emails: [{value: user.getEmail(), pref: true}]
				}, {
					success: function(contact){
						user.set('contact', contact);
						deferred.resolve(contact);
					},
					error: function(err){
						deferred.reject(err);
					}
				});

				return deferred.promise;
			};


			//Updates the relation between the user and person and contact
			function updateUser(contact){
				var deferred = Q.defer();

				user.save(null, {
					success: function(user){
						deferred.resolve(user);
					},
					error: function(err){
						deferred.reject(err);
					}
				});

				return deferred.promise;
			}

			createPerson()
				.then(createContact)
				.then(updateUser)
				.then(onSuccess, onError);
		},

		//To register the user platform for the given user
		registerPlatform: function(fbUser, onSuccess, onError){
			var UserPlatform = Parse.Object.extend("UserPlatform");

			var query = new Parse.Query(UserPlatform);
			query.equalTo('platformId', 'facebook');
			query.equalTo('socialId', fbUser.id);

			query.find()
				//Check whether the give facebook user is already registered
				.then(function(found){

					if(!found){
						Microagenda.context.facebook = fbUser;

						var userPlatform = new UserPlatform();
						return userPlatform.save({
							user: user,
							platformId: 'facebook',
							socialId: Microagenda.context.facebook.id
						});

					//If found, reject
					}else{
						return Parse.Promise.error({code: 202, message: 'Facebook user already registered'});
					}
				})

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
Suscriber

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