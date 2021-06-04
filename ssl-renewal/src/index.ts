import colors from 'colors';
import SSLRenewal from './SSLRenewal';
import { printLogo } from './lib/text';

printLogo();
colors.enable();

new SSLRenewal().start();
