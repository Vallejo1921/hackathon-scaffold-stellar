import * as Client from 'balloonfly';
import { rpcUrl } from './util';

export default new Client.Client({
  networkPassphrase: 'Standalone Network ; February 2017',
  contractId: 'CA4WNWRHFNFBMXDQRFMBNNFRGD3Q7LLFY5SP2VQQ7WLRAYO23DTCWIQY',
  rpcUrl,
  allowHttp: true,
  publicKey: undefined,
});
