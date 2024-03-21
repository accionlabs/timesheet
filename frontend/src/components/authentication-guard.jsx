import { withAuthenticationRequired } from "@auth0/auth0-react";

import { LoadingSpinner } from "./loading-spinner";

export const AuthenticationGuard = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="100" />
      </div>
    ),
  });

  return <Component />;
};
