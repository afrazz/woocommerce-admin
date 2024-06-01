import { Spin } from "antd";

const Loader = () => {
  return (
    <div className="h-screen bg-white flex items-center justify-center">
      <Spin />
    </div>
  );
};

export default Loader;
