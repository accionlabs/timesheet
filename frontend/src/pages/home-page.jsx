import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import dateService from "@/services/date.service";

import { updateTimesheet, submitRows } from "@/reducers/timesheet.reducer";
import { selectUpdatedRows } from "@/selectors/timesheet.selector";

import { Button } from "@/components/ui/button";
import { Timesheet } from "@/components/timesheet";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Paginator } from "@/components/paginator";
import { PageLayout } from "@/components/page-layout";
import { Calendar } from "@/components/calendar";
import { LogoutButton } from "@/components/buttons/logout-button";

export const HomePage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const updatedRows = useSelector(selectUpdatedRows);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [date, setDate] = useState(new Date());
  const user = useSelector((state) => state.user);
  const [isTimesheetView, setIsTimesheetView] = useState(true);

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      return;
    }

    getAccessTokenSilently()
      .then((accessToken) => {
        return dispatch(updateTimesheet(accessToken, date.toISOString()));
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [dispatch, date, getAccessTokenSilently, user]);

  useEffect(() => {
    if (updatedRows.length === 0) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      return (event.returnValue = "");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [updatedRows]);

  const submitButtonClickHandler = () => {
    setLoading(true);
    getAccessTokenSilently()
      .then((accessToken) => {
        return dispatch(submitRows(accessToken, updatedRows));
      })
      .then(() => {
        setLoading(false);
        toast({
          variant: "success",
          title: "Success",
          description: "Timesheet submitted successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to submit timesheet",
        });
      });
  };

  const onPreviousHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    setDate((previousDate) => dateService.getPreviousMonth(previousDate));
  };

  const onNextHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    setDate((previousDate) => dateService.getNextMonth(previousDate));
  };

  const getView = () => {
    return (
      <div className="h-[75vh] overflow-auto">
        {isTimesheetView ? (
          <Timesheet submitButtonClickHandler={submitButtonClickHandler} />
        ) : (
          <Calendar />
        )}
      </div>
    );
  };

  return (
    <PageLayout>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-end space-x-4">
          <Button
            variant="secondary"
            onClick={() =>
              setIsTimesheetView((previousState) => !previousState)
            }
          >
            {isTimesheetView ? "Calendar View" : "Timesheet View"}
          </Button>
          <LogoutButton />
        </div>
      </header>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner size="100" />
        </div>
      ) : (
        getView()
      )}
      <div className="flex">
        <Button
          onClick={submitButtonClickHandler}
          className="bg-green-500 text-white ml-auto mr-8 mt-4"
        >
          Submit
        </Button>
      </div>
      <Toaster />
      <Paginator
        onPreviousHandler={onPreviousHandler}
        onNextHandler={onNextHandler}
        disableNext={dateService.getNextMonth(date) > new Date()}
      />
    </PageLayout>
  );
};
