import re

with open("src/pages/admin/AdminDashboardScreen.tsx", "r") as f:
    content = f.read()

# Remove Menu 4 from the header area
# Lines around 98-116
pattern_remove = r'(\s*{\/\* Menu 4: Manage Unit Videos \*\/}\s*<button.*?onClick=\{\(\) => navigate\("/admin/upload-unit-video"\)\}.*?<\/button>\s*)<\/div>\s*<\/div>\s*<div className="max-w-4xl mx-auto px-6 py-8">'

match = re.search(pattern_remove, content, re.DOTALL)
if match:
    # We want to keep `</div> </div> <div className="max-w-4xl mx-auto px-6 py-8">`
    content = content[:match.start(1)] + '        </div>\n      </div>\n\n      <div className="max-w-4xl mx-auto px-6 py-8">' + content[match.end():]


# Update "Uploaded" text to CheckCircle2 icon
# Ensure CheckCircle2 is imported
if "CheckCircle2" not in content:
    content = content.replace("ShieldCheck, Music", "ShieldCheck, Music, CheckCircle2")

# Replace Uploaded text
old_span = """<span className="absolute bottom-0 right-0 left-0 bg-green-500 text-white text-[8px] font-bold text-center py-0.5 uppercase tracking-wider">
                      Uploaded
                    </span>"""

new_span = """<span className="absolute bottom-0 right-0 left-0 bg-green-500 text-white flex items-center justify-center py-0.5" title="Uploaded">
                      <CheckCircle2 className="w-3 h-3" strokeWidth={3} />
                    </span>"""

content = content.replace(old_span, new_span)

with open("src/pages/admin/AdminDashboardScreen.tsx", "w") as f:
    f.write(content)
