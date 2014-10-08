define(function(require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        dialog = require('plugins/dialog'),
        system = require('durandal/system');


    function Queue () {
        var self = this;

	app.data.on("state", function(data){
	    self.currentGroup(data.currentGroup);
	    self.nextGroup(data.nextGroup);
	    self.queuedGroups(data.queue);
	});

        self.currentGroup = ko.observable();
        self.nextGroup = ko.observable();
        self.queuedGroups = ko.observableArray();

        self.addGroup = function () {
            dialog.show("../addGroup", null, 'bootstrap').then(function (data) {
                if (data.createGroup) {
                    group = {};
		    group.name = data.name();
		    group.phoneNumber = data.phoneNumber();
		    app.data.emit("add group", group);
		    /*self.queuedGroups.push({
                        name: ko.observable(data.name()),
                        phoneNumber: ko.observable(data.phoneNumber())
                    });*/
                }
            });
        };

        self.notifyGroup = function () {
            if ($('#notification')[0]) {
                $('#notification').removeClass('fadeOutUp');
                $('#notification').addClass('fadeInDown');
                $('body').delay(2000).promise().then(function (e) {
                    $('#notification').removeClass('fadeInDown');
                    $('#notification').addClass('fadeOutUp');
                });
            } else {
                var notifyAlert = $('<div id="notification" class="alert alert-info animated invisible col-sm-6" style="z-index:1000000;position:absolute;left:25%;" role="alert">You have sent a notification</div>');
                notifyAlert.removeClass('invisible');
                notifyAlert.addClass('fadeInDown');
                $('body').prepend(notifyAlert).delay(2000).promise().then(function (e) {
                    notifyAlert.removeClass('fadeInDown');
                    notifyAlert.addClass('fadeOutUp');
                });
            }
        };

	self.attached = function(){
	    app.data.emit("getState");
	};
    };

    return Queue;
});
