import { Helmet } from "react-helmet-async";
import ContactSection from "@/components/ContactSection";

const ContactPage = () => (
    <>
        <Helmet>
            <title>Contact RemoteFix Pro | Let’s Repair Your System</title>
            <meta
                name="description"
                content="Connect with RemoteFix Pro at +91-6356137551 or contact@shwetatech.com for computer and laptop repair services. Let’s repair your system today. "
            />
            <link rel="canonical" href="https://remotefix.shwetatech.com/contact" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="website" />
            <meta
                property="og:title"
                content="Contact RemoteFix Pro | Let’s Repair Your System"
            />
            <meta
                property="og:description"
                content="Connect with RemoteFix Pro at +91-6356137551 or contact@shwetatech.com for computer and laptop repair services. Let’s repair your system today. "
            />
            <meta property="og:url" content="https://remotefix.shwetatech.com/contact" />
            <meta property="og:site_name" content="Remotefix Shwetatech" />
        </Helmet>
        <ContactSection />
    </>
);

export default ContactPage;