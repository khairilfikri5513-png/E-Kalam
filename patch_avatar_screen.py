import re

with open("src/pages/admin/AvatarUploadScreen.tsx", "r") as f:
    content = f.read()

# Add states for history
pattern_states = re.compile(r'const \[currentAvatarUrl, setCurrentAvatarUrl\] = useState<string \| null>\(null\);')
replacement_states = """const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
  const [historyVideos, setHistoryVideos] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);"""
content = pattern_states.sub(replacement_states, content)

# Add fetchHistory function
pattern_fetch = re.compile(r'const checkUserAndFetchAvatar = async \(\) => \{')
replacement_fetch = """const fetchHistory = async () => {
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
    };

    const checkUserAndFetchAvatar = async () => {"""
content = content.replace("const checkUserAndFetchAvatar = async () => {", replacement_fetch)

# Call fetchHistory in checkUserAndFetchAvatar
pattern_call = re.compile(r'if \(data && data\[selectedConfig\.assetKey\]\) \{\n\s*setCurrentAvatarUrl\(data\[selectedConfig\.assetKey\]\);\n\s*\}')
replacement_call = """if (data && data[selectedConfig.assetKey]) {
            setCurrentAvatarUrl(data[selectedConfig.assetKey]);
          }
          fetchHistory();"""
content = pattern_call.sub(replacement_call, content)

# Update the handleUpload success to refresh history
pattern_upload_success = re.compile(r'setCurrentAvatarUrl\(url\);')
replacement_upload_success = """setCurrentAvatarUrl(url);
      fetchHistory();"""
content = pattern_upload_success.sub(replacement_upload_success, content)

# Update preview <video> in the main preview section
pattern_video_main = re.compile(
    r'<video\n\s*src=\{previewUrl \|\| currentAvatarUrl!\}\n\s*controls\n\s*autoPlay\n\s*muted\n\s*loop\n\s*className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg"\n\s*>'
)
replacement_video_main = """<video
                      src={previewUrl || currentAvatarUrl!}
                      controls
                      playsInline
                      preload="metadata"
                      className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg"
                    >"""
content = pattern_video_main.sub(replacement_video_main, content)

# Add the history section below the main card
pattern_render_end = re.compile(r'</div>\n\s*</div>\n\s*</div>\n\s*\);\n\}')
replacement_render_end = """</div>
        </div>

        {/* History Section */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Senarai Video Terdahulu</h3>
          
          {loadingHistory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse bg-slate-100 h-64 rounded-xl"></div>
              ))}
            </div>
          ) : historyVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {historyVideos.map((video) => {
                const videoUrl = `${import.meta.env.VITE_SUPABASE_URL || "https://fcsyiabtsxpsccsvhsrl.supabase.co"}/storage/v1/object/public/e-kalam-assets/avatars/${video.name}`;
                return (
                  <div key={video.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col">
                    <div className="bg-slate-200 h-48 relative flex items-center justify-center">
                      <video
                        src={videoUrl}
                        controls
                        playsInline
                        preload="metadata"
                        className="max-w-full max-h-full"
                      >
                        Browser anda tidak menyokong tag video.
                      </video>
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 text-sm">
                      <div className="font-bold text-slate-800 break-all">{video.name}</div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Nama Pengguna:</span> {selectedConfig.label}
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
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Tiada rekod video terdahulu.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}"""
content = pattern_render_end.sub(replacement_render_end, content)

with open("src/pages/admin/AvatarUploadScreen.tsx", "w") as f:
    f.write(content)
