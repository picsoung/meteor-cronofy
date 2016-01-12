Cronofy = {};

OAuth.registerService('cronofy', 2, null, function(query) {

  var response = getTokenResponse(query);
  var accessToken = response.accessToken;
  var refreshToken = response.refreshToken;

  var identity = getIdentity(accessToken);
  var serviceData = {
    id: identity.calendars[0].profile_id,
    accessToken: accessToken,
    refreshToken: refreshToken,
    expiresAt: new Date(new Date().getTime()+1000 * response.expiresIn)
  };

  return {
    serviceData: serviceData,
    options: {profile: {cronofy_id: identity.calendars[0].profile_id,calendars: identity.calendars}}
  };
});

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'cronofy'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var responseContent;
  try {
    // Request an access tokenc
    responseContent = HTTP.post(
      "https://api.cronofy.com/oauth/token", {
        params: {
          client_id: config.client_id,
          client_secret: config.client_secret,
          redirect_uri: OAuth._redirectUri('cronofy', config),
          code: query.code,
          grant_type:"authorization_code"
        }
      }).content;
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Cronofy. " + err.message),
                   {response: err.response});
  }

  // Success!  Extract the cronofy access token and expiration
  // time from the response
  var parsedResponse = JSON.parse(responseContent);
  var cronofyAccessToken = parsedResponse.access_token;
  var cronofyExpires = parsedResponse.expires_in;

  if (!cronofyAccessToken) {
    throw new Error("Failed to complete OAuth handshake with  cronofy " +
                    "-- can't find access token in HTTP response. " + responseContent);
  }
  return {
    accessToken: cronofyAccessToken,
    expiresIn: cronofyExpires,
    refreshToken: parsedResponse.refresh_token
  };
};

var getIdentity = function (accessToken, fields) {
  try {
    return HTTP.get("https://api.cronofy.com/v1/calendars", {
      headers:{
        "Authorization":"Bearer "+accessToken
      }
    }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Cronofy. " + err.message),
                   {response: err.response});
  }
};

Cronofy.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
