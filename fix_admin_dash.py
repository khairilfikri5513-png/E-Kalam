with open("src/pages/admin/AdminDashboardScreen.tsx", "r") as f:
    content = f.read()

content = content.replace(
    '            Lihat Aplikasi (Preview)\n          </button>\n\n      </div>\n    </div>\n  );\n}',
    '            Lihat Aplikasi (Preview)\n          </button>\n        </div>\n      </div>\n    </div>\n  );\n}'
)

with open("src/pages/admin/AdminDashboardScreen.tsx", "w") as f:
    f.write(content)

