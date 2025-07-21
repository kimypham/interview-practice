import { getTabData, isTabActive } from './Tabs.service';

describe('Tabs.service', () => {
    describe('getTabData', () => {
        it('should return array of tab objects when called', () => {
            const result = getTabData();

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });

        it('should return tab objects with required properties when called', () => {
            const result = getTabData();

            result.forEach((tab) => {
                expect(tab).toHaveProperty('id');
                expect(tab).toHaveProperty('label');
                expect(tab).toHaveProperty('content');
                expect(typeof tab.id).toBe('string');
                expect(typeof tab.label).toBe('string');
                expect(typeof tab.content).toBe('string');
            });
        });

        it('should return consistent data structure when called multiple times', () => {
            const firstCall = getTabData();
            const secondCall = getTabData();

            expect(firstCall).toEqual(secondCall);
        });
    });

    describe('isTabActive', () => {
        it('should return true when tab id matches active tab id', () => {
            const result = isTabActive('html', 'html');

            expect(result).toBe(true);
        });

        it('should return false when tab id does not match active tab id', () => {
            const result = isTabActive('html', 'css');

            expect(result).toBe(false);
        });

        it('should return false when active tab id is null', () => {
            const result = isTabActive('html', null);

            expect(result).toBe(false);
        });

        it('should return false when active tab id is undefined', () => {
            const result = isTabActive('html', undefined);

            expect(result).toBe(false);
        });
    });
});
