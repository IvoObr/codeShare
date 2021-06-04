import colors from 'colors';
import AuthProxy from './AuthProxy';
import { printLogo } from './lib/text';

printLogo();
colors.enable();

new AuthProxy().start();