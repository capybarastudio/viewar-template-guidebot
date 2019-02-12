# GuideBOT

GuideBOT

## Installation

### Initialize a template project

We recommend to install this template by using the viewar-cli:<br>

- Install viewar-cli: <br>`npm install -g viewar-cli`.<br><br>
- Log in with your ViewAR account: <br>`viewar login`<br><br>
- Initialize a project in a new directory: <br>`viewar init PROJECTNAME`<br><br>
- _Select the user account for this app:_ navigate to your account.<br><br>
- _Select a project type:_ Choose the _Sample Template_ to access the Template List.<br><br>
- _Choose a sample template:_ <br>`GuideBOT`<br><br>
- _Enter the app ID:_ Define the _Bundle ID_ you will be using to access your application through the SDK App. We suggest using a syntax of _company.project_.<br><br>
- _Enter the app version:_ Unless you have a really good reason, stick to 1.0 as default.<br><br>
- _Select tracker(s)_: Choose the tracking system available on the target device. Choose _ARKit_ for the QR Code version or _Placenote_ for the marker-less version.<br><br>Generally speaking, the QR Code version will work better in a changing environment e.g. crowded exhibition spaces. The marker-less version, on the other hand, will be a better fit for areas with a minimal number of changes e.g. hotel rooms. In order to learn more about the versions differences, supported devices and navigation setup, read the GuideBOT Manual.

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
