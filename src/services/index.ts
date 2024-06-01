import WooCommerceRestApi, { WooCommerceRestApiVersion } from "@woocommerce/woocommerce-rest-api";

const woocommerceApi = new WooCommerceRestApi({
  url: process.env.REACT_APP_ECOMMERCE_URL as string,
  consumerKey: process.env.REACT_APP_ECOMMERCE_CONSUMER_KEY as string,
  consumerSecret: process.env.REACT_APP_ECOMMERCE_CONSUMER_SECRET as string,
  version: process.env.REACT_APP_ECOMMERCE_VERSION as WooCommerceRestApiVersion
});
 

export default woocommerceApi