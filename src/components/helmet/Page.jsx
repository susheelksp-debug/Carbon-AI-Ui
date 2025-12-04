import { Helmet } from "react-helmet-async";

export default function Page({ title, children }) {
    return (
        <>
            <Helmet>
                <title>{title} | CARBON-AI (C-AI-X)</title>
            </Helmet>

            {children}
        </>
    );
}
