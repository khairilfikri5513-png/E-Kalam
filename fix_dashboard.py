with open("src/pages/admin/AdminDashboardScreen.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "Menu 4: Manage Unit Videos" in line:
        if skip:
            # wait, if it's already there once, skip the next ones?
            pass
        skip = True
    if skip and line.strip() == "</div>":
        pass

# Actually let's just grep the file and rebuild it properly. 
