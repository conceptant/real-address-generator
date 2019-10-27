# real-address-generator
Generates real addresses using [node-geocoder](https://www.npmjs.com/package/node-geocoder)

## Usage example
```js

const realAddressGenerator = require('real-address-generator');
const pointNewYork = {
  latitude: 40.73061,
  longitude: -73.935242,
};
const pointSanFrancisco = {
  latitude: 37.773972,
  longitude: -122.431297,
};
const addresses = await realAddressGenerator({
  number: 10,
  centerPoints: [pointNewYork, pointSanFrancisco],
  geocoderOptions: {
    provider: 'google',
    apiKey: 'YOUR_API_KEY',
    language: 'en',
  },
  radius: 2000, // in meters
  isAddressValid: address => {
    const { streetName, streetNumber, zipcode } = address;
    return streetName && streetNumber && zipcode;
  },
  concurrency: 3,
});

```

It generates `10` random addresses that are inside the `2000` meters radius circle from one of randomly selected points specified in `centerPoints`.  

`isAddressValid` - counts address as valid. By default every address is valid.    
**NOTE**: if generated address does not pass `isAddressValid` function next address will be generated recursively with new randomly chosen point.  
Therefore be careful with `isAddressValid` code, it's incorrectness may lead to infinite requesting.   

`concurrency` - number of concurrent requests.  Default is `5`.

Latitude and Longitude coordinates found here: https://www.latlong.net/ 


