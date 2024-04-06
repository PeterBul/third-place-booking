import moment from 'moment';
import { doEventsOverlap } from './getOverlappingBookings';
import { describe, it, expect } from 'vitest';

describe('doEventsOverlap', () => {
  describe('when A starts before B', () => {
    it('returns false when A ends before B starts', () => {
      const startA = moment('2022-01-01');
      const endA = moment('2022-01-02');
      const startB = moment('2022-01-03');
      const endB = moment('2022-01-04');
      expect(doEventsOverlap(startA, endA, startB, endB)).toBe(false);
    });
    it('returns true when A ends on the same day B starts', () => {
      const startA = moment('2022-01-01');
      const endA = moment('2022-01-03');
      const startB = moment('2022-01-03');
      const endB = moment('2022-01-04');
      expect(doEventsOverlap(startA, endA, startB, endB)).toBe(true);
    });
    it('returns true when A ends after B starts', () => {
      const startA = moment('2022-01-01');
      const endA = moment('2022-01-04');
      const startB = moment('2022-01-03');
      const endB = moment('2022-01-05');
      expect(doEventsOverlap(startA, endA, startB, endB)).toBe(true);
    });
    it('returns true when A ends on the same day B ends', () => {
      const startA = moment('2022-01-01');
      const endA = moment('2022-01-04');
      const startB = moment('2022-01-03');
      const endB = moment('2022-01-04');
      expect(doEventsOverlap(startA, endA, startB, endB)).toBe(true);
    });
    it('returns true when A ends after B ends', () => {
      const startA = moment('2022-01-01');
      const endA = moment('2022-01-05');
      const startB = moment('2022-01-03');
      const endB = moment('2022-01-04');
      expect(doEventsOverlap(startA, endA, startB, endB)).toBe(true);
    });
  });
  describe('when A starts on the same day as B', () => {
    it('returns true when A ends before B ends', () => {
      const startA = moment('2022-01-01');
      const endA = moment('2022-01-02');
      const startB = moment('2022-01-01');
      const endB = moment('2022-01-03');
      expect(doEventsOverlap(startA, endA, startB, endB)).toBe(true);
    });
    it('returns true when A ends on the same day as B ends', () => {
      const startA = moment('2022-01-01');
      const endA = moment('2022-01-03');
      const startB = moment('2022-01-01');
      const endB = moment('2022-01-03');
      expect(doEventsOverlap(startA, endA, startB, endB)).toBe(true);
    });
    it('returns true when A ends after B ends', () => {
      const startA = moment('2022-01-01');
      const endA = moment('2022-01-04');
      const startB = moment('2022-01-01');
      const endB = moment('2022-01-03');
      expect(doEventsOverlap(startA, endA, startB, endB)).toBe(true);
    });
  });
  describe('when A starts after B starts', () => {
    it('returns true when A ends before B ends', () => {
      const startA = moment('2022-01-02');
      const endA = moment('2022-01-03');
      const startB = moment('2022-01-01');
      const endB = moment('2022-01-04');
      expect(doEventsOverlap(startA, endA, startB, endB)).toBe(true);
    });
    it('returns true when A ends on the same day as B ends', () => {
      const startA = moment('2022-01-02');
      const endA = moment('2022-01-04');
      const startB = moment('2022-01-01');
      const endB = moment('2022-01-04');
      expect(doEventsOverlap(startA, endA, startB, endB)).toBe(true);
    });
    it('returns true when A ends after B ends', () => {
      const startA = moment('2022-01-02');
      const endA = moment('2022-01-05');
      const startB = moment('2022-01-01');
      const endB = moment('2022-01-04');
      expect(doEventsOverlap(startA, endA, startB, endB)).toBe(true);
    });
  });
  describe('when A starts on the same day or after B ends', () => {
    it('returns true when A starts on the same day as B ends', () => {
      const startA = moment('2022-01-04');
      const endA = moment('2022-01-05');
      const startB = moment('2022-01-01');
      const endB = moment('2022-01-04');
      expect(doEventsOverlap(startA, endA, startB, endB)).toBe(true);
    });
    it('returns false when A starts after B ends', () => {
      const startA = moment('2022-01-05');
      const endA = moment('2022-01-06');
      const startB = moment('2022-01-01');
      const endB = moment('2022-01-04');
      expect(doEventsOverlap(startA, endA, startB, endB)).toBe(false);
    });
  });
});
