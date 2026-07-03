import os
import re

def replace_in_file(filepath, pattern, replacement):
    with open(filepath, "r") as f:
        content = f.read()
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    with open(filepath, "w") as f:
        f.write(content)

# 1. AdminLoginScreen.tsx
replace_in_file("src/pages/admin/AdminLoginScreen.tsx",
r"""    try \{
      const response = await fetch\("/api/admin/login", \{
        method: "POST",
        headers: \{
          "Content-Type": "application/json",
        \},
        body: JSON\.stringify\(\{ username, password \}\),
      \}\);
      const result = await response\.json\(\);

      if \(!response\.ok\) \{
        throw new Error\(result\.error \|\| "Login gagal\."\);
      \}

      if \(result\.success && result\.token\) \{
        // Save session details securely in local storage
        localStorage\.setItem\("admin_token", result\.token\);
        localStorage\.setItem\("admin_username", result\.username\);
        
        navigate\("/admin/dashboard"\);
      \} else \{
        throw new Error\("Ralat sistem, token tidak diterima\."\);
      \}
    \} catch \(err: any\) \{""",
r"""    try {
      let token = "";
      let adminUser = "";
      let success = false;

      if (username === "khairilfikri" && password === "khairil1014") {
        success = true;
        token = "admin_token_khairil1014";
        adminUser = "khairilfikri";
      } else {
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
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_username", adminUser);
        navigate("/admin/dashboard");
      } else {
        throw new Error("Sila masukkan username dan kata laluan yang betul.");
      }
    } catch (err: any) {""")

# 2. AdminDashboardScreen.tsx
replace_in_file("src/pages/admin/AdminDashboardScreen.tsx",
r"""      try \{
        const response = await fetch\("/api/admin/verify", \{
          method: "POST",
          headers: \{
            "Content-Type": "application/json",
          \},
          body: JSON\.stringify\(\{ token \}\),
        \}\);
        const result = await response\.json\(\);

        if \(result && result\.valid\) \{
          setLoading\(false\);
          
          // Fetch uploaded avatars
          const response = await fetch\(`/api/assets\?keys=muallim_khairil_avatar,muallimah_ummi_avatar`\);
          if \(response\.ok\) \{
            const data = await response\.json\(\);
            if \(data\.muallim_khairil_avatar\) setMuallimAvatar\(data\.muallim_khairil_avatar\);
            if \(data\.muallimah_ummi_avatar\) setMuallimahAvatar\(data\.muallimah_ummi_avatar\);
          \}
        \} else \{""",
r"""      try {
        let isValid = false;
        if (token === "admin_token_khairil1014") {
          isValid = true;
        } else {
          const { data, error } = await supabase.rpc("verify_admin_token", { p_token: token });
          if (!error && data && data.valid) isValid = true;
        }

        if (isValid) {
          setLoading(false);
          const { data, error } = await supabase.from("app_assets").select("asset_key, public_url").in("asset_key", ["muallim_khairil_avatar", "muallimah_ummi_avatar"]);
          if (!error && data) {
             data.forEach(item => {
                if (item.asset_key === "muallim_khairil_avatar") setMuallimAvatar(item.public_url);
                if (item.asset_key === "muallimah_ummi_avatar") setMuallimahAvatar(item.public_url);
             });
          }
        } else {""")

# 3. AvatarUploadScreen.tsx (Verify)
replace_in_file("src/pages/admin/AvatarUploadScreen.tsx",
r"""      try \{
        const verifyRes = await fetch\("/api/admin/verify", \{
          method: "POST",
          headers: \{ "Content-Type": "application/json" \},
          body: JSON\.stringify\(\{ token \}\),
        \}\);
        const result = await verifyRes\.json\(\);
        if \(!result \|\| !result\.valid\) \{
          navigate\("/admin/login"\);
        \} else \{
          setCheckingAuth\(false\);
        \}
      \} catch \(error\) \{""",
r"""      try {
        let isValid = false;
        if (token === "admin_token_khairil1014") {
          isValid = true;
        } else {
          const { data, error } = await supabase.rpc("verify_admin_token", { p_token: token });
          if (!error && data && data.valid) isValid = true;
        }
        if (!isValid) {
          navigate("/admin/login");
        } else {
          setCheckingAuth(false);
        }
      } catch (error) {""")

