Package.describe({
  name: 'picsoung:cronofy',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: 'OAuth logic to access cronofy API',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Cronofy');

  api.addFiles(
    ['cronofy_configure.html', 'cronofy_configure.js'],
    'client');

  api.addFiles('cronofy_server.js', 'server');
  api.addFiles('cronofy_client.js', 'client');
});
