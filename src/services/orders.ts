import woocommerceApi from "services"
import errorHandler from "utils/errorHandler";

const orderServices = {} as any


orderServices.getOrder = async(queryData:object) => {
    try {
        const ordersList = await woocommerceApi.get("orders", queryData);
        return ordersList.data;
    } catch(err: any) {
        errorHandler(err.message)
    }
  
}

orderServices.getOrderById = async(id: number) => {
    try {
        const ordersList = await woocommerceApi.get(`orders/${id}`);
        return ordersList.data;
    } catch(err:any) {
        errorHandler(err.message)
    }
  
}

orderServices.updateOrderById = async(id: number, data: object) => {
    try {
        const ordersList = await woocommerceApi.put(`orders/${id}`, data);
        return ordersList.data;
    } catch(err: any) {
        errorHandler(err.message)
    }
  
}


export default orderServices