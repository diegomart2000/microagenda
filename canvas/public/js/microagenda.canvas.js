
var Microagenda = Microagenda || {
	//Application context
	context: {
		user: null, //Holds the application user, a Parse User
		userPlatform: null, //user platform instance
		facebook: null //Holds the Facebook user
	},

	//Initializes the required APIs
	init:function(){
		//initialize the parse API
		Parse.initialize(Microagenda.Config.Parse.AppId, Microagenda.Config.Parse.JSKey);
		FB.init({appId: Microagenda.Config.Facebook.AppId, version: 'v2.0', oauth  : true, frictionlessRequests : true});

		//After this.. load the login module to handle user session
		this.load('microagenda.login')

	},

    /**
     * To load a module using RequireJs 
     */
    load: function(baseComponent, app){
        var d = document;
        var s = 'script';
        var id = baseComponent;
            
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = '/js/lib/require.js';
        $(js).attr('data-main', '/js/' + (app ? app + '/' : '') + baseComponent);
        fjs.parentNode.insertBefore(js, fjs);
    }
};

/**
 * Application config
 */
Microagenda.Config = {

    //Facebook config
    Facebook: {
        AppId: '604043223046726',
        AppSecret: 'fd04611ef11f208e16f57982eb124657'
    },

    //Parse config
    Parse: {
        AppId: 'Xcwogp6kDa2keNGo9tQKveguWHtpdoue1iqilyA8',
        JSKey: 'X8vne9X50L8mQPkExJsu6pxKguImTy4aQsEu5lW8'
    }
};


//View Package definition
Microagenda.View = {};

/**
 * Section View definition
 */
Microagenda.View.Section = {
	app: $('#app'),

	//The Section Item
	el: null,

	enterAnimation: 'pop',
	leaveAnimation: 'swipe-left',

	//Default render method
	render: function(){
		return this.prepareSection();
	},

	//To setup the form elements
	prepareSection: function(){
		var self = this;

		//Add the alement to the app container
		self.el.appendTo(self.app);

		//Binding default events
		self.el.find('button[action=continue]').on('click',function(){
			self.close();
		});

		return self;
	},

	//Sets the element visible
	//Makes it to appear on the screen
	show: function(){
		var self = this;

		self.el
			.show()
			.addClass(self.enterAnimation);

		//Remove the animation class
		var remove = _.bind(self.el.removeClass, self.el);
		_.delay(remove, 1000, self.enterAnimation);

		//Do some stuff after show started
		self.onShow();
	},

	//Default close method
	close: function(){
		var self = this;

		//Do some stuff before close
		self.onClose();

		//Animate the container
		this.el.addClass(self.leaveAnimation);

		//Make it dessapear
		var remove = _.bind(self.el.remove, self.el);
		_.delay(remove, 300);
	},

	//Extends an user created view with this functionality
	extend: function(userView){
		return _.defaults(userView, this);
	},

	//Default onShow event
	onShow: function(){},

	//Default onClose event
	onClose: function(){}
};


/**
 * Form View definition
 */
Microagenda.View.Form = {
	app: $('#app'),

	//The form element
	el: null,
	template: null,

	item: null,

	//Default render method
	render: function(){
		return this.prepareForm();
	},

	//Default render method
	prepareForm: function(item){
		var self = this;
		self.item = item;

		//Add the alement to the app container
		if(!self.el){
			self.el = self.template(item);
			self.el.appendTo(self.app);
		}

		//Setup form inputs
		self.el.find('input, select').each(function(index){
			var el = $(this);
			var mask = el.attr('mask'); 
			var type = el.attr('type');

			if(type == 'text' || type == 'password'){
				el.cvgText({});
				if(self.item)
					el.cvgText('val', self.item[el.attr('name')]);
			}else{
				el.cvgCombo({});
				if(self.item)
					el.cvgCombo('val', self.item[el.attr('name')]);
			}
		});

		//Binding default events
		self.el.find('button[action=submit]')
			.on('click', function(){
				self.grab();
			});

		self.el.find('a[action=cancel]')
			.on('click', function(){
				self.destroy();
			});

		return self;
	},

	//To validate the imputs
	validate: function(){
		var self = this;
		var el = self.el;
		var valid = true;
		
		el.find('input').each(function(){
			var input = $(this);
			
			valid = input.cvgText('valid');
			if(!valid){
				return false;	
			}
		});
		
		return valid;
	},

	//To generate the data from the imputs
	grab: function(){
		var self = this;
		if(!self.validate()) return;
		var item = {};
		self.el.find('input, select').each(function(index){
			var el = $(this);
			var attribute = el.attr('name');
			item[attribute] = el.val();
		});

		self.onSubmit(item);
	},

	//Removes the form from the view, being used with a cancel button and a template
	destroy: function(){
		var self = this;
		self.el.remove();
	},

	//Extends an user created view with this functionality
	extend: function(userForm){
		return _.defaults(userForm, this);
	},

	//Default on submit handler
	onSubmit: function(item){}
};
//StateMachine Module
Microagenda.StateMachine = {
	states: {},

	current: null,

	//Module init method
	init: function(){
		
	},

	//To advise about an event
	on: function(event){
		var stateObject = this.states[event];
		if(stateObject.onLeave) stateObject.onLeave();
		
		if(stateObject.to){
			var toState = this.states[stateObject.to];
			if(toState.onEnter) toState.onEnter();

			this.current = toState;
		}else{
			console.log('State Machine -> ended');
		}
	},


	//Starts the state machine
	start: function(){
		this.on('start');
	},

	//Ends the state machine
	finish: function(){
		//Noop
	},

	//To register a collection of states
	register: function(rawStates){
		this.states = _.indexBy(rawStates, 'event');
	},

	//To create a new version of the machine based on the user states
	extend: function(userStates, first){
		var machine = _.clone(this);
		machine.register(userStates);
		machine.states.start = {to: first};
		return machine;
	}

};

/**
 * State Object Boilerplate
 */
Microagenda.StateMachine.State = {
	//This event name
	event: null,

	//State name to be executed right after this
	to: null,

	//Called to setup the event controller
	onEnter: function(){

	},

	//Called to clear the event state
	onLeave: function(){

	},

	//Extends an user created view with this functionality
	extend: function(userState){
		return _.defaults(userState, this);
	}
};