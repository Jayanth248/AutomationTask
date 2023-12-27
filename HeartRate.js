const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
// Read the input JSON file
const rawData = fs.readFileSync('heartrate.json');
const heartRateData = JSON.parse(rawData);
// Group data by date
const groupedByDate = _.groupBy(heartRateData, entry => moment(entry.timestamps.startTime).format('YYYY-MM-DD'));
// Calculate statistics for each day

const result = Object.keys(groupedByDate).map(date => {
  const dailyData = groupedByDate[date];
  const beatsPerMinute = dailyData.map(entry => entry.beatsPerMinute);
  const median = (array) => {
    array.sort((a, b) => b - a);
    const length = array.length;
    if (length % 2 == 0) { return (array[length / 2] + array[(length / 2) - 1]) / 2; }
    else { return array[Math.floor(length / 2)]; }
  }
  return {
    date,
    min: _.min(beatsPerMinute),
    max: _.max(beatsPerMinute),
    median: median(beatsPerMinute),
    latestDataTimestamp: moment(_.maxBy(dailyData, entry => moment(entry.timestamps.endTime))).format()
  };
});
// Write the result to output.json
fs.writeFileSync('output.json', JSON.stringify(result, null, 2));