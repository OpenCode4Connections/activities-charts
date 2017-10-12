# activities-charts

## Setup
- Add Activities_Charts.json application to your Conenctions organisation.
- Ensure the include-files property pulls the correct path referencing the activitiescharts.js file
- Register Internal App in your organization in IBM Connections Cloud, chose OAuth 2.0 but don't set the Callback URL yet.
- Send the ClientID, the Client Secret and the full Company Name to solutions@computerplus.com.pl.
- Put the Callback URL from a reply e-mail put in registered Internal App.
- In the activitiescharts.js replace placeholder `[appUrl]` with url form reply e-mail.

## Description
This Customizer application adds an element in the left navigation on the activity page. Selecting `Gantt Chart` in navigation creates a widget, which contains URL to external Gantt Charts application.
Gantt Chart is an application uses OAuth 2.0 to communicate with IBM Connection Cloud and convert data from current activity to chart. Custom date field called `Start date` is being used to generate the start date on the timeline.

Gantt Chart cloud edition is based on [Gantt Charts](https://solutions.computerplus.com.pl/en/gantt-charts) on-premise and doesn't have all functionalities yet.

## Screenshots

![Screenshot 1](https://www.computerplus.com.pl/computerplus-connections/1.png)
![Screenshot 2](https://www.computerplus.com.pl/computerplus-connections/2.png)
![Screenshot 3](https://www.computerplus.com.pl/computerplus-connections/3.png)
![Screenshot 4](https://www.computerplus.com.pl/computerplus-connections/4.png)