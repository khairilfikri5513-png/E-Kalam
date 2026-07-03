import re

with open("src/pages/admin/AvatarUploadScreen.tsx", "r") as f:
    content = f.read()

# We need to extract fetchHistory outside of useEffect or just let's redefine it inside handleUpload or move it to a component level function.

# Let's rewrite how it fetches history
fetch_history_func = """
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase.storage.from("e-kalam-assets").list("avatars", {
        sortBy: { column: "created_at", order: "desc" },
      });
      if (data) {
        const baseName = selectedConfig.assetKey === 'muallim_khairil_avatar' ? 'muallim-khairil-avatar' : 'muallimah-ummi-avatar';
        const filtered = data.filter((f: any) => f.name.startsWith(baseName) && f.metadata?.mimetype?.startsWith('video/'));
        setHistoryVideos(filtered);
      }
    } catch (err) {
      console.warn("Failed to fetch history", err);
    } finally {
      setLoadingHistory(false);
    }
  };
"""

content = content.replace("  useEffect(() => {\n    const fetchHistory = async () => {", fetch_history_func + "\n  useEffect(() => {")

# Remove the internal fetchHistory from useEffect
content = content.replace("""    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const { data, error } = await supabase.storage.from("e-kalam-assets").list("avatars", {
          sortBy: { column: "created_at", order: "desc" },
        });
        if (data) {
          const baseName = selectedConfig.assetKey === 'muallim_khairil_avatar' ? 'muallim-khairil-avatar' : 'muallimah-ummi-avatar';
          const filtered = data.filter(f => f.name.startsWith(baseName) && f.metadata?.mimetype?.startsWith('video/'));
          setHistoryVideos(filtered);
        }
      } catch (err) {
        console.warn("Failed to fetch history", err);
      } finally {
        setLoadingHistory(false);
      }
    };""", "")

with open("src/pages/admin/AvatarUploadScreen.tsx", "w") as f:
    f.write(content)
