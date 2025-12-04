import PropTypes from "prop-types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function AppGuard({ children }) {

    const { isLoggedIn } = useSelector((state) => state.auth);

    const navigate = useNavigate();


    useEffect(() => {
        if (isLoggedIn) {
            navigate("/app/projects", { replace: true });
        } else {
            navigate("/", { replace: true });
        }
    }, [isLoggedIn, navigate]);



    return <>{children}</>;
}


AppGuard.propTypes = {
    children: PropTypes.node,
};