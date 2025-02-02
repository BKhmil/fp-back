import * as React from "react";

interface IProps {
  context: {
    name: string;
    frontUrl: string;
  };
}

export const OldVisitEmail: React.FC<Readonly<IProps>> = ({ context }) => {
  return (
    <div>
      <h1>Hey, {context.name}!</h1>

      <p>
        We haven't seen each other for a long time. Have you forgotten about our
        platform, which is designed to change your life?
      </p>

      <a href={context.frontUrl}>VISIT NOW</a>
    </div>
  );
};
