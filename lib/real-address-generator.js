const pMap = require('p-map');
const nodeGeocoder = require('node-geocoder');
const { randomCirclePoint } = require('random-location');
const { Random } = require('random-js');
const random = new Random();

function realAddressGenerator({
  geocoderOptions,
  centerPoints,
  number,
  radius = 2000,
  isAddressValid = () => true,
  concurrency = 5,
}) {
  const geocoder = nodeGeocoder(geocoderOptions);
  const getCenterPoint = () => random.pick(centerPoints);

  return pMap(
    getIterator(number),
    () => getAddress({ geocoder, getCenterPoint, radius, isAddressValid }),
    { concurrency }
  );
}

async function getAddress({ geocoder, getCenterPoint, radius, isAddressValid }) {
  try {
    const pointInCircle = randomCirclePoint(getCenterPoint(), radius);
    const response = await geocoder.reverse({ lat: pointInCircle.latitude, lon: pointInCircle.longitude });
    const address = response[0];
    if (isAddressValid(address)) {
      return address;
    }
    return getAddress({ geocoder, getCenterPoint, radius, isAddressValid });
  } catch (e) {
    if (e.name === 'HttpError' && e.code === 'ECONNRESET') {
      return getAddress({ geocoder, getCenterPoint, radius, isAddressValid });
    }
  }
}

function* getIterator(number) {
  let i = 0;
  while (i < number) {
    yield i++;
  }
}

module.exports = realAddressGenerator;
