import { Helmet } from "react-helmet-async";
import ServicesSection from "./ServicesSection";

const ServiceSectionPage = () => (
    <>
        <Helmet>
            <title>Remote Computer and Laptop Repair Services - RemoteFix Pro</title>
            <meta
                name="description"
                content="RemoteFix Pro provides expert PC & laptop services including virus removal, data recovery, system optimization, cleanup, network & security setup."
            />
            <link rel="canonical" href="https://remotefix.shwetatech.com/service" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="website" />
            <meta
                property="og:title"
                content="Remote Computer and Laptop Repair Services - RemoteFix Pro"
            />
            <meta
                property="og:description"
                content="RemoteFix Pro provides expert PC & laptop services including virus removal, data recovery, system optimization, cleanup, network & security setup."
            />
            <meta property="og:url" content="https://remotefix.shwetatech.com/service" />
            <meta property="og:site_name" content="Remotefix Shwetatech" />
        </Helmet>
        <ServicesSection />
    </>
);

export default ServiceSectionPage;