const Moment = require("moment-timezone");
const _ = require("lodash");

export function yell(msg: string): string {
  return msg.toUpperCase();
}

export function moment(context: any, block: any) {
  if (context && context.hash) {
    block = _.cloneDeep(context);
    context = undefined;
  }

  let date = Moment(context);

  if (block.hash.timezone) {
    date.tz(block.hash.timezone);
  }
  let hasFormat = false;

  date.lang("en");

  for (var i in block.hash) {
    if (i === "format") {
      hasFormat = true;
    } else if (date[i]) {
      date = date[i](block.hash[i]);
    } else {
      console.log('moment.js does not support "' + i + '"');
    }
  }

  if (hasFormat) {
    date = date.format(block.hash.format);
  }
  return date;
}

export function duration(context: any, block: any) {
  if (context && context.hash) {
    block = _.cloneDeep(context);
    context = 0;
  }
  var duration = Moment.duration(context);
  var hasFormat = false;

  // Reset the language back to default before doing anything else
  duration = duration.lang("en");

  for (var i in block.hash) {
    if (i === "format") {
      hasFormat = true;
    } else if (duration[i]) {
      duration = duration[i](block.hash[i]);
    } else {
      console.log('moment.js duration does not support "' + i + '"');
    }
  }

  if (hasFormat) {
    duration = duration.format(block.hash.format);
  }
  return duration;
}
