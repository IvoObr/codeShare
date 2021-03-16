import logger from '@7dev-works/logger-mogger-js';

export const pErr = (err: Error): void => err && logger.error(err);

export const getRandomInt = (): number => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};
