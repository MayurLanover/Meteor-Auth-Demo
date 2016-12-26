import { Meteor } from 'meteor/meteor';
//import { MeteorOAuth2 } from 'meteor/prime8consulting_meteor-oauth2-client';

Meteor.startup(() => {
   
});

Meteor.methods({  
    resetServiceConfiguration: function() {        
        ServiceConfiguration.configurations.remove({
            service: MeteorOAuth2.serviceName // using the constant provided by the package, easy for refactoring.
        });
    },
    getUserId: function() {
        var user = Meteor.user();
        var serviceConfig = ServiceConfiguration.configurations.findOne({
            service: MeteorOAuth2.serviceName
        });

        return HTTP.get(
            serviceConfig.baseUrl + '/api/getUserId',            {
                params: {
                    access_token: user.services.MeteorOAuth2Server.accessToken
                }
            }
        );
    }
});

