# GuideBOT

GuideBOT

## Installation

### Initialize a template project

We recommend to install this template by using the viewar-cli:<br>

- Install viewar-cli: `npm install -g viewar-cli`.<br><br>
- Log in with your ViewAR account: `viewar login`<br><br>
- Initialize a project: `viewar init`<br><br>
- _Select the user account for this app:_ navigate to your account.<br><br>
- _Select a project type:_ Choose the _Sample Template_ to access the Template List.<br><br>
- _Choose a sample template:_ `GuideBOT`<br><br>
- _Enter the app ID:_ Define the _Bundle ID_ you will be using to access your application through the SDK App. We suggest using a syntax of _company.project_.<br><br>
- _Enter the app version:_ Unless you have a really good reason, stick to 1.0 as default.<br><br>
- _Select tracker(s)_: GuideBOT is available in 2 tracking system versions - with QR codes or the Placenote tracking. Please choose between them here. `Placenote`/
  `QR`<br>

### Run application in the browser

You have 2 modes to choose from:<br>

- <b>mock mode</b> (no 3D content, mock buttons for AR tracking simulation): <br>`npm run start:mock` <br><br>
- <b>full browser mode</b> (download 3D content, no mock buttons for AR tracking simulation): <br>`npm run start`

## Support

Documentation: https://viewar.gitbooks.io/sdk-documentation/content/
<br>Tutorials: https://developer.viewar.com/site/tutorials

### UI Config

Following settings are available in the ui config:

```js
{
  infoText: '',
  speechDisabled: false,
  chatbotUrl: false,
  greetUser: 'Hi there! How can I help you?',
  followMe: 'Sure, follow me!',
  selectPoi: 'Hi there! Please select a point of interest.',
  }
```

###Authentication
The application provides an authentication functionality. It is only after login that new maps may be created. Login possible with the [Developer Portal](https://developer.viewar.com) credentials (after clicking the padlock icon in the home screen).
