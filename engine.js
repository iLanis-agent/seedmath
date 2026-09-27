/* SeedMath engine - honest seed math: frost dates drive the whole calendar. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SeedEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var DAY = 86400000;

  function parseDate(s) {
    var p = s.split('-');
    return new Date(Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2]), 12));
  }
  function fmt(d) {
    var y = d.getUTCFullYear();
    var m = String(d.getUTCMonth() + 1);
    var dd = String(d.getUTCDate());
    return y + '-' + (m.length < 2 ? '0' + m : m) + '-' + (dd.length < 2 ? '0' + dd : dd);
  }
  function addDays(dateStr, n) {
    return fmt(new Date(parseDate(dateStr).getTime() + n * DAY));
  }
  function addWeeks(dateStr, w) { return addDays(dateStr, Math.round(7 * w)); }

  /* indoorWeeks/directWeeks are weeks relative to last spring frost (negative = before).
     transplantWeeks is weeks relative to last frost (negative = before, for hardy crops).
     days = days to maturity (from transplant for indoor crops, from sowing for direct).
     germ = germination rate, packet = seeds per packet, succession = days between repeat sowings (0 = none). */
  var CROPS = {
    tomato:    { name: 'Tomato',     indoorWeeks: 6,    transplantWeeks: 2,  directWeeks: null, days: 75,  spacingIn: 24, germ: 0.80, packet: 30,  succession: 0  },
    pepper:    { name: 'Pepper',     indoorWeeks: 8,    transplantWeeks: 2,  directWeeks: null, days: 80,  spacingIn: 18, germ: 0.70, packet: 25,  succession: 0  },
    basil:     { name: 'Basil',      indoorWeeks: 6,    transplantWeeks: 2,  directWeeks: 2,    days: 60,  spacingIn: 10, germ: 0.75, packet: 100, succession: 21 },
    cucumber:  { name: 'Cucumber',   indoorWeeks: 3,    transplantWeeks: 1,  directWeeks: 1,    days: 60,  spacingIn: 12, germ: 0.80, packet: 30,  succession: 0  },
    zucchini:  { name: 'Zucchini',   indoorWeeks: 3,    transplantWeeks: 1,  directWeeks: 1,    days: 50,  spacingIn: 36, germ: 0.85, packet: 20,  succession: 0  },
    kale:      { name: 'Kale',       indoorWeeks: 5,    transplantWeeks: -2, directWeeks: -4,   days: 55,  spacingIn: 12, germ: 0.80, packet: 100, succession: 21 },
    lettuce:   { name: 'Lettuce',    indoorWeeks: null, transplantWeeks: null, directWeeks: -4, days: 45,  spacingIn: 6,  germ: 0.80, packet: 250, succession: 14 },
    carrot:    { name: 'Carrot',     indoorWeeks: null, transplantWeeks: null, directWeeks: -3, days: 70,  spacingIn: 2,  germ: 0.65, packet: 500, succession: 21 },
    beans:     { name: 'Bush beans', indoorWeeks: null, transplantWeeks: null, directWeeks: 1,  days: 55,  spacingIn: 4,  germ: 0.85, packet: 60,  succession: 14 },
    sunflower: { name: 'Sunflower',  indoorWeeks: null, transplantWeeks: null, directWeeks: 1,  days: 80,  spacingIn: 18, germ: 0.90, packet: 40,  succession: 0  }
  };

  function cropCalendar(key, lastFrost, fallFrost) {
    var c = CROPS[key];
    if (!c) throw new Error('unknown crop ' + key);
    var cal = { crop: c.name, startIndoor: null, transplant: null, directSow: null, harvest: null, successions: [] };
    if (c.indoorWeeks !== null) {
      cal.startIndoor = addWeeks(lastFrost, -c.indoorWeeks);
      cal.transplant = addWeeks(lastFrost, c.transplantWeeks);
      cal.harvest = addDays(cal.transplant, c.days);
    }
    if (c.directWeeks !== null) {
      cal.directSow = addWeeks(lastFrost, c.directWeeks);
      if (!cal.harvest) cal.harvest = addDays(cal.directSow, c.days);
      if (c.succession > 0) {
        var d = cal.directSow;
        while (addDays(d, c.days) <= fallFrost) {
          cal.successions.push(d);
          d = addDays(d, c.succession);
        }
      } else {
        cal.successions = [cal.directSow];
      }
    }
    return cal;
  }

  function plantsForBed(lenFt, widFt, spacingIn) {
    var across = Math.floor((lenFt * 12) / spacingIn);
    var down = Math.floor((widFt * 12) / spacingIn);
    return across * down;
  }
  function seedsNeeded(plants, germ) { return Math.ceil(plants / germ); }
  function packetsNeeded(seeds, perPacket) { return Math.max(1, Math.ceil(seeds / perPacket)); }

  return {
    CROPS: CROPS,
    parseDate: parseDate,
    fmt: fmt,
    addDays: addDays,
    addWeeks: addWeeks,
    cropCalendar: cropCalendar,
    plantsForBed: plantsForBed,
    seedsNeeded: seedsNeeded,
    packetsNeeded: packetsNeeded
  };
});
