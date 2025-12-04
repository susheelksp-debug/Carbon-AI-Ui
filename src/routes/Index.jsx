import { lazy, Suspense } from "react";
import { Outlet, useRoutes } from "react-router-dom";
import LoadingScreen from "../components/loading/LoadingScreen";
import Layout from "../layout/Layout"
import AppGuard from "../components/protect-routes/AppGuard";
import AuthGuard from "../components/protect-routes/AuthGuard";


const ProjectPage = lazy(() => import("../page/projects/Index"));
const ProjectDetailsPage = lazy(() => import("../page/projects/ProjectDetails"))
const LoginPage = lazy(() => import("../page/auth/Index"));
const TokenizatonPage = lazy(() => import("../page/projects/TokenizationStep"));
const UserManagementPage = lazy(() => import("../page/users/Index"));


const Router = () => {
    const routes = useRoutes([
        {
            path: "/",
            element: (
                <AppGuard>
                    <Suspense fallback={<LoadingScreen />}>
                        <LoginPage />
                    </Suspense>
                </AppGuard>
            ),
        },
        {
            path: "/login",
            element: (
                <AppGuard>
                    <Suspense fallback={<LoadingScreen />}>
                        <LoginPage />
                    </Suspense>
                </AppGuard>
            ),
        },
        {
            path: "/app",
            element: <AuthGuard><Layout><Outlet /></Layout></AuthGuard>,
            children: [
                {
                    path: "projects",
                    element: <Suspense fallback={<LoadingScreen />}><ProjectPage /></Suspense>
                },
                {
                    path: "project-details/:projectId",
                    element: <Suspense fallback={<LoadingScreen />}><ProjectDetailsPage /></Suspense>
                },
                {
                    path: "tokenize/:projectId",
                    element: <Suspense fallback={<LoadingScreen />}><TokenizatonPage /></Suspense>
                },
                {
                    path: "users",
                    element: <Suspense fallback={<LoadingScreen />}><UserManagementPage /></Suspense>
                }

            ]
        }])

    return routes;
};

export default Router;


