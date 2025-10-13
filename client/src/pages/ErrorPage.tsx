import Header from "@/components/Header";
const ErrorPage = () => {
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center mt-16">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-white">Please try again later.</p>
      </div>
    </div>
  );
};

export default ErrorPage;
