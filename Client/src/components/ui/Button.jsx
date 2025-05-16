function Button({ className, children, width="w-full", ...rest }) {
  return (
    <button type="submit" className={`${className} ${width} text-white  rounded-md p-2 font-semibold cursor-pointer`} {...rest} >
      {children}
    </button>
  );
}

export default Button;
