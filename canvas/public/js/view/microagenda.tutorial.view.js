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
		to: 'invite',
		
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

	//With friends State
	var withFriendsSection = {
		//State
		event: 'invite',
		to: 'other',

		//View
		el: templates.find('#with-friends'),

		//On enter state, show the screen
		onEnter: function(){
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

	//Create the machine and start it
	var tutorialMachine = Microagenda.StateMachine.extend(states, 'welcome');
	tutorialMachine.start();

	return {};
});