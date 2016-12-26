import { Template } from 'meteor/templating';
import { getUserIdResult } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  
});

Template.hello.helpers({
   getUserAccessToken: function() {
        return getUserAccessToken();
    },

    getUserIdResult: function() {
        return getUserIdResult.get();
    },

    getUserOAuth2Id: function() {
        var user = Meteor.user();

        if (!isOAuth2User(user)) {
            return;
        }

        return user.services.MeteorOAuth2Server.id;
    }
});

Template.hello.events({   
    'click button.resetServiceConfiguration': function() {
        Meteor.call('resetServiceConfiguration');
    },
    'click button.testLocalTokens': function() {
        if (getUserAccessToken()) {
            Meteor.call('getUserId', function(err, result) {
                console.log(result);
                // set the userId.
                getUserIdResult.set(result.data);
            });
        } // if
    } // function
});


/**
 * Determine if a user originates from an oauth2 login.
 * @param user
 * @returns {*}
 */
function isOAuth2User(user) {
    return user
        && user.services
        && user.services.MeteorOAuth2Server
        ;
}

/**
 * Get the user access token if it exists.
 * @returns {*}
 */
function getUserAccessToken() {
    var user = Meteor.user();

    if (!isOAuth2User(user)) {
        return;
    }

    return user.services.MeteorOAuth2Server.accessToken;
}


/*
    This file just contains convenient methods for auto-filling the oauth2 login form configuration. None
    of the code here is important for implementing oauth2 on your site.
 */

$(document).ready(function() {
    // update the fields when the dialog is dynamically added.
    $(document).on('DOMNodeInserted', '#configure-login-service-dialog', function(e) {
        populateServiceValues(e.target);
    });

    // update the fields on page load.
    populateServiceValues($('#configure-login-service-dialog'));
});

function populateServiceValues(target) {
    var setCount = 0;
    setCount += prePopulateValues(target, 'configure-login-service-dialog-clientId', 'clientApplication');
    setCount += prePopulateValues(target, 'configure-login-service-dialog-secret', '12345');
    setCount += prePopulateValues(target, 'configure-login-service-dialog-baseUrl', 'http://localhost:3100');
    setCount += prePopulateValues(target, 'configure-login-service-dialog-loginUrl', 'http://localhost:3100');

    // a hacky way to make the meteor configure interface make the save button
    // enabled. it only enables if it detects key up events in the input fields.
    if (setCount) {
        $('#configure-login-service-dialog-clientId').trigger('keyup', 17);
    }
}

function prePopulateValues(target, id, value) {
    var el = $(target).find('#' + id);
    if (!el.length) {
        return false;
    }

    if (!el.val()) {
        el.val(value);
        return true;
    }

    return false;
}
