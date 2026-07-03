import re

with open("src/pages/admin/UnitVideoUploadScreen.tsx", "r") as f:
    content = f.read()

old_refresh = """      // Refresh history
      const { data, error } = await supabase.storage.from("e-kalam-assets").list("unit_videos", {
          sortBy: { column: "created_at", order: "desc" },
      });
      if (data) {
          const baseNameFilter = selectedUnit.id.replace(/_/g, '-');
          const filtered = data.filter(f => f.name.startsWith(baseNameFilter) && f.metadata?.mimetype?.startsWith('video/'));
          setHistoryVideos(filtered);
      }"""

new_refresh = """      // Refresh history
      const { data, error } = await supabase
        .from("unit_videos")
        .select("*")
        .eq("unit_id", selectedUnit.id)
        .order("uploaded_at", { ascending: false });
      if (data) {
        setHistoryVideos(data);
      }"""

content = content.replace(old_refresh, new_refresh)

with open("src/pages/admin/UnitVideoUploadScreen.tsx", "w") as f:
    f.write(content)
