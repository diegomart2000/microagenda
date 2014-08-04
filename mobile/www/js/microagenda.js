/*
 * Microagenda initialization module
 */
var Microagenda = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'Microagenda.receivedEvent(...);'
    onDeviceReady: function() {

        //initialize the parse API
        Parse.initialize(Microagenda.Config.Parse.AppId, Microagenda.Config.Parse.JSKey);

        facebookConnectPlugin.login(["email,user_friends"], function(res){
            facebookConnectPlugin.api('/me/friends?fields=id,name,picture.type(large)', ['public_profile'], function(response) {
              alert(JSON.stringify(response));
            });

        }, function(err){alert('error ' + err)});

        //Load main component controller
        Microagenda.load('microagenda.main');
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
        js.src = 'js/lib/require.js';
        $(js).attr('data-main', 'js/' + (app ? app + '/' : '') + baseComponent);
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


/**
 * Application Section View
 */
Microagenda.SectionView = {

    //Extend method to create a new section view
    extend: function(view){

    },

    //Allows this view to be shown, all section views are exclusive
    show: function(){

    }


};