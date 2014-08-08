/**
 *
 */
define(function(){
	//Login Module
	var Login = {
		user: null,

		//Module init method
		init: function(){
			var log = _.bind(console.log, console);
			this.checkLoginStatus(log, log);
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

			if(self.user) return onSuccess('LOGGEDIN');

			//If no user found, check if facebook is connected

			//Check facebook login status
			function getFacebookUser(){
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

			//If a facebook user is found, check for the facebook user id in Parse.
			function lookupForUserByFacebookId(fbUser){
				var deferred = Q.defer();

				if(fbUser){
					console.log('LOGIN: looking for Parse user for [%s]', fbUser.userId);
					var UserPlatform = Parse.Object.extend("UserPlatform");
					var query = new Parse.Query(UserPlatform);
					query.equalTo("facebookId", fbUser.userId);

					query.find({
						success: function(results) {
							self.user = results[0];

							//If no user, its a registration
							if(self.user){
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
					deferred.resolve('LANDING');
				}
				return deferred.promise;
			};

			//Do the promise dance
			getFacebookUser()
				.then(lookupForUserByFacebookId)
				.then(onSuccess, onError);

		}

	};

	Login.init();
	return Login;
});