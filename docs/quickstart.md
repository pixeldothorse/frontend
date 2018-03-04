# Getting started

For now, this setup is pretty basic, but we'll see how it changes once this and the backend are integrated into one build process.

## Prerequisites

- `node` (should work on whatever version you have on hand, but let me know if not)
- `yarn` (latest)

## Installing dependencies

1. Clone the repository.
2. `cd frontend`
3. `yarn install`

Note that `yarn install` will probably take a while. There's a lot of build dependencies for this project.

## Building and running

1. `yarn build`
2. Sit back and relax for a moment; the build process takes an upwards of 15 seconds.
3. `cd dist`
4. Spawn a development web server of choice here. I recommend `php -S localhost:8000` or `python -m http.server`.
5. Navigate to https://localhost:8000. You should see a working frontend assuming everything worked correctly.
6. (*optional*) If you want to share this with other people, use something like [ngrok](https://ngrok.com/) to tunnel traffic to your local HTTP server. The command you should use is `ngrok http 8000`.
