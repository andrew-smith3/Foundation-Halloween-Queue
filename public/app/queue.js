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
            self.mazeStatus(data.mazeStatus);
        });

        self.userPermissions = app.permissions;

        if(app.permissions == 'admin' || app.permissions == "upstairs"){
            app.data.on("error", function(error){
                app.showMessage(error);
            });
        }

        self.currentGroup = ko.observable();
        self.nextGroup = ko.observable();
        self.queuedGroups = ko.observableArray();
        
        self.mazeStatus = ko.observable('stop');
        
        self.mazeStatusStop = function () {
            app.data.emit("mazeStatus",'stop');
        };
        
        self.mazeStatusGood = function () {
            app.data.emit("mazeStatus",'good');
        }

        self.addGroup = function () {
            dialog.show("../addGroup", null, 'bootstrap').then(function (data) {
                if (data.createGroup) {
                    group = {};
                    group.name = data.name();
                    group.phoneNumber = data.phoneNumber();
                    group.groupSize = data.groupSize();
                    app.data.emit("add group", group);
                }
            });
        };
        
        self.removeGroup = function (index) {
            app.data.emit("remove group",index());
        };

        self.editGroup = function(group){
            dialog.show("../addGroup", group, 'bootstrap').then(function (data) {
                if (data.createGroup) {
                    group = {};
                    group.name = data.name();
                    group.phoneNumber = data.phoneNumber();
                    group.groupSize = data.groupSize();
                    group.id = data.id;
                    app.data.emit("edit group", group);
                }
            });
        }
        
        self.sendGroup = function () {
            app.data.emit("next", true);
            app.data.emit("mazeStatus",'warn');
        };
        
        self.shiftGroupsUp = function () {
            app.data.emit("next", false);
        };
        
        self.shiftGroupsDown = function () {
            app.data.emit("back", false);
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
                var notifyAlert = $('<div id="notification" class="alert alert-info animated invisible col-sm-6" style="z-index:1000000;position:absolute;left:25%;" role="alert">You have sent a notification to '+self.nextGroup().name+'</div>');
                notifyAlert.removeClass('invisible');
                notifyAlert.addClass('fadeInDown');
                $('body').prepend(notifyAlert).delay(2000).promise().then(function (e) {
                    notifyAlert.removeClass('fadeInDown');
                    notifyAlert.addClass('fadeOutUp');
                });
            }
            app.data.emit("send reminder text");
        };
        
        self.showIcons = function (data, event) {
            var icons = $(event.currentTarget).find('i');
            icons.removeClass('invisible');
            icons.removeClass('fadeOut');
            icons.addClass('fadeIn');
        };
        
        self.hideIcons = function (data, event) {
            var icons = $(event.currentTarget).find('i');
            icons.removeClass('fadeIn');
            icons.addClass('fadeOut');
        };

        self.groupDisplay = function(numPeople){
            if(numPeople == 1){
                return "1 person";
            }else if (numPeople != null){
                return numPeople + " people";
            }
        }

        self.attached = function(){
            app.data.emit("getState");
        };
    };

    return Queue;
});
