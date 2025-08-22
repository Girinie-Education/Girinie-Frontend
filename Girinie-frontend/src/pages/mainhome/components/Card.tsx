import React from "react";

type Props = React.PropsWithChildren<{ className?: string; title?: string }>;

const Card: React.FC<Props> = ({ children, className = "", title }) => (
  <section className={`rounded-xl border border-gray-200 bg-white overflow-hidden ${className}`}>
    {title && (
      <header className="px-4 py-2 bg-secondary/100 font-body2-sb text-thirdary">
        {title}
      </header>
    )}
    {children}
  </section>
);

export default Card;
