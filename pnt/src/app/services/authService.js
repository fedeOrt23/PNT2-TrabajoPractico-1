const API_BASE_URL = "https://690160fdff8d792314bd3f83.mockapi.io/api/v1";

const authService = {
  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error("Error al obtener usuarios");
      return await response.json();
    } catch (error) {
      console.error("authService.getUsers:", error);
      throw error;
    }
  },

  async findUserByEmail(email) {
    try {
      const users = await this.getUsers();
      return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.error("authService.findUserByEmail:", error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const users = await this.getUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        return { success: false, error: "Credenciales inválidas" };
      }

      return { success: true, user };
    } catch (error) {
      console.error("authService.login:", error);
      return { success: false, error: "Error de conexión" };
    }
  },

  async register(userData) {
    try {
      const existingUser = await this.findUserByEmail(userData.email);
      if (existingUser) {
        return { success: false, error: "Este email ya está registrado" };
      }

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          lastname: userData.lastname,
          username: `${userData.name.toLowerCase()}.${userData.lastname.toLowerCase()}`,
          email: userData.email,
          password: userData.password,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Error al crear usuario");

      const newUser = await response.json();
      return { success: true, user: newUser };
    } catch (error) {
      console.error("authService.register:", error);
      return { success: false, error: "Error al crear la cuenta" };
    }
  },

  async resetPassword(email, newPassword) {
    try {
      const user = await this.findUserByEmail(email);

      if (!user) {
        return { success: false, error: "No existe una cuenta con este email" };
      }

      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) throw new Error("Error al actualizar contraseña");

      return { success: true };
    } catch (error) {
      console.error("authService.resetPassword:", error);
      return { success: false, error: "Error al actualizar la contraseña" };
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Error al actualizar usuario");

      const updatedUser = await response.json();
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("authService.updateUser:", error);
      return { success: false, error: "Error al actualizar el usuario" };
    }
  },
};

export default authService;
