import os

def replace_exact(filepath, old_text, new_text):
    with open(filepath, "r") as f:
        content = f.read()
    content = content.replace(old_text, new_text)
    with open(filepath, "w") as f:
        f.write(content)

old_text = """    try {
      const base64Data = await convertFileToBase64(selectedFile);
      const storagePath = `units/${selectedUnit.id}/${Date.now()}_${selectedFile.name.replace(/\\s+/g, "_")}`;

      const response = await fetch("/api/admin/upload-unit-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          fileData: base64Data.split(",")[1],
          unitId: selectedUnit.id,
          storagePath: storagePath,
          title: `Video ${selectedUnit.label}`,
          fileName: selectedFile.name,
          mimeType: selectedFile.type,
          fileSize: selectedFile.size
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal memuat naik video pembelajaran.");
      }

      setSuccessMsg("Video pembelajaran berjaya dimuat naik dan dikemas kini.");
      fetchHistoryVideos(); // Refresh the list
    } catch (err: any) {"""

new_text = """    try {
      const storagePath = `units/${selectedUnit.id}/${Date.now()}_${selectedFile.name.replace(/\\s+/g, "_")}`;
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
    } catch (err: any) {"""

replace_exact("src/pages/admin/UnitVideoUploadScreen.tsx", old_text, new_text)
