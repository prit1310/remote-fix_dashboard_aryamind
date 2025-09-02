import { Helmet } from "react-helmet-async";
import HowItWorksSection from "./HowItWorksSection";

interface HowitsworkProps {
    user: { name: string; email: string; role: string } | null;
    onLoginClick: () => void;
}

const HowItWorksPage = ({ user, onLoginClick }: HowitsworkProps) => (
    <>
        <Helmet>
            <title>How Our Tech Support Works at RemoteFix Pro</title>
            <meta
                name="description"
                content="Discover how RemoteFix Pro works. Get a step-by-step process to get fast, secure & hassle-free tech support available anytime, anywhere. Contact at 6356137551."
            />
            <link rel="canonical" href="https://remotefix.shwetatech.com/how-it-works" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="website" />
            <meta
                property="og:title"
                content="How Our Tech Support Works at RemoteFix Pro"
            />
            <meta
                property="og:description"
                content="Discover how RemoteFix Pro works. Get a step-by-step process to get fast, secure & hassle-free tech support available anytime, anywhere. Contact at 6356137551."
            />
            <meta property="og:url" content="https://remotefix.shwetatech.com/how-it-works" />
            <meta property="og:site_name" content="Remotefix Shwetatech" />
        </Helmet>
        <HowItWorksSection user={user} onLoginClick={onLoginClick} />
    </>
);

export default HowItWorksPage;