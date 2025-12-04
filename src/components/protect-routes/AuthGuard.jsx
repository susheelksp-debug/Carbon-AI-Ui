import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Navigate } from "react-router-dom";


export default function AuthGuard({ children }) {
    const { isLoggedIn } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isLoggedIn) {
        // Redirect to login with return URL
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return <>{children}</>;
}

AuthGuard.propTypes = {
    children: PropTypes.node,
};
