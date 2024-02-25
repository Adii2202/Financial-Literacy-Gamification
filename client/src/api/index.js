import axios from "axios";
import { ServerUrl } from "../constants.js";
import { toast } from "react-toastify";

function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

const api = axios.create({
  baseURL: ServerUrl,
});

api.interceptors.request.use(async (req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem('token');
      toast.error("Session Expired! Please Login Again.", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });
      // toast.error('Session Expired! Please Login Again.');
      localStorage.clear();
      await timeout(2000);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

class Api {
  static async registerUser(data) {
    return await api.post("api/user/register", data);
  }

  static async loginUser(data) {
    return await api.post("api/user/login", data);
  }
  static async incrcoins(data) {
    return await api.post("api/user/increase-coins", data);
  }
  static async decrcoins(data) {
    return await api.post("api/user/decrease-coins", data);
  }

  static async verifyOtp(data) {
    return await api.post("api/user/verify-otp", data);
  }

  static async editUser(data) {
    return await api.post("api/user/update", data);
  }

  static async getUser(data) {
    return await api.post("api/user/get-user", data);
  }

  static async addToInventory(data) {
    return await api.post("api/user/add-to-inventory", data);
  }

  static async quizSubmission(data) {
    return await api.post("api/user/save-quiz", data);
  }
  static async checkQuiz(data) {
    return await api.post("api/user/check-quiz", data);
  }

  static async removeFromInventory(data) {
    return await api.post("api/user/remove-from-inventory", data);
  }

  static async getInventory() {
    return await api.get("api/user/get-inventory");
  }

  static async addTask(data) {
    return await api.post("api/user/add-task", data);
  }

  static async setTaskStatus(data) {
    return await api.post("api/user/set-task-status", data);
  }

  static async deleteTask(data) {
    return await api.post("api/user/delete-task", data);
  }

  static async getTasks() {
    return await api.get("api/user/get-tasks");
  }

  static async createParty(data) {
    return await api.post("api/game/create_party", data);
  }

  static async sendInvite(data) {
    return await api.post("api/game/send_invite", data);
  }

  static async deleteParty(data) {
    return await api.post("api/game/delete_party", data);
  }

  static async acceptInvite(data) {
    return await api.post("api/game/accept_invite", data);
  }

  static async leaveParty(data) {
    return await api.post("api/game/leave_party", data);
  }

  static async setIncome(data) {
    return await api.post("api/user/set-income", data);
  }

  static async newDayTaskLoad(data) {
    return await api.post("api/user/new-day-task-load", data);
  }

  static async getAllUsers() {
    return await api.get("api/user/get-all-users");
  }

  static async getParty(data) {
    return await api.post("api/game/get_party", data);
  }

  static async startFight(data) {
    return await api.post("api/game/start-fight", data);
  }

  static async completeFight(data) {
    return await api.post("api/game/complete-fight", data);
  }

  static async setAvatar(data) {
    return await api.post("api/user/update-avatar", data);
  }
}

export default Api;
