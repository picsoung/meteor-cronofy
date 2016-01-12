Cronofy = {};

// Request Facebook credentials for the user
//
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Cronofy.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'cronofy'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  var credentialToken = Random.secret();

  var scope = "list_calendars create_calendar read_events create_event delete_event";
  // if (options && options.requestPermissions)
  //   scope = options.requestPermissions.join(',');

  var loginStyle = OAuth._loginStyle('cronofy', config, options);

  var loginUrl =
        'https://app.cronofy.com/oauth/authorize?client_id=' + config.client_id +
        '&redirect_uri=' + OAuth._redirectUri('cronofy', config) +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl)+
        '&scope='+scope+
        '&response_type=code';

  OAuth.launchLogin({
    loginService: "cronofy",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
};
