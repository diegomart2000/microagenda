
var Microagenda = Microagenda || {

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
Microagenda.View.SectionView = {
	//The Section Item
	el: null,

	//Default init method
	init: function(){
		this.el = this.el || $();
	},

	//Default render method
	render: function(){
		var self = this;

		//Binding default events
		el.find('button[action=continue]').on('click',function(){
			self.close();
		});
	},

	//Sets the element visible
	//Makes it to appear on the screen
	show: function(){
		var self = this;
		_.delay(
			function(){
				this.el
					.show()
					.addClass('swipe-top');
			}, 500);
	},

	//Default close method
	close: function(){
		var self = this;

		//Animate the container
		this.el.addClass('swipe-left');

		//Make it dessapear
		var remove = _.bind(self.el.remove, self.el);
		_.delay(remove, 800, 'logged later');
	}
};