import { FaExclamationCircle } from "react-icons/fa";
export const ErrMsg = ({ children }) => {
  return (
    <div className="w-full bg-red-200 flex items-stretch">
      <div className="w-10 box-border flex items-center justify-center bg-tertiary">
        <FaExclamationCircle className="text-white" />
      </div>
      <p className="px-3 py-1">{children}</p>
    </div>
  );
};
