# GuessGPT
This is the front-end application for an AI-enabled word guessing game.

## Initial setup
Prerequisites for running this application include having Node.js installed and obtaining an OpenAI API key.

Node.js can be downloaded from here: https://nodejs.org/en/download
OpenAI API keys can be accessed through this link upon creating an OpenAI account: https://platform.openai.com/account/api-keys

Upon satisfying these prerequisites, pull down the source code from this repository. Navigate to the app.component.ts file and go to line 21, `apiKey`. Replace the empty string value with your OpenAI API key and save the changes. Open a terminal and run `npm install` to install all required dependencies. Once all dependencies are successfully installed, run `ng serve` to launch the dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

 To generate bulk data output for a given model when the app is running, first select a model from the model dropdown. Then select the 'Run Game for All Words and Export to JSON' button. Upon the completion of the run, a JSON file with the results for the given model will download.

To run the Python analytics, first have Python 3 and pip installed and this repository pulled down. Then run `pip install pandas` in your terminal and chosen Python environment. Then run the Python script generate-statistics.py. You can then select from your file system one of the JSON results files generated earlier. The statistics will then be generated and displayed in your terminal.

## Angular
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