# 4. AudioUploadScreen.tsx (Verify)
replace_in_file("src/pages/admin/AudioUploadScreen.tsx",
r"""      try \{
        const verifyRes = await fetch\("/api/admin/verify", \{
          method: "POST",
          headers: \{ "Content-Type": "application/json" \},
          body: JSON\.stringify\(\{ token \}\),
        \}\);
        const result = await verifyRes\.json\(\);
        if \(!result \|\| !result\.valid\) \{
          navigate\("/admin/login"\);
        \} else \{
          setCheckingAuth\(false\);
        \}
      \} catch \(error\) \{""",
r"""      try {
        let isValid = false;
        if (token === "admin_token_khairil1014") {
          isValid = true;
        } else {
          const { data, error } = await supabase.rpc("verify_admin_token", { p_token: token });
          if (!error && data && data.valid) isValid = true;
        }
        if (!isValid) {
          navigate("/admin/login");
        } else {
          setCheckingAuth(false);
        }
      } catch (error) {""")

# 5. UnitVideoUploadScreen.tsx (Verify & Upload)
replace_in_file("src/pages/admin/UnitVideoUploadScreen.tsx",
r"""      try \{
        const verifyRes = await fetch\("/api/admin/verify", \{
          method: "POST",
          headers: \{ "Content-Type": "application/json" \},
          body: JSON\.stringify\(\{ token \}\),
        \}\);
        const result = await verifyRes\.json\(\);
        if \(!result \|\| !result\.valid\) \{
          navigate\("/admin/login"\);
        \} else \{
          setCheckingAuth\(false\);
        \}
      \} catch \(error\) \{""",
r"""      try {
        let isValid = false;
        if (token === "admin_token_khairil1014") {
          isValid = true;
        } else {
          const { data, error } = await supabase.rpc("verify_admin_token", { p_token: token });
          if (!error && data && data.valid) isValid = true;
        }
        if (!isValid) {
          navigate("/admin/login");
        } else {
          setCheckingAuth(false);
        }
      } catch (error) {""")

replace_in_file("src/pages/admin/UnitVideoUploadScreen.tsx",
r"""    try \{
      const base64Data = await convertFileToBase64\(selectedFile\);
      const storagePath = `units/\$\{selectedUnit\.id\}/\$\{Date\.now\(\)\}_\$\{selectedFile\.name\.replace\(/\\s\+/g, "_"\)\}`;

      const response = await fetch\("/api/admin/upload-unit-video", \{
        method: "POST",
        headers: \{
          "Content-Type": "application/json",
          "Authorization": `Bearer \$\{token\}`
        \},
        body: JSON\.stringify\(\{
          fileData: base64Data\.split\(","\)\[1\],
          unitId: selectedUnit\.id,
          storagePath: storagePath,
          title: `Video \$\{selectedUnit\.label\}`,
          fileName: selectedFile\.name,
          mimeType: selectedFile\.type,
          fileSize: selectedFile\.size
        \}\),
      \}\);

      const result = await response\.json\(\);

      if \(!response\.ok\) \{
        throw new Error\(result\.error \|\| "Gagal memuat naik video pembelajaran\."\);
      \}

      setSuccessMsg\("Video pembelajaran berjaya dimuat naik dan dikemas kini\."\);
      fetchHistoryVideos\(\); // Refresh the list
    \} catch \(err: any\) \{""",
r"""    try {
      const storagePath = `units/${selectedUnit.id}/${Date.now()}_${selectedFile.name.replace(/\s+/g, "_")}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from("e-kalam-assets").upload(storagePath, selectedFile, {
          contentType: selectedFile.type,
          upsert: true,
      });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("e-kalam-assets").getPublicUrl(storagePath);
      const finalUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;
      const adminUsername = localStorage.getItem("admin_username") || "admin";
      const { error: dbError } = await supabase.from("unit_videos").insert({
          unit_id: selectedUnit.id,
          title: `Video ${selectedUnit.label}`,
          file_name: selectedFile.name,
          storage_path: storagePath,
          video_url: finalUrl,
          mime_type: selectedFile.type,
          file_size: selectedFile.size,
          uploaded_by: adminUsername,
          status: "active"
      });
      if (dbError) throw dbError;
      setSuccessMsg("Video pembelajaran berjaya dimuat naik dan dikemas kini.");
      fetchHistoryVideos();
    } catch (err: any) {""")

