import 'dotenv/config';
import { jest } from '@jest/globals';

jest.spyOn(console, 'info').mockImplementation(() => {
  // silence console infos
});

export {};
