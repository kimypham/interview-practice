import { formatUnixTimeToString } from './JobBoard.service';

describe('JobBoard.service', () => {
    describe('formatUnixTimeToString', () => {
        it('should return formatted date string when given a typical unix timestamp', () => {
            const unixTimestamp: number = 1672576496; // 2023-01-01T12:34:56Z
            const formattedDateString: string =
                formatUnixTimeToString(unixTimestamp);

            expect(formattedDateString).toMatch(/1\/1\/2023/);
            expect(formattedDateString).toMatch(/(11:|12:)/); // hour
            expect(formattedDateString).toMatch(/:34/); // minute
            expect(formattedDateString).toMatch(/:56/); // second
        });

        it('should return formatted date string when given the unix epoch (0)', () => {
            const unixTimestamp: number = 0;

            const formattedDateString: string =
                formatUnixTimeToString(unixTimestamp);

            expect(formattedDateString).toMatch(/1\/1\/1970/);
        });

        it('should return formatted date string when given a timestamp with single-digit month and day', () => {
            const unixTimestamp: number = 1643861106; // 2022-02-03T04:05:06Z

            const formattedDateString: string =
                formatUnixTimeToString(unixTimestamp);

            expect(formattedDateString).toMatch(/2\/3\/2022/);
        });

        it('should return a string for any valid unix timestamp', () => {
            const unixTimestamp: number = 1234567890;

            const formattedDateString: string =
                formatUnixTimeToString(unixTimestamp);

            expect(typeof formattedDateString).toBe('string');
        });
    });
});
