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