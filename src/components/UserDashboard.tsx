import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Ticket, Plus, Clock, CheckCircle, AlertCircle, User } from "lucide-react";

interface UserDashboardProps {
    user: { name: string; email: string; phone?: string };
}

interface TicketData {
    id: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
    service: string;
    engineer?: { id: number; name: string; email: string; phone: string } | null;
}

const UserDashboard = ({ user }: UserDashboardProps) => {

    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", service: "" });
    const [creating, setCreating] = useState(false);
    const [services, setServices] = useState<{ id: number; name: string }[]>([]);
    const [editing, setEditing] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("/api/tickets", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setTickets(data.tickets || []);
                setLoading(false);
            });
        fetch("/api/admin/services")
            .then(res => res.json())
            .then(data => setServices(data.services || []));
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'secondary';
            case 'in-progress': return 'default';
            case 'completed': return 'outline';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="h-4 w-4" />;
            case 'in-progress': return <AlertCircle className="h-4 w-4" />;
            case 'completed': return <CheckCircle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    const handleCreateTicket = async () => {
        setShowForm(true);
    };

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleProfileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        // 1. Create Razorpay order (pass userId in notes for backend)
        const token = localStorage.getItem("token");
        const orderRes = await fetch("/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: 500, // or your dynamic amount
                currency: "INR",
                receipt: `ticket_${Date.now()}`,
                notes: { userId: user.email }, // use email or id, must be unique per user
            }),
        });
        const order = await orderRes.json();
        if (!order?.id) {
            alert("Failed to create payment order");
            setCreating(false);
            return;
        }

        // 2. Open Razorpay checkout
        const options = {
            key: "rzp_test_RB4YBY1PoFLtEK", // your Razorpay key
            order_id: order.id,
            name: "RemoteFix Pro",
            description: "Ticket Booking",
            handler: async function (response: any) {
                // 3. Verify payment signature (for instant methods)
                const verifyRes = await fetch("/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(response),
                });
                const verifyData = await verifyRes.json();
                if (verifyData.status === "success") {
                    // 4. Create the ticket after payment is verified
                    const ticketRes = await fetch("/api/tickets", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(form),
                    });
                    const data = await ticketRes.json();
                    if (data.ticket) {
                        setTickets([data.ticket, ...tickets]);
                        setShowForm(false);
                        setForm({ title: "", description: "", service: "" });
                        alert("Ticket booked and payment successful!");
                    } else {
                        alert(data.error || "Failed to create ticket after payment");
                    }
                } else {
                    alert("Payment verification failed");
                }
                setCreating(false);
            },
            prefill: {
                name: user.name,
                email: user.email,
                contact: user.phone || "",
            },
            theme: { color: "#3399cc" },
            modal: {
                ondismiss: () => {
                    setCreating(false);
                    alert("Payment cancelled");
                },
            },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();

        // 5. Poll payment status for Pay Later/UPI/EMI
        const pollStatus = (orderId: string) => {
            const start = Date.now();
            const interval = setInterval(async () => {
                try {
                    const r = await fetch(`/payment-status/${orderId}`);
                    if (r.ok) {
                        const data = await r.json();
                        if (data.status === "captured") {
                            clearInterval(interval);
                            setCreating(false);
                            // Create the ticket after payment is captured (if not already created)
                            const ticketRes = await fetch("/api/tickets", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify(form),
                            });
                            const ticketData = await ticketRes.json();
                            if (ticketData.ticket) {
                                setTickets([ticketData.ticket, ...tickets]);
                                setShowForm(false);
                                setForm({ title: "", description: "", service: "" });
                                alert("Ticket booked and payment successful!");
                            } else {
                                alert(ticketData.error || "Failed to create ticket after payment");
                            }
                        }
                        if (data.status === "failed") {
                            clearInterval(interval);
                            setCreating(false);
                            alert("Payment failed.");
                        }
                    }
                } catch (e) { }
                if (Date.now() - start > 120000) {
                    clearInterval(interval);
                    setCreating(false);
                    alert("Timed out while waiting for payment status.");
                }
            }, 3000);
        };
        pollStatus(order.id);
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem("token");
        const res = await fetch("/api/api/profile", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profileForm),
        });
        const data = await res.json();
        if (data.user) {
            setEditing(false);
        } else {
            alert(data.error || "Failed to update profile");
        }
        setSaving(false);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
                    <p className="text-muted-foreground">Manage your support tickets</p>
                </div>
            </div>

            <Tabs defaultValue="tickets" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="tickets">My Tickets</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="tickets" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Support Tickets</h2>
                        <Button onClick={handleCreateTicket} variant="hero">
                            <Plus className="h-4 w-4 mr-2" />
                            New Ticket
                        </Button>
                    </div>

                    {showForm && (
                        <Card className="max-w-lg mx-auto mb-4">
                            <CardHeader>
                                <CardTitle>Book a New Ticket</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Service</label>
                                        <select
                                            name="service"
                                            value={form.service}
                                            onChange={handleFormChange}
                                            required
                                            className="input w-full rounded border px-3 py-2"
                                        >
                                            <option value="">Select Service</option>
                                            {services.map((s) => (
                                                <option key={s.id} value={s.name}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            placeholder="Description"
                                            value={form.description}
                                            onChange={handleFormChange}
                                            required
                                            className="input w-full rounded border px-3 py-2 min-h-[80px]"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="submit" disabled={creating} className="w-full">
                                            {creating ? "Booking..." : "Book Ticket"}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="w-full">
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {loading ? (
                        <p>Loading tickets...</p>
                    ) : (
                        <div className="grid gap-4">
                            {tickets.map((ticket) => (
                                <Card key={ticket.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{ticket.service}</CardTitle>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {ticket.service} • Created {ticket.createdAt}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(ticket.status)}
                                                <Badge variant={getStatusColor(ticket.status)}>
                                                    {ticket.status.replace('-', ' ')}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-foreground/80">{ticket.description}</p>
                                        {ticket.engineer && (
                                            <div className="mt-2 text-sm text-muted-foreground border-t pt-2">
                                                <div>
                                                    <span className="font-medium">Assigned Engineer:</span> {ticket.engineer.name}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Email:</span>{" "}
                                                    <a href={`mailto:${ticket.engineer.email}`} className="underline">{ticket.engineer.email}</a>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Phone:</span>{" "}
                                                    <a href={`tel:${ticket.engineer.phone}`} className="underline">{ticket.engineer.phone}</a>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {editing ? (
                                <form onSubmit={handleProfileSave} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium">Name</label>
                                        <Input
                                            name="name"
                                            value={profileForm.name}
                                            onChange={handleProfileChange}
                                            className="input w-full"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium">Email</label>
                                        <Input
                                            name="email"
                                            value={profileForm.email}
                                            onChange={handleProfileChange}
                                            className="input w-full"
                                            required
                                            type="email"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium">Phone</label>
                                        <Input
                                            name="phone"
                                            value={profileForm.phone}
                                            onChange={handleProfileChange}
                                            className="input w-full"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="submit" disabled={saving}>
                                            {saving ? "Saving..." : "Save"}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium">Name</label>
                                        <p className="text-foreground/80">{profileForm.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium">Email</label>
                                        <p className="text-foreground/80">{profileForm.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium">Phone</label>
                                        <p className="text-foreground/80">{profileForm.phone}</p>
                                    </div>
                                    <Button variant="outline" onClick={() => setEditing(true)}>
                                        Edit Profile
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default UserDashboard;