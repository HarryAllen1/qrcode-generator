type EAPMethod = 'PEAP' | 'TLS' | 'TTLS' | 'PWD' | 'SIM' | 'AKA' | "AKA'";

const sanitize = (str: string) => str.replace(/([\\;,":])/g, '\\$1');

export const wifiToQRText = ({
	ssid,
	auth,
	password,
	hidden,
	eapMethod,
	eapIdentity,
	eapPhase2,
}: {
	ssid: string;
	auth?: 'WEP' | 'WPA' | 'WPA2-EAP';
	password?: string;
	hidden: boolean;
	eapMethod?: EAPMethod;
	eapIdentity?: string;
	eapPhase2?: 'MSCHAPV2' | 'GTC' | 'SIM' | 'AKA' | "AKA'";
}) => {
	if (auth === 'WPA2-EAP') {
		if (!eapMethod || !eapIdentity || !eapPhase2) {
			throw new Error('Missing EAP settings');
		}

		return `WIFI:T:${eapMethod};S:${ssid};E:${eapIdentity};PH2:${eapPhase2};${
			password ? `P:${password};` : ''
		}${hidden ? 'H:true;' : ''};;`;
	}

	if (auth && !password) {
		throw new Error('Missing password');
	}

	return `WIFI:T:${auth};S:"${sanitize(ssid)}";P:"${password ? sanitize(password) : ''}";${
		hidden ? 'H:true;' : ''
	};;`;
};
