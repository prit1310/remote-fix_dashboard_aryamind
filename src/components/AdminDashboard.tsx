import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Ticket = {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  service: string;
  user: { name: string; email: string };
};

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
};

const AdminDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // For create user form
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });
  const [creatingUser, setCreatingUser] = useState(false);

  // For ticket status editing
  const [statusEdits, setStatusEdits] = useState<{ [id: number]: string }>({});
  const [updatingStatus, setUpdatingStatus] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4000/api/admin/tickets", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTickets(data.tickets || []));
    fetch("http://localhost:4000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data.users || []));
    setLoading(false);
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:4000/api/admin/tickets/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    setTickets(tickets =>
      tickets.map(t =>
        t.id === id ? { ...t, status } : t
      )
    );
  };

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:4000/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(userForm)
    });
    const data = await res.json();
    if (data.user) {
      setUsers([data.user, ...users]);
      setShowUserForm(false);
      setUserForm({ name: "", email: "", phone: "", password: "", role: "user" });
    } else {
      alert(data.error || "Failed to create user");
    }
    setCreatingUser(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="flex justify-center">
          <TabsTrigger value="tickets">All Tickets</TabsTrigger>
          <TabsTrigger value="users">All Users</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">All Tickets</h2>
          <div className="grid gap-4 mb-8">
            {tickets.map(ticket => (
              <Card key={ticket.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{ticket.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {ticket.service} • Created {new Date(ticket.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs">By: {ticket.user.name} ({ticket.user.email})</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={
                        ticket.status === "pending"
                          ? "secondary"
                          : ticket.status === "in-progress"
                          ? "default"
                          : "outline"
                      }>
                        {ticket.status.replace("-", " ")}
                      </Badge>
                      <div className="flex gap-2 items-center mt-1">
                        <select
                          value={statusEdits[ticket.id] ?? ticket.status}
                          onChange={e =>
                            setStatusEdits(edits => ({
                              ...edits,
                              [ticket.id]: e.target.value
                            }))
                          }
                          className="input w-[140px] rounded border px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <Button
                          size="sm"
                          disabled={
                            (statusEdits[ticket.id] ?? ticket.status) === ticket.status ||
                            updatingStatus[ticket.id]
                          }
                          onClick={async () => {
                            setUpdatingStatus(s => ({ ...s, [ticket.id]: true }));
                            await handleStatusChange(ticket.id, statusEdits[ticket.id] ?? ticket.status);
                            setUpdatingStatus(s => ({ ...s, [ticket.id]: false }));
                            setStatusEdits(edits => ({ ...edits, [ticket.id]: undefined }));
                          }}
                        >
                          {updatingStatus[ticket.id] ? "Updating..." : "Update"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{ticket.description}</p>
                </CardContent>
              </Card>
            ))}
            {tickets.length === 0 && <div className="text-center text-muted-foreground">No tickets found.</div>}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">All Users</h2>
            <Button onClick={() => setShowUserForm(true)} variant="hero">
              + New User
            </Button>
          </div>
          {showUserForm && (
            <Card className="max-w-lg mx-auto mb-4">
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                      name="name"
                      placeholder="Name"
                      value={userForm.name}
                      onChange={handleUserFormChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      name="email"
                      placeholder="Email"
                      value={userForm.email}
                      onChange={handleUserFormChange}
                      required
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input
                      name="phone"
                      placeholder="Phone"
                      value={userForm.phone}
                      onChange={handleUserFormChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <Input
                      name="password"
                      placeholder="Password"
                      value={userForm.password}
                      onChange={handleUserFormChange}
                      required
                      type="password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      name="role"
                      value={userForm.role}
                      onChange={handleUserFormChange}
                      className="input w-full rounded border px-3 py-2"
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={creatingUser} className="w-full">
                      {creatingUser ? "Creating..." : "Create"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowUserForm(false)} className="w-full">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-4">
            {users.map(user => (
              <Card key={user.id} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {user.name}
                    <Badge variant={
                      user.role === "superadmin"
                        ? "destructive"
                        : user.role === "admin"
                        ? "default"
                        : "secondary"
                    }>
                      {user.role}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm">{user.email} • {user.phone}</p>
                </CardHeader>
                <CardContent>
                  <p>Joined: {new Date(user.createdAt).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
            {users.length === 0 && <div className="text-center text-muted-foreground">No users found.</div>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;