import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "'Geist', sans-serif",
            fontSize: "13px",
            borderRadius: "12px",
          },
        }}
      />
    </>
  );
}