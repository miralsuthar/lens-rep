type ButtonProps = {
  onClick: () => void;
  title: string;
  classname?: string;
};
export const Button = ({ onClick, title, classname }: ButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={`w-max px-4 py-2 cursor-pointer font-medium text-xl bg-[#DDE7EA] rounded-full ${classname}`}
    >
      {title}
    </div>
  );
};
