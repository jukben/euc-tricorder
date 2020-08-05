<h1>EUC Tricorder
  <img src="https://user-images.githubusercontent.com/8135252/75193561-cb6ddc00-5756-11ea-81c0-f0528067a4e3.png"
       align="right" width="128" height="128" />
</h1>

EUC Tricorder an is expermintal monitor application for your [EUC](https://en.wikipedia.org/wiki/Electric_unicycle).

This project currently supports iOS platform only and it has companion app only Pebble Watch (sweet nostalgia). It's based on my previous project - [kingsong-web-controller](https://github.com/jukben/kingsong-web-controller).

The goal of this project was to explore comunication protocol of EUC and also refresh state of React Native development. 

To be honest, I built this primarily to for myself. However I do own Apple Developer account and this project has its pipeline on AppCenter, so in case you don't want to build the app on your own, contact me and I will add you into a distribution group.

## Supports

- Supports only KingSong (18L) for now, but it's designed in a way to easily write connectors for other unicycles / devices
- Possible to connect with EUC Tricorder Pebble (Rebble) Watch App (you have to build it manually!)
- Possible to connect with Flic Button to trigger voice information

## Screenshots

<div>
  <img src="https://user-images.githubusercontent.com/8135252/89432722-bb184f00-d741-11ea-86b3-658a9ecb8e3a.PNG" width="200" align="center"/>
  <img src="https://user-images.githubusercontent.com/8135252/89434364-c1a7c600-d743-11ea-9a3e-ac99bf03e0c9.PNG" width="200" align="center"/>
  <img src="https://user-images.githubusercontent.com/8135252/89432820-daaf7780-d741-11ea-9ae5-f259ac6584d2.jpg" width="200" align="center"/>
</div>

## Contribution

### React Native

If you want to collaborate on this, please reach me out. Anyway, you should be able to build it quite easily. Install dependencies with Yarn, then build it for release in Xcode.

### Pebble

In order to develop for Pebble, you can use the `./run-pebble` command which will run Docker container and open its terminal with `pebble` binary.

```bash
pebble build && pebble install --phone IP
```

## License

MIT
