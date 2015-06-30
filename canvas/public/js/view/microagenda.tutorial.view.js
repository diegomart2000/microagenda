/**
 * Tutorial Views
 */
define(['lib/text!/partials/tutorial', '../model/microagenda.registration.model'], function(html, registration){
	var templates = $(html);

	var states = [];

	//Welcome State
	var welcomeState = {
		//State
		event: 'welcome',
		to: 'signup',

		//View
		el: templates.find('#welcome'),

		//On enter state, show the screen
		onEnter: function(){
			this.prepareSection();
			this.show();
		},

		//When close the view, notify this event is done
		onClose: function(){
			var done = _.bind(tutorialMachine.on, tutorialMachine);
			_.delay(done, 300, this.event);
		}
	};
	Microagenda.View.Section.extend(welcomeState);
	Microagenda.StateMachine.State.extend(welcomeState);
	states.push(welcomeState);

	//Signup State
	var signupState = {
		//View
		el: templates.find('#signup'),

		//State
		event: 'signup',
		to: 'basicInfo',
		
		onEnter: function(){
			this.prepareSection();
			this.prepareForm();
			this.show();
		},

		onSubmit: function(form){
			var self = this;

			//Special validation, passwords must match
			if(form.password != form.again){
				this.el.find('[name=again]').cvgText('error', 'Las contraseñas no coinciden');
				return;
			}
			
			//Do the create user.
			registration.signUp(	
				form,

				//success
				function(user){
					//Close the view
					self.close();

					//After the save, notify this section is done
					var done = _.bind(tutorialMachine.on, tutorialMachine);
					_.delay(done, 300, self.event);
				},
				//error
				function(err){

				}
			);
		}
	};

	Microagenda.View.Section.extend(signupState);
	Microagenda.View.Form.extend(signupState);
	Microagenda.StateMachine.State.extend(signupState);
	states.push(signupState);


	//Signup State
	var basicState = {
		//View
		el: templates.find('#basic'),

		//State
		event: 'basicInfo',
		to: 'connect',
		
		//State event on enter state
		onEnter: function(){
			this.prepareSection();
			this.prepareForm();
			this.show();
		},

		//Form event
		onSubmit: function(form){
			var self = this;
			registration.createPersonalInfo(
				form,
				//success
				function(user) {
					//Close the view
					self.close();

					//After the save, notify this section is done
					var done = _.bind(tutorialMachine.on, tutorialMachine);
					_.delay(done, 300, self.event);
				},

				//error
				function(user, error) {
					// Show the error message somewhere and let the user try again.
					alert("Error: " + error.code + " " + error.message);
				});
		},
		
		//State event on leave state
		onLeave: function(){
		}
	};

	Microagenda.View.Section.extend(basicState);
	Microagenda.View.Form.extend(basicState);
	Microagenda.StateMachine.State.extend(basicState);
	states.push(basicState);

	//Facebook connect State
	var facebookConnectSection = {
		//State
		event: 'connect',
		to: 'invite',

		//View
		el: templates.find('#facebook-connect'),

		//On enter state, show the screen
		onEnter: function(){
			//Check if facebook is already connected, for instance, when running in facebook canvas
			if(Microagenda.context.facebook) {
				return tutorialMachine.on(this.event);
			}

			this.prepareSection();
			this.show();
		},

		//Once the form is shown, setup some button events
		onShow: function(){
			var self = this;

			self.el.find('[action=connect]').on('click', function(){
				FB.login(function(response) {
					if (response.authResponse) {
						console.log('Welcome!  Fetching your information.... ');
						FB.api('/me', function(me) {
							registration.registerPlatform(me,
								//success
								function(){
									console.log('User platform registered!');
								},

								//error
								function(err){
									if(err.code == 202){
										console.log('User already registered');
									}else{
										alert(error);
									}
								}
							);
						});
					} else {
						console.log('User cancelled login or did not fully authorize.');
					}

					self.close();
				});
			});
		},

		//When close the view, notify this event is done
		onClose: function(){
			//Called on skip method
			var done = _.bind(tutorialMachine.on, tutorialMachine);
			_.delay(done, 300, this.event);
		}
	};
	Microagenda.View.Section.extend(facebookConnectSection);
	Microagenda.StateMachine.State.extend(facebookConnectSection);
	states.push(facebookConnectSection);

	//With friends State
	var withFriendsSection = {
		//State
		event: 'invite',
		to: 'acceptRequests',

		//View
		el: templates.find('#with-friends'),

		//On enter state, show the screen
		onEnter: function(){
			//Check if facebook is connected, if not, just skip this section
			if(!Microagenda.context.facebook) {
				return tutorialMachine.on(this.event);
			}

			this.prepareSection();
			this.show();
		},

		//When close the view, notify this event is done
		onClose: function(){
			FB.ui({method: 'apprequests',
				message: 'Hola, me gustaría tener tu número de teléfono actualizado!'
			},
			function(reqResponse){
				console.log(reqResponse);
				var done = _.bind(tutorialMachine.on, tutorialMachine);
				_.delay(done, 300, this.event);
			});
		}
	};
	Microagenda.View.Section.extend(withFriendsSection);
	Microagenda.StateMachine.State.extend(withFriendsSection);
	states.push(withFriendsSection);

	//Accept subscription requets
	var acceptRequestsSection = {
		//State
		event: 'acceptRequests',
		to: 'other',

		//View
		el: templates.find('#accept-requests'),

		//On enter state, show the screen
		onEnter: function(){
			this.prepareSection();
			this.show();
		},

		//When close the view, notify this event is done
		onClose: function(){
			//Called on skip method
			var done = _.bind(tutorialMachine.on, tutorialMachine);
			_.delay(done, 300, this.event);
		}
	};
	Microagenda.View.Section.extend(acceptRequestsSection);
	Microagenda.StateMachine.State.extend(acceptRequestsSection);
	states.push(acceptRequestsSection);

	//Create the machine and start it
	var tutorialMachine = Microagenda.StateMachine.extend(states, 'welcome');
	tutorialMachine.start();

	return {};
});