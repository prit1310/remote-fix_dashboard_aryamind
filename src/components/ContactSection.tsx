import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Clock, MessageSquare, Monitor } from "lucide-react";

const ContactSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    computerType: "Desktop Computer",
    description: "",
    urgency: "Low",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUrgency = (urgency: string) => setForm(f => ({ ...f, urgency }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/contact/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        computerType: "Desktop Computer",
        description: "",
        urgency: "Low",
      });
    } else {
      alert(data.error || "Failed to submit request");
    }
  };
  return (
    <section id="contact" className="py-24 bg-surface">
      <div className="container max-w-screen-2xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Get Help
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              Right Now
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to fix your computer? Contact our expert technicians and get your
            system running smoothly in no time.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="space-y-6">
            <Card variant="tech" className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-hero p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Call Us Now</h3>
                  <p className="text-muted-foreground mb-3">
                    Speak directly with a technician
                  </p>
                  <p className="text-lg font-bold text-primary">(555) 123-4567</p>
                </div>
              </div>
            </Card>

            <Card variant="tech" className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-hero p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                  <p className="text-muted-foreground mb-3">
                    Send us your computer details
                  </p>
                  <p className="text-lg font-bold text-primary">help@remotefixpro.com</p>
                </div>
              </div>
            </Card>

            <Card variant="tech" className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-hero p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">24/7 Available</h3>
                  <p className="text-muted-foreground mb-3">
                    Round-the-clock technical support
                  </p>
                  <p className="text-lg font-bold text-primary">Always Online</p>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-6 border-primary/20">
              <div className="text-center">
                <Monitor className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Emergency Support</h3>
                <p className="text-muted-foreground mb-4">
                  Critical system issues? Get immediate help
                </p>
                <Button variant="hero" className="w-full">
                  Emergency Access
                </Button>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card variant="feature" className="p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Describe Your Problem
                </CardTitle>
                <CardDescription className="text-base">
                  Tell us about your computer issue and we'll get back to you with a solution
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {success ? (
                  <div className="text-green-600 text-center font-semibold py-8">
                    Thank you! Your request has been submitted.
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Name</label>
                        <Input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Phone Number</label>
                        <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Your contact number" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email Address</label>
                      <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your.email@example.com" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Computer Type</label>
                      <select name="computerType" value={form.computerType} onChange={handleChange} className="w-full p-3 border border-input rounded-md bg-background">
                        <option>Desktop Computer</option>
                        <option>Laptop</option>
                        <option>Mac</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Problem Description</label>
                      <Textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Please describe your computer problem in detail..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Urgency Level</label>
                      <div className="grid grid-cols-3 gap-3">
                        <Button type="button" variant={form.urgency === "Low" ? "hero" : "outline"} onClick={() => handleUrgency("Low")}>Low</Button>
                        <Button type="button" variant={form.urgency === "Medium" ? "hero" : "outline"} onClick={() => handleUrgency("Medium")}>Medium</Button>
                        <Button type="button" variant={form.urgency === "Urgent" ? "hero" : "outline"} onClick={() => handleUrgency("Urgent")}>Urgent</Button>
                      </div>
                    </div>
                    <Button variant="hero" size="lg" className="w-full" type="submit" disabled={submitting}>
                      <Monitor className="h-5 w-5 mr-2" />
                      {submitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;