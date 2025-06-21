import { CONFIG } from 'src/config-global';

import { OrderView } from 'src/sections/order/view';

export default function Page(){
    return(
        <>
      <title>{`Order - ${CONFIG.appName}`}</title>
            <OrderView/>
        </>
    )
}