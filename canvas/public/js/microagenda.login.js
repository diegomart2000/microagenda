/**
 *
 */
define(function(){
	//Login Module
	var Login = {
		user: null,

		//Module init method
		init: function(){
			var controller = {
				'LOGGEDIN': _.bind(this.doHome, this),
				'REGISTRATION': _.bind(this.doRegistration, this),
				'LANDING': _.bind(this.doLanding, this)
			};

			this.checkLoginStatus(
				//onSuccess
				function(method){
					controller[method]();
				}, 

				//onError
				function(err){
					console.error('Error while check login status', err);
				});
		},

		//On Loggedin show the user home
		doHome: function(){
			console.log('LOGIN: doHome');
		},

		//On Registration show the tutoria
		doRegistration: function(){
			console.log('LOGIN: doRegistration');

			require(['microagenda.tutorial'], function(tutorial){});
		},

		//On Landing show the login/register page
		doLanding: function(){
			console.log('LOGIN: doLanding');
		},

		//This method will check the login status
		checkLoginStatus: function(onSuccess, onError){
			var self = this;

			//Check for Parse user session
			self.user = Parse.User.current();

			//IF user is not null, there is a session, return then
			//Otherwise, if User is null
			//But, Facebook is connected
			//Check for a User with given facebook ID
			//If no User is found, it is a registration
			//Else, if no User and facebook not connected, it is a landing request

			//LOGIN STATUSES
			//LOGGEDIN: user already registered and loggedin
			//REGISTRATION: no user found, but facebook is connected
			//LANDING: no user, no facebook connected, show love

			if(self.user){
				Microagenda.context.user = self.user;

				Microagenda.context.user.get('person').fetch();
				Microagenda.context.user.get('contact').fetch();

				var UserPlatform = Parse.Object.extend("UserPlatform");
				var query = new Parse.Query(UserPlatform);
				query.equalTo("user", self.user);

				query.first().then(function(result) {
					Microagenda.context.userPlatform = result;
				});

				return onSuccess('LOGGEDIN');	
			} 

			//If no user found, check if facebook is connected

			//Check facebook login status
			function checkFacebookLoginStatus(){
				var deferred = Q.defer();

				console.log('LOGIN: check FB status...');

				FB.getLoginStatus(function(response) {
					if (response.status === 'connected') {
						console.log('LOGIN: FB is connected');
					}else {
						console.log('LOGIN: FB NOT connected');
					}

					deferred.resolve(response.authResponse);
				});

				return deferred.promise;
			};

			//Check facebook login status
			function getFacebookUser(fbUser){
				var deferred = Q.defer();

				if (fbUser) {
					console.log('LOGIN: get FB user...');
					FB.api('/me', function(me){
						Microagenda.context.facebook = me;
						deferred.resolve(fbUser);	
					});
				}else{
					deferred.resolve(fbUser);
				}

				return deferred.promise;
			};

			//If a facebook user is found, check for the facebook user id in Parse.
			function lookupUserByFacebookId(fbUser){
				var deferred = Q.defer();

				if(fbUser){
					console.log('LOGIN: looking for Parse user for [%s]', fbUser.userId);
					var UserPlatform = Parse.Object.extend("UserPlatform");
					var query = new Parse.Query(UserPlatform);
					query.equalTo("socialId", fbUser.userId);

					query.first({
						success: function(result) {
							self.user = result;

							//If no user, its a registration
							if(self.user){
								Microagenda.context.userPlatform = result;
								deferred.resolve('LOGGEDIN');
							}else{
								deferred.resolve('REGISTRATION');
							}
						},
						error: function(error) {
							deferred.reject(error);
						}
					});
				}else{
					console.log('LOGIN: Not connected at all, its a LANDING');
					deferred.resolve('REGISTRATION');
				}
				return deferred.promise;
			};

			//Do the promise dance
			checkFacebookLoginStatus()
				.then(getFacebookUser)
				.then(lookupUserByFacebookId)
				.then(onSuccess, onError);

		}

	};

	Login.init();
	return Login;
});