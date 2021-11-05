const appConfig = {
  clients: {
    spire: {
      baseURL: process.env.SPIRE_API_PATH,
      token: process.env.SPIRE_API_TOKEN,
    },
    exactEarth: {
      baseURL: process.env.EXACT_EARTH_API_PATH,
      token: process.env.EXACT_EARTH_API_TOKEN,
    },
  },
};

export default appConfig;
