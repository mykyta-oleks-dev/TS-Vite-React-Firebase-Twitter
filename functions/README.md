# Twitter-Clone Express Functions

## Description

The server application hosted with Firebase Functions (Google Cloud Functions).

## Technologies used

-   TypeScript - a high-level, multi-paradigm programming language.

-   Node.JS - free, open-source, cross-platform JavaScript runtime environment.

-   npm - package manager for the JavaScript programming language maintained by npm, Inc., a subsidiary of GitHub.

-	Firebase - a platform from Google that provides tools and services to help developers build, grow, and manage high-quality mobile and web applications.

-	Express - a fast, unopinionated, minimalist web framework for Node.js.

-	Firebase Admin - a set of server libraries that lets an app interact with Firebase from privileged environments.

-	Firebase Firestore - flexible, scalable NoSQL cloud database, built on Google Cloud infrastructure.

-	Firebase Functions - single-purpose JavaScript (and Python) functions that are executed in a secure, managed serverless environment.

-	NodeMailer - "Easy as cake e-mail sending from your Node.js applications."

-	Ethereal Email - a free, fake SMTP service used by developers to test sending emails without actually delivering them. Used in the demo purposes and easy to switch for commercial deployments.

## Structure

The application provides an Express app to Firebase Functions definition with 2 main route groups: `users` and `posts`.

Under `users` are routes for registration and writing user data into Firestore, managing user documents and user auth records (update, delete, change password), sending emails with password reset or email verification links.

Under `posts` are routes for managing post documents themselves with authentication for creation, authorization for update and delete operations, as well as subroutes for managing `likes` and `comments` with authentication/authorization for the specific post.

The app uses custom middlewares for authentication, authorization, handling errors.

## Installation

The project's apps use `npm` as the package manager.

```shell
$ npm install
```

## Running the app

The application uses Firebase Emulations for storage, firestore, authentication.

Run the script to start the app in development:

```shell
$ npm run dev
```

Set up the secrets for SMTP and Algolia search as defined in `src/config/secrets.ts`.
