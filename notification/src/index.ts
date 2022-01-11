import colors from 'colors';
import { printLogo } from './lib/text';
import Notification from './Notification';

colors.enable();
printLogo();

new Notification().start();