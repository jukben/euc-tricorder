<h1>EUC Tricorder
  <img src="https://user-images.githubusercontent.com/8135252/75193561-cb6ddc00-5756-11ea-81c0-f0528067a4e3.png"
       align="right" width="128" height="128" />
</h1>

EUC Tricorder is expermintal monitor application for your [EUC](https://en.wikipedia.org/wiki/Electric_unicycle).

This project currently supports only iOS platform and it has companion app for Pebble Watch (sweet nostalgia). It's based on my previous project - [kingsong-web-controller](https://github.com/jukben/kingsong-web-controller).

The goal is to create the best OSS monitor/diagnostic tool (official apps are always bit clumsy, EUC World is only for Android and Darknessbot is not my fav) for [EUC](https://en.wikipedia.org/wiki/Electric_unicycle) to guide me on my adventures with my lovely KingSong 18XL unicycle.

This project is heavily under construction. I'm building it primarily to please my self. But I'm playing with an idea that at some point it might be useful for others as well. Especially if they ride the same combo like I do: Pebble Watch, some speakers, Flic button.

> 🚧 This project is heavily under construction.

## Supports

- Supports only KingSong (18L), but it's designed in a way to easily write connectors for other unicycles.
- Possible to connect with EUC Tricorder Pebble Watch App
- Possible to connect with Flic Button (to trigger voice information)

## Contribution

### React Native

If you want to collaborate on this, please reach me out. Otherwise you should be able to build it. Install dependencies with Yarn, then build it for release in Xcode.

### Pebble

In order to develop for Pebble, you can use the `./run-pebble` command which will run Docker container and open its terminal with `pebble` binary.

```bash
pebble build && pebble install --phone IP
```

## Known issues

- <https://github.com/Polidea/react-native-ble-plx/issues/426>

## License

MIT
