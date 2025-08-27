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

// Mock data structure - replace with your database data
interface TicketData {
    id: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
    service: string;
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
        fetch("http://localhost:4000/api/tickets", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setTickets(data.tickets || []);
                setLoading(false);
            });
        fetch("http://localhost:4000/api/admin/services")
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
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4000/api/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });
        const data = await res.json();
        if (data.ticket) {
            setTickets([data.ticket, ...tickets]);
            setShowForm(false);
            setForm({ title: "", description: "", service: "" });
        } else {
            alert(data.error || "Failed to create ticket");
        }
        setCreating(false);
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4000/api/profile", {
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