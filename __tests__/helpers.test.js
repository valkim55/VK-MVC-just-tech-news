// testing the handlebars.js helper functions to make dates in the app more reliable
// make the dates more readable by writing test for a function format_date() that takes Date() objects and returns dates in the MM/DD/YYYY format

const {format_date} = require('../utils/helpers');

test('format_date() returns a date string', () => {
    const date = new Date('2022-11-01 12:13:03');

    expect(format_date(date)).toBe('11/1/2022');
});


const {format_plural} = require('../utils/helpers');

test('should pluralize words if its a multiple', () => {
    const word1 = format_plural('tiger', 1);
    const word2 = format_plural('lion', 2);

    expect(word1).toBe('tiger');
    expect(word2).toBe('lions');
});


const {format_url} = require('../utils/helpers');

test('format_url() returns a simplified url string', () => {
    const url1 = format_url('http://test.com/page/1/');
    const url2 = format_url('https://www.coolstuff.com/abcdefg/');
    const url3 = format_url('https://www.google.com?q=hello');

    expect(url1).toBe('test.com');
    expect(url2).toBe('coolstuff.com');
    expect(url3).toBe('google.com');
});