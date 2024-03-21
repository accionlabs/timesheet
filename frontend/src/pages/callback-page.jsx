import { LoadingSpinner } from "@/components/loading-spinner";
import { PageLayout } from "@/components/page-layout";

export const CallbackPage = () => {
  return (
    <PageLayout>
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="100" />
      </div>
    </PageLayout>
  );
};
