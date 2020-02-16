# EUC Tricorder

> 🚧 This project is heavily under construction.

## About

This project currently supports only iOS platform and it has companion app for Pebble Watch (sweet nostalgia). It's based on my previous project - [kingsong-web-controller](https://github.com/jukben/kingsong-web-controller).

The goal is to create the best monitor/diagnostic tool (official apps are always bit clumsy, EUC World is only for Android and Darknessbot is not my fav) for [EUC](https://en.wikipedia.org/wiki/Electric_unicycle) to guide me on my adventures with my lovely KingSong 18XL unicycle.

This project is heavily under construction. I'm building it primarily to please my self. But I'm playing with an idea that at some point it might be useful for others as well. Especially if they ride the same combo like I do: Pebble Watch, some speakers, Flic button.

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

## Screenshots

<img width="300" alt="pebble" src="https://user-images.githubusercontent.com/8135252/74612118-bcf24580-5102-11ea-8567-5674a8cacdfd.PNG">
<br>
<img width="176" alt="pebble" src="https://user-images.githubusercontent.com/8135252/74612108-a1873a80-5102-11ea-9a78-ae5f6425c146.png">

## License

MIT
