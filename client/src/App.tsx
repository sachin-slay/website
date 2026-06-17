import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";

const App = () => (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster richColors closeButton />
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

export default App;
