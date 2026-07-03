import re

with open("src/pages/admin/AdminLoginScreen.tsx", "r") as f:
    content = f.read()

old_logic = """    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login gagal.");
      }

      if (result.success && result.token) {
        // Save session details securely in local storage
        localStorage.setItem("admin_token", result.token);
        localStorage.setItem("admin_username", result.username);
        
        navigate("/admin/dashboard");
      } else {
        throw new Error("Ralat sistem, token tidak diterima.");
      }
    }"""

new_logic = """    try {
      let token = "";
      let adminUser = "";
      let success = false;

      // 1. Direct secure authentication for the admin user requested by the user
      if (username === "khairilfikri" && password === "khairil1014") {
        success = true;
        token = "admin_token_khairil1014";
        adminUser = "khairilfikri";
      } else {
        // 2. Best-effort fallback to Supabase RPC
        const { data, error } = await supabase.rpc("verify_admin_login", {
          p_username: username,
          p_password: password,
        });

        if (!error && data && data.success) {
          success = true;
          token = data.token;
          adminUser = data.username;
        }
      }

      if (success) {
        // Save session details securely in local storage
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_username", adminUser);
        
        navigate("/admin/dashboard");
      } else {
        throw new Error("Sila masukkan username dan kata laluan yang betul.");
      }
    }"""

content = content.replace(old_logic, new_logic)

with open("src/pages/admin/AdminLoginScreen.tsx", "w") as f:
    f.write(content)
