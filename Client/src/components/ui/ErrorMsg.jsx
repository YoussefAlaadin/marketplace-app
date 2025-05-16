const ErrorMsg = ({ msg }) => {
    
    return msg ? <span className="block text-red-500 text-sm mt-2 font-semibold">{msg}</span> : null;
}

export default ErrorMsg;