import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Button from '../../src/components/Button'; // Import the custom Button component

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/v1/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/v1/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/users/edit/${id}`); // Redirect to the user edit page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>isAdmin</th>
            <th>isSeller</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? "Yes" : "No"}</td>
              <td>{user.isSeller ? "Yes" : "No"}</td>
              <td>
                <Button onClick={() => handleEdit(user._id)}>Edit</Button>
                <Button onClick={() => handleDelete(user._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;