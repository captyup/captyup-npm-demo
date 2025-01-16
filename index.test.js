const { greet } = require('./index');

describe('greet function', () => {
    test('should return correct greeting message', () => {
        expect(greet('小明')).toBe('Hello, 小明!');
    });

    test('should handle empty string', () => {
        expect(greet('')).toBe('Hello, !');
    });

    test('should handle special characters', () => {
        expect(greet('!@#$')).toBe('Hello, !@#$!');
    });
});
