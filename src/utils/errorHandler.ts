import { notification } from "antd";

const errorHandler = async (message: string) => {
    notification.error({
        message: message,
      });
}



export default errorHandler