import re

with open("src/pages/admin/AdminDashboardScreen.tsx", "r") as f:
    content = f.read()

# Make sure we add `Video` to lucide-react imports if it's not there
if "Video" not in content and "import {" in content:
    content = content.replace("Music,", "Music, Video,")

new_menu = """          </button>

          {/* Menu 4: Manage Unit Videos */}
          <button
            onClick={() => navigate("/admin/upload-unit-video")}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all text-left group flex flex-col justify-between h-full min-h-[180px]"
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Video className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">
                Muat Naik Video Pembelajaran
              </h3>
              <p className="text-slate-500 text-sm">
                Urus dan muat naik video pembelajaran untuk setiap unit (Unit Pertama hingga Keempat).
              </p>
            </div>
          </button>
        </div>"""

content = content.replace("          </button>\n        </div>", new_menu)

with open("src/pages/admin/AdminDashboardScreen.tsx", "w") as f:
    f.write(content)
