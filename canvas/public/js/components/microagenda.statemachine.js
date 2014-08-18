/**
 * Microagenda simple state machine for tutorials
 */
define(function(){

	//StateMachine Module
	var StateMachine = {
		states: {},

		current: null,

		//Module init method
		init: function(){
			
		},

		//To advise about an event
		on: function(event){
			var stateObject = this.states[event];
			stateObject.leave();
			
			if(stateObject.to){
				var toState = this.states[stateObject.to];
				if(toState.enter) toState.enter();

				this.current = toState;
			}else{
				console.log('State Machine -> ended');
			}
		},

		/**
		 * Ends the state machine
		 */
		finish: function(){
			//Noop
		},

		//To register a collection of states
		register: function(rawStates){
			_.each(rawStates, function(raw){
				this.states[raw.event] = raw;
			}, this);
		}

	};

	/**
	 * State Object Boilerplate
	 */
	StateMachine.State = {
		//This event name
		event: null,

		//State name to be executed right after this
		to: null,

		//Called to setup the event controller
		enter: function(){

		},

		//Called to clear the event state
		leave: function(){

		},

		//Extends an user created view with this functionality
		extend: function(userState){
			return _.defaults(userState, this);
		}
	};

	StateMachine.init();
	return StateMachine;
});