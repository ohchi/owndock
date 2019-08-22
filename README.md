# Owndock

Owndock is a web application that allows to construct your own local development environment based on the famous [laradock](https://laradock.io) project.

## Why should I use it?

Typical usage of [laradock](https://laradock.io) consists in cloning it into your project folder and creating `.env` file with specific settings. But usually it does not end there. Your have to tune config files or even edit dockerfiles. Finally your get working containers, but changes... they must be saved somewhere and somehow to be able reproduse the configuration. Obviously it could be more convinient to have your own dockerfiles, configs and no unnecessary services. In other words, this development environment should be created for specific project and should be distributed along with its source code. [Laradock](https://laradock.io) is a good starting point for creating such environment. 

Owndock provides simple UI for creating that starting point letting you get rid of tedious work. The next steps are up to you.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running tests

This project has no unit or end-to-end tests yet.

## License

[MIT license](https://opensource.org/licenses/MIT).