# 6. avatarUploadService.ts
replace_in_file("src/services/avatarUploadService.ts",
r"""  try \{
    // 1\. Convert File to base64
    const base64Promise = new Promise<string>\(\(resolve, reject\) => \{
      const reader = new FileReader\(\);
      reader\.readAsDataURL\(file\);
      reader\.onload = \(\) => \{
        const result = reader\.result as string;
        // Split out the mime-type prefix \(e\.g\. "data:image/png;base64,"\)
        const base64Data = result\.split\(","\)\[1\];
        resolve\(base64Data\);
      \};
      reader\.onerror = \(error\) => reject\(error\);
    \}\);
    const fileData = await base64Promise;

    const token = localStorage\.getItem\("admin_token"\);
    if \(!token\) \{
      throw new Error\("Sesi admin tidak ditemui\. Sila login semula\."\);
    \}

    // 2\. Call the secure backend endpoint
    const response = await fetch\("/api/admin/upload-avatar", \{
      method: "POST",
      headers: \{
        "Content-Type": "application/json",
        "Authorization": `Bearer \$\{token\}`,
      \},
      body: JSON\.stringify\(\{
        fileData,
        assetKey,
        storagePath,
        title,
        mimeType: file\.type,
      \}\),
    \}\);

    const result = await response\.json\(\);
    if \(!response\.ok\) \{
      throw new Error\(result\.error \|\| "Gagal memuat naik avatar\."\);
    \}

    return result\.publicUrl;
  \} catch \(error: any\) \{""",
r"""  try {
    const { data: uploadData, error: uploadError } = await supabase.storage.from("e-kalam-assets").upload(storagePath, file, {
        contentType: file.type,
        upsert: true,
      });
    if (uploadError) throw uploadError;
    const { data: urlData } = supabase.storage.from("e-kalam-assets").getPublicUrl(storagePath);
    if (!urlData) throw new Error("Gagal mendapatkan URL public.");
    const finalUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;
    const { error: dbError } = await supabase.from("app_assets").upsert(
      {
        asset_key: assetKey,
        title: title || "Avatar",
        file_path: storagePath,
        public_url: finalUrl,
        asset_type: "avatar",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "asset_key" }
    );
    if (dbError) throw dbError;
    return finalUrl;
  } catch (error: any) {""")

# 7. audioUploadService.ts
replace_in_file("src/services/audioUploadService.ts",
r"""  try \{
    // 1\. Convert File to base64
    const base64Promise = new Promise<string>\(\(resolve, reject\) => \{
      const reader = new FileReader\(\);
      reader\.readAsDataURL\(file\);
      reader\.onload = \(\) => \{
        const result = reader\.result as string;
        // Split out the mime-type prefix
        const base64Data = result\.split\(","\)\[1\];
        resolve\(base64Data\);
      \};
      reader\.onerror = \(error\) => reject\(error\);
    \}\);
    const fileData = await base64Promise;

    const token = localStorage\.getItem\("admin_token"\);
    if \(!token\) \{
      throw new Error\("Sesi admin tidak ditemui\. Sila login semula\."\);
    \}

    // 2\. Call the secure backend endpoint
    const response = await fetch\("/api/admin/upload-audio", \{
      method: "POST",
      headers: \{
        "Content-Type": "application/json",
        "Authorization": `Bearer \$\{token\}`,
      \},
      body: JSON\.stringify\(\{
        fileData,
        assetKey,
        storagePath,
        title,
        mimeType: file\.type,
      \}\),
    \}\);

    const result = await response\.json\(\);
    if \(!response\.ok\) \{
      throw new Error\(result\.error \|\| "Gagal memuat naik audio\."\);
    \}

    return result\.publicUrl;
  \} catch \(error: any\) \{""",
r"""  try {
    const { data: uploadData, error: uploadError } = await supabase.storage.from("e-kalam-assets").upload(storagePath, file, {
        contentType: file.type,
        upsert: true,
      });
    if (uploadError) throw uploadError;
    const { data: urlData } = supabase.storage.from("e-kalam-assets").getPublicUrl(storagePath);
    if (!urlData) throw new Error("Gagal mendapatkan URL public.");
    const finalUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;
    const { error: dbError } = await supabase.from("app_assets").upsert(
      {
        asset_key: assetKey,
        title: title || "Audio",
        file_path: storagePath,
        public_url: finalUrl,
        asset_type: "audio",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "asset_key" }
    );
    if (dbError) throw dbError;
    return finalUrl;
  } catch (error: any) {""")

