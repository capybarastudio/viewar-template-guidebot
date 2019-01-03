# GuideBOT

GuideBOT

## Installation

### Initialize a template project

We recommend to install this template by using the viewar-cli:<br>

- Install viewar-cli: <br>`npm install -g viewar-cli`.<br><br>
- Initialize a project: <br>`viewar-cli init`<br><br>
- _Select the user account for this app:_ navigate to your account.<br><br>
- _Select a project type:_ Choose the _Sample Template_ to access the Template List.<br><br>
- _Choose a sample template:_ <br>`QR Navigation`<br><br>
- _Enter the app ID:_ Define the _Bundle ID_ you will be using to access your application through the SDK App. We suggest using a syntax of _company.project_.<br><br>
- _Enter the app version:_ Unless you have a really good reason, stick to 1.0 as default.<br><br>
- _Select tracker(s)_: Choose the tracking system available on the target device - go for _ARKit_ or _ARCore_.

### Run application in the browser

You have 2 modes to choose from:<br>

- <b>mock mode</b> (no 3D content, mock buttons for AR tracking simulation): <br>`npm run start:mock` <br><br>
- <b>full browser mode</b> (download 3D content, no mock buttons for AR tracking simulation): <br>`npm run start`

### UI Config

Following settings are available in the ui config:

```js
{
  googleAnalyticsKey: false,      // Google analytics api key for logging
  googleMapsKey: false,           // Google maps api key
  auth: false,                    // Show/hide button in home view to authenticate
  originModel: false,             // Model to be inserted at origin (0/0/0)
  infoText: '',                   // Text displayed in info view as html
  live: true,                     // Enable/disable AR view
  roomPlanner: true,              // Enable/disable room planner
  shoppingCart: true,             // Enable/disable shopping cart
  share: true,                    // Enable/disable sharing
  projects: true,                 // Enable/disable project saving/loading
  showPropertyList: false,        // Show properties as list instead of a slider
  showCategoryImages: false,      // Show category images instead of a list
  checkoutUrl: false,             // URL for report generation
  introVideo: false,              // URL to video played in home view background,
  shopFinder: false,              // Displays shop finder button in home view. Either a string or { url, type }. Possible types: 'external', 'json' or 'iframe'.
  cloudProjects: false,           // Enable/disable saving to/loading from cloud storage.
  hideRoomWalls: false,           // Insert new walls hidden per default.
  noCollision: false,             // Disable collision with room.
  roomExport: false,              // Enable room export as obj.
  oldDeviceWarning: true,         // Enable warning if device runs with wikitude tracking only.
  advancedAuthentication: false,  // Use advanced authentication with logins from http://dev2.viewar.com/auth/list.
}
```

## Support

Documentation: https://viewar.gitbooks.io/sdk-documentation/content/
<br>Tutorials: https://developer.viewar.com/site/tutorials
