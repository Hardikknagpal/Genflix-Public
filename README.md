# GenFlix



A Netflix-like mobile application built with Expo and React Native, featuring a modern UI and integration with the TMDb API.

<h2>📱 App Screenshots</h2>

<img src="https://github.com/user-attachments/assets/42e6baf2-4698-42d7-8e09-6dff9c179882" alt="Home Screen" width="300"/>
<img src="https://github.com/user-attachments/assets/3b830f4e-4025-4f30-b25d-ecd5b8bb7378" alt="Login Screen" width="300"/>
<img src="https://github.com/user-attachments/assets/28f4082e-c5b3-43a8-a2bf-2eb2ecd7bbea" alt="Profile Screen" width="300"/>
<img src="https://github.com/user-attachments/assets/53610f13-ebc5-4415-bbed-ca86c5da374c" alt="Detail Screen" width="300"/>
<img src="https://github.com/user-attachments/assets/415f5eeb-18b3-4e62-a03b-fb7bfd3c3415" alt="List Screen" width="300"/>
<img src="https://github.com/user-attachments/assets/8e8e7b19-3fa4-4cf2-b9fe-2340a6081d5c" alt="Splash Screen" width="300"/>



## Features

- Browse trending and popular movies and TV shows
- Search for movies and TV shows
- View detailed information about movies and TV shows
- Add movies and TV shows to favorites
- Beautiful Netflix-inspired UI
- Dark theme
- Responsive design

## Technologies Used

- Expo
- React Native
- TypeScript
- TMDb API
- Expo Router for navigation
- AsyncStorage for local storage
- Axios for API requests
- Lodash for utility functions

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/genflix.git
cd genflix
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your TMDb API key & AWS Cognito details along with GraphQL API:
```
TMDB_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npx expo start
# or
yarn expo start
```

5. Run on your device or emulator:
- Press `a` to run on Android emulator
- Press `i` to run on iOS simulator
- Scan the QR code with the Expo Go app on your android physical device or with camera App on iOS physical device


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [TMDb](https://www.themoviedb.org/) for providing the movie and TV show data
- [Expo](https://expo.dev/) for the amazing development platform
- [React Native](https://reactnative.dev/) for the cross-platform framework
