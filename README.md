# Peerkat NFT Viewer

### Description

A frontend application to be deployed as an [xApp](https://xumm.readme.io/docs/what-are-xapps) on the [Xumm App](https://xumm.app/) platform. The purpose of this application is to enable *Xumm* Users to view and share image/video assets related to NFTs issued on the [XRPL](https://xrpl.org/index.html) network. This application currently supports XRPL-issued NFTs based on the [XLS14d](https://github.com/XRPLF/XRPL-Standards/discussions/30) standard and will also be upddated to support [XLS-20d](https://github.com/XRPLF/XRPL-Standards/discussions/46) standard NFTs.


### Setup

Create a ".env" file similar to the one shown by the file called ".env.example". 

#### Environment variables:

VITE_XUMM_API_KEY *(Required)*

VITE_XUMM_SANDBOX *(Optional)* *{For adding a suffix to the Xumm sandbox link i.e xumm.app/detect/xapp:my-project.sandbox.suffix}*

Other environment variables for analytics such as mixpanel and google analytics are also optional.


### Framework

A [Vue 3](https://v3.vuejs.org/) + [Typescript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/) application


### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur). Make sure to enable `vetur.experimental.templateInterpolationService` in settings!


### Feedback

For any feedback/queries please email [support@peerkat.io](mailto:support@peerkat.io)
