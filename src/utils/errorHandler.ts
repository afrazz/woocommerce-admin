import { notification } from "antd";

const errorHandler = async (message: string) => {
    notification.error({
        message: message,
        // description:
        //   'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      });
}



export default errorHandler