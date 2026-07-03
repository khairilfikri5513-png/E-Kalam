import re

with open("src/pages/admin/UnitVideoUploadScreen.tsx", "r") as f:
    content = f.read()

# Replace fetchHistory to query unit_videos
old_fetch_history = """    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const { data, error } = await supabase.storage.from("e-kalam-assets").list("unit_videos", {
          sortBy: { column: "created_at", order: "desc" },
        });
        if (data) {
          const baseName = selectedUnit.id.replace(/_/g, '-');
          const filtered = data.filter(f => f.name.startsWith(baseName) && f.metadata?.mimetype?.startsWith('video/'));
          setHistoryVideos(filtered);
        }
      } catch (err) {
        console.warn("Failed to fetch history", err);
      } finally {
        setLoadingHistory(false);
      }
    };"""

new_fetch_history = """    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const { data, error } = await supabase
          .from("unit_videos")
          .select("*")
          .eq("unit_id", selectedUnit.id)
          .order("uploaded_at", { ascending: false });
        if (data) {
          setHistoryVideos(data);
        }
      } catch (err) {
        console.warn("Failed to fetch history", err);
      } finally {
        setLoadingHistory(false);
      }
    };"""

content = content.replace(old_fetch_history, new_fetch_history)


old_fetch_current = """        // Fetch current video URL from DB
        const response = await fetch(`/api/assets?keys=${selectedUnit.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data[selectedUnit.id]) {
            setCurrentVideoUrl(data[selectedUnit.id]);
          } else {
            setCurrentVideoUrl(null);
          }
          fetchHistory();
        }"""

new_fetch_current = """        // Fetch current video URL from DB
        const { data, error } = await supabase
          .from("unit_videos")
          .select("video_url")
          .eq("unit_id", selectedUnit.id)
          .eq("status", "active")
          .order("uploaded_at", { ascending: false })
          .limit(1)
          .single();
          
        if (data && data.video_url) {
          setCurrentVideoUrl(data.video_url);
        } else {
          setCurrentVideoUrl(null);
        }
        fetchHistory();"""

content = content.replace(old_fetch_current, new_fetch_current)


# Update history rendering mapping
old_history_render = """              {historyVideos.map((video) => {
                const videoUrl = `${import.meta.env.VITE_SUPABASE_URL || "https://fcsyiabtsxpsccsvhsrl.supabase.co"}/storage/v1/object/public/e-kalam-assets/unit_videos/${video.name}`;
                return (
                  <div key={video.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col">
                    <div className="bg-slate-200 h-48 relative flex items-center justify-center">
                      <VideoWithAudioCheck
                        src={videoUrl}
                        controls
                        playsInline
                        preload="metadata"
                        className="max-w-full max-h-full"
                      />
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 text-sm">
                      <div className="font-bold text-slate-800 break-all line-clamp-2" title={video.name}>{video.name}</div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Unit:</span> {selectedUnit.label}
                      </div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Jenis Fail:</span> {video.metadata?.mimetype}
                      </div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Saiz Fail:</span> {(video.metadata?.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Tarikh Upload:</span> {new Date(video.created_at).toLocaleString('ms-MY')}
                      </div>
                      <div className="text-green-600 font-semibold mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Berjaya diupload
                      </div>
                    </div>
                  </div>
                );
              })}"""

new_history_render = """              {historyVideos.map((video) => {
                const videoUrl = video.video_url;
                return (
                  <div key={video.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col relative">
                    {video.status === 'active' && (
                      <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                        AKTIF
                      </div>
                    )}
                    <div className="bg-slate-200 h-48 relative flex items-center justify-center">
                      <VideoWithAudioCheck
                        src={videoUrl}
                        controls
                        playsInline
                        preload="metadata"
                        className="max-w-full max-h-full"
                      />
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 text-sm">
                      <div className="font-bold text-slate-800 break-all line-clamp-2" title={video.file_name}>{video.file_name}</div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Unit:</span> {selectedUnit.label}
                      </div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Jenis Fail:</span> {video.mime_type}
                      </div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Saiz Fail:</span> {(video.file_size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Tarikh Upload:</span> {new Date(video.uploaded_at).toLocaleString('ms-MY')}
                      </div>
                      <div className="text-green-600 font-semibold mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Berjaya diupload ({video.status})
                      </div>
                    </div>
                  </div>
                );
              })}"""

content = content.replace(old_history_render, new_history_render)

with open("src/pages/admin/UnitVideoUploadScreen.tsx", "w") as f:
    f.write(content)
