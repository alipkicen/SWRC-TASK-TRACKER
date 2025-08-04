import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Welcome to Skynet Sampling Plan Submission System
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Your platform to submit and track job requests.
        </p>
      </div>
      <div className="flex space-x-4">
        <Link to="/login">
          <Button size="lg">Login</Button>
        </Link>
        <Link to="/submit-request">
          <Button size="lg" variant="secondary">Submit New Request</Button>
        </Link>
        {/* Add links for View Request History and Edit/Cancel Pending Requests later */}
      </div>
      <div className="absolute bottom-4">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;