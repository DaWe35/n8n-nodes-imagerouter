# [ImageRouter](https://imagerouter.io) Node for n8n

## Screenshots
<img width="841" height="545" alt="Screenshot_20250815_153907" src="https://github.com/user-attachments/assets/2fb5711d-14fb-4af0-8afb-0b3a4375501a" />
<img width="1393" height="935" alt="Screenshot_20250815_153957" src="https://github.com/user-attachments/assets/2e736fcc-b6e4-42cb-a006-29e651b02f8a" />
<img width="478" height="594" alt="Screenshot_20250815_153821" src="https://github.com/user-attachments/assets/4ef5bee7-69cf-4da4-9902-cb8eeb32c8d1" />


## How to install

The package is published on [NPM](
https://www.npmjs.com/package/n8n-nodes-imagerouter), so it's pretty easy to install in n8n.

1. Open `Settings`: <img width="498" height="223" alt="Screenshot_20250815_154224" src="https://github.com/user-attachments/assets/3c4b8293-81c2-421c-acec-ee018f6d919d" />
2. Go to `Community Nodes`: <img width="1010" height="741" alt="Screenshot_20250815_154251" src="https://github.com/user-attachments/assets/90c3732b-41d7-4130-8eef-1a0d09dd22eb" />
3. Install a new community node. Enter `n8n-nodes-imagerouter`: <img width="1010" height="741" alt="Screenshot_20250815_154304" src="https://github.com/user-attachments/assets/782095a7-e3c2-4fa9-991e-82c9fe9c1d89" />

## Get an API key:

Register an [ImageRouter](https://imagerouter.io) account, then go to https://imagerouter.io/api-keys

## What models are available?

More than 80+ image and video model, see the full list here: https://imagerouter.io/models

or download as JSON: https://api.imagerouter.io/v1/models

# n8n Node Development

## Quick start (Docker)

Build the image and start a local n8n instance with the ImageRouter node already available:

```bash
# From the repository root
npm run build
docker compose up --build
```

The first build will perform the following steps:
1. Compile the TypeScript source of this project in an isolated Debian builder stage.
2. Bundle the generated JavaScript and assets into `/home/node/.n8n/custom` inside the image.
3. Launch n8n on port `5678` with the custom ImageRouter node pre-installed.

### Environment variables
The compose file supports a few optional environment variables that you can override when starting the stack.

* `PORT` (default `5678`) – host port that n8n will be exposed on.
* `DOMAIN_NAME` – public hostname of your instance. Used to generate webhook URLs.
* `GENERIC_TIMEZONE` – timezone for n8n, e.g. `Europe/Berlin`.
* `N8N_PROTOCOL` – `http` (default) or `https`.
* `WEBHOOK_URL` – custom public webhook URL (automatically derived from `DOMAIN_NAME` when omitted).

Example:
```bash
DOMAIN_NAME=example.com GENERIC_TIMEZONE=Europe/Berlin docker compose up --build
```

Open <http://localhost:5678> in your browser and search for **ImageRouter** in the node panel to start using the node.

___

# Original Readme:

## n8n-nodes-starter

This repo contains example nodes to help you get started building your own custom integrations for [n8n](https://n8n.io). It includes the node linter and other dependencies.

To make your custom node available to the community, you must create it as an npm package, and [submit it to the npm registry](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry).

If you would like your node to be available on n8n cloud you can also [submit your node for verification](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/).

## Prerequisites

You need the following installed on your development machine:

* [git](https://git-scm.com/downloads)
* Node.js and npm. Minimum version Node 20. You can find instructions on how to install both using nvm (Node Version Manager) for Linux, Mac, and WSL [here](https://github.com/nvm-sh/nvm). For Windows users, refer to Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
* Install n8n with:
  ```
  npm install n8n -g
  ```
* Recommended: follow n8n's guide to [set up your development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).

## Using this starter

These are the basic steps for working with the starter. For detailed guidance on creating and publishing nodes, refer to the [documentation](https://docs.n8n.io/integrations/creating-nodes/).

1. [Generate a new repository](https://github.com/n8n-io/n8n-nodes-starter/generate) from this template repository.
2. Clone your new repo:
   ```
   git clone https://github.com/<your organization>/<your-repo-name>.git
   ```
3. Run `npm i` to install dependencies.
4. Open the project in your editor.
5. Browse the examples in `/nodes` and `/credentials`. Modify the examples, or replace them with your own nodes.
6. Update the `package.json` to match your details.
7. Run `npm run lint` to check for errors or `npm run lintfix` to automatically fix errors when possible.
8. Test your node locally. Refer to [Run your node locally](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/) for guidance.
9. Replace this README with documentation for your node. Use the [README_TEMPLATE](README_TEMPLATE.md) to get started.
10. Update the LICENSE file to use your details.
11. [Publish](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) your package to npm.

## More information

Refer to our [documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building your own nodes.

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
