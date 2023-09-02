import QRCode from 'qrcode';
import { svg } from './svg.js';

QRCode.create(svg.repeat(100));
