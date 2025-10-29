# Twitter-Clone React App

## Description

The client React application hosted with Firebase Hosting.

## Technologies used

-   TypeScript - a high-level, multi-paradigm programming language.

-   Node.JS - free, open-source, cross-platform JavaScript runtime environment.

-   npm - package manager for the JavaScript programming language maintained by npm, Inc., a subsidiary of GitHub.

-	Firebase - a platform from Google that provides tools and services to help developers build, grow, and manage high-quality mobile and web applications.

-   React - a free and open-source front-end JavaScript library for building user interfaces.

-   Vite - a build tool and development server for modern JavaScript projects, designed to provide a fast and lean development experience.

-	React Router - "A user‑obsessed, standards‑focused, multi‑strategy router".

-	TanStack Query - a library designed for managing server state in web applications

-	Zustand - "A small, fast, and scalable bearbones state management solution".

-	Shadcn - "A set of beautifully designed components that you can customize, extend, and build on."

## Structure

The application allows its users to perform actions, described in `Features` sections of root `README.md`, on the pages dedicated to the features.

The pages are accessible with `React Router`. Authentication is done using custom tokens from functions on sign up or with Firebase client package.

## Installation

The project's apps use `npm` as the package manager.

```shell
$ npm install
```

## Running the app

The application connects to functions' Firebase Emulations for storage and authentication.

Run the script to start the app in development:

```shell
$ npm run dev
```

Set up the `.env.local` with variables as shown in `.env.example`. For deployment, create `.env.production` without `VITE_EMULATION_*` variables. For GitHub Actions deployment, set up the secrets/variables in your repo.
