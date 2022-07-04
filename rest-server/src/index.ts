import colors from 'colors';
import { printLogo } from '@utils';
import RestServer from './RestServer';

colors.enable();
printLogo();

new RestServer().start();