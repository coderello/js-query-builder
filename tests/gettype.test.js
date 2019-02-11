import gettype from '../src/utils/gettype';

describe('gettype', () => {
    it('should detect type correctly', () => {
        expect(gettype('hello')).toBe('string');
        expect(gettype(new String('hello'))).toBe('string');
        expect(gettype({})).toBe('object');
        expect(gettype(new Object())).toBe('object');
        expect(gettype([])).toBe('array');
        expect(gettype(new Array())).toBe('array');
        expect(gettype(2)).toBe('number');
        expect(gettype(new Number(4))).toBe('number');
    });
});
